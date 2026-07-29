#!/usr/bin/env node
//
// Builds the MSI zoning map.
//
//   node scripts/build-scent-zones.mjs
//
// Cuts odor space into a nested hierarchy of 10 x 10 x 10 x 10 = 10,000 zones,
// so every position has exactly one four digit MSI with no reference smell
// required. Reads public/scent/atlas.json (all 5,548 GS-LF molecules, 48
// dimensions) and writes src/data/scent/zones.json.
//
// THE FOURTH DIGIT IS NOT ANOTHER K-MEANS LEVEL. A fourth clustered level
// would mean storing 10,000 more centroids, roughly a megabyte of JSON in a
// bundle that currently ships 99 KB. The three clustered levels already put
// like with like; the last digit only has to order points inside a cell that
// is already tight. So each leaf cell stores its own dominant axis and nine
// quantile thresholds taken from its members, and the fourth digit is where a
// point falls along that axis. Twenty one numbers per cell instead of a
// hundred and twenty.
//
// NAMES COME FROM THE LEVEL THAT CAN CARRY THEM. Naming a macro zone is naming
// 550 molecules at once, and the highest lift term for such a group is often
// true of only a minority of it. Measured: "new car" lands in macro 7, whose
// top term is vanilla, sitting next to styrene, naphthalene and cymene. The
// number was right and the label was a lie. So every level is named against
// its own parent, and the UI shows the two deepest names rather than the
// broadest.
//
// CLUSTER, THEN ORDER. These are two separate jobs and an earlier version
// conflated them: it quantile split along each group's dominant axis, which
// produces slabs rather than clusters. Two molecules can sit right next to each
// other in 48 dimensions and still fall on opposite sides of a slab boundary,
// and molecules far apart on every other axis share a slab. Measured, a query
// agreed with its own nearest neighbours only 4 times in 10.
//
// So: k-means makes the ten groups, and the dominant axis is used only to sort
// them afterwards. Clustering gives the property that neighbours share a zone;
// ordering gives the property that 346 and 347 are adjacent regions rather than
// merely consecutive integers.
//
// ZONING RUNS IN A REDUCED SUBSPACE. Storing ten 48 dimensional centroids per
// node is far too much JSON to bundle for a lookup table, so the tree lives in
// the top principal components instead. See SUBDIM below for how the number
// was chosen, which was by measurement rather than by taste.
//
// Deterministic: seeded LCG, no Math.random, no Date.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const BRANCH = 10;
const DEPTH = 3;          // clustered levels
const DIGITS = DEPTH + 1; // plus the ordered leaf digit
// Dimensions the zoning runs in. Measured across 12, 16, 24 and 32: the share
// of a molecule's true nearest neighbours landing in its own cell goes 38.2,
// 39.5, 44.2, 44.0 percent, so 24 is where it stops paying. Macro fidelity is
// flat at about 86 percent throughout, which is why the subspace was never the
// reason a macro name looked wrong.
const SUBDIM = Number(process.env.SUBDIM ?? 24);
// Four decimals, not three. Three saves 26 KB and moves "cut grass" from macro
// 6 to macro 3, because that point sits almost exactly on a boundary and half a
// thousandth is enough to tip it. A rounding constant should not be able to
// change what a smell is called.
const ROUND = 4;
const LEAF_ROUND = 3;     // the leaf split does not need four places

const atlas = JSON.parse(readFileSync(join(ROOT, "public", "scent", "atlas.json"), "utf8"));
const K = atlas.k;
const LABELS = atlas.labels;
const RAW = atlas.molecules.map((m) => m.e);
const D = atlas.molecules.map((m) => m.d);
const N = RAW.length;

console.log(`zoning ${N} molecules into ${BRANCH ** DIGITS} zones`);

const UNINFORMATIVE = new Set([
  "bland", "natural", "mild", "dry", "ripe", "sharp", "clean", "odorless",
  "aromatic", "cooked", "brown", "juicy", "cortex", "pungent", "fresh",
]);

const df = new Array(LABELS.length).fill(0);
for (const ds of D) for (const j of ds) df[j]++;

// ── deterministic randomness ────────────────────────────────────────

function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ── linear algebra ──────────────────────────────────────────────────

const dot = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};
const norm = (v) => Math.sqrt(dot(v, v));

function meanOf(rows, dim) {
  const m = new Array(dim).fill(0);
  for (const r of rows) for (let c = 0; c < dim; c++) m[c] += r[c] / rows.length;
  return m;
}

/** Dominant direction of a set of rows, by power iteration. */
function dominantAxis(rows, dim, seed) {
  const mean = meanOf(rows, dim);
  const rnd = lcg(seed);
  let v = Array.from({ length: dim }, () => rnd() - 0.5);
  let n = norm(v);
  for (let c = 0; c < dim; c++) v[c] /= n;

  for (let it = 0; it < 150; it++) {
    const next = new Array(dim).fill(0);
    for (const r of rows) {
      let p = 0;
      for (let c = 0; c < dim; c++) p += (r[c] - mean[c]) * v[c];
      for (let c = 0; c < dim; c++) next[c] += p * (r[c] - mean[c]);
    }
    n = norm(next);
    if (n < 1e-12) break;
    for (let c = 0; c < dim; c++) next[c] /= n;
    const delta = Math.abs(1 - Math.abs(dot(v, next)));
    v = next;
    if (delta < 1e-13) break;
  }

  let big = 0;
  for (let c = 1; c < dim; c++) if (Math.abs(v[c]) > Math.abs(v[big])) big = c;
  if (v[big] < 0) for (let c = 0; c < dim; c++) v[c] = -v[c];
  return { axis: v, mean };
}

// ── PCA down to SUBDIM ──────────────────────────────────────────────

function pcaBasis(rows, dim, want) {
  const mean = meanOf(rows, dim);
  const residual = rows.map((r) => r.map((v, c) => v - mean[c]));
  const basis = [];

  for (let k = 0; k < want; k++) {
    const { axis } = dominantAxis(residual, dim, 9001 + k * 77);
    basis.push(axis);
    // deflate
    for (const r of residual) {
      let p = 0;
      for (let c = 0; c < dim; c++) p += r[c] * axis[c];
      for (let c = 0; c < dim; c++) r[c] -= p * axis[c];
    }
  }
  return { basis, mean };
}

const { basis: BASIS, mean: PCA_MEAN } = pcaBasis(RAW, K, SUBDIM);

const P = RAW.map((r) => {
  const out = new Array(SUBDIM);
  for (let k = 0; k < SUBDIM; k++) {
    let p = 0;
    for (let c = 0; c < K; c++) p += (r[c] - PCA_MEAN[c]) * BASIS[k][c];
    out[k] = p;
  }
  return out;
});
console.log(`  projected ${K} -> ${SUBDIM} dimensions for zoning`);

// ── k-means ─────────────────────────────────────────────────────────

const sqdist = (a, b) => {
  let s = 0;
  for (let c = 0; c < a.length; c++) {
    const d = a[c] - b[c];
    s += d * d;
  }
  return s;
};

/** k-means++ seeding, then Lloyd. Deterministic given `seed`. */
function kmeans(idx, k, seed) {
  const rnd = lcg(seed);
  const pts = idx.map((i) => P[i]);

  const centroids = [pts[Math.floor(rnd() * pts.length)].slice()];
  while (centroids.length < k) {
    const d2 = pts.map((p) => Math.min(...centroids.map((c) => sqdist(p, c))));
    const total = d2.reduce((s, x) => s + x, 0);
    let r = rnd() * total;
    let pick = 0;
    for (let i = 0; i < d2.length; i++) {
      r -= d2[i];
      if (r <= 0) {
        pick = i;
        break;
      }
    }
    centroids.push(pts[pick].slice());
  }

  let assign = new Array(pts.length).fill(0);
  for (let it = 0; it < 60; it++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      let best = 0;
      let bd = Infinity;
      for (let c = 0; c < k; c++) {
        const d = sqdist(pts[i], centroids[c]);
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      if (assign[i] !== best) moved = true;
      assign[i] = best;
    }
    for (let c = 0; c < k; c++) {
      const members = pts.filter((_, i) => assign[i] === c);
      if (members.length === 0) continue;
      centroids[c] = meanOf(members, SUBDIM);
    }
    if (!moved && it > 0) break;
  }

  return { centroids, assign };
}

// ── the leaf split ──────────────────────────────────────────────────
//
// Ten ordered slots inside one already tight cell. Quantiles of the members
// along the cell's own dominant axis, so the ten slots hold roughly equal
// numbers rather than equal widths, and a cell whose members bunch at one end
// still spends all ten digits on them.
//
// A cell with too few members to quantile gets no leaf split at all and its
// fourth digit is 0. That is honest: there is nothing there to order.

const MIN_LEAF = BRANCH; // below this, quantiles are noise

function leafSplit(idx, seed) {
  if (idx.length < MIN_LEAF) return null;

  const rows = idx.map((i) => P[i]);
  const { axis } = dominantAxis(rows, SUBDIM, seed);

  // No mean subtraction. The thresholds are quantiles of the projection, and
  // shifting every projection by the same constant shifts every threshold with
  // it, so the mean cancels and does not have to be stored. That is 24 numbers
  // saved on each of a thousand cells.
  const proj = rows
    .map((r) => {
      let p = 0;
      for (let c = 0; c < SUBDIM; c++) p += r[c] * axis[c];
      return p;
    })
    .sort((a, b) => a - b);

  // Nine cut points at the deciles. Degenerate cells (every member projecting
  // to the same value) collapse to equal thresholds, which is fine: they just
  // send everything to one digit rather than inventing a spread.
  const t = [];
  for (let q = 1; q < BRANCH; q++) {
    t.push(proj[Math.min(proj.length - 1, Math.floor((q * proj.length) / BRANCH))]);
  }

  return {
    a: axis.map((x) => Number(x.toFixed(LEAF_ROUND))),
    t: t.map((x) => Number(x.toFixed(LEAF_ROUND))),
  };
}

// ── recursive build ─────────────────────────────────────────────────

let nodes = 0;

function build(idx, depth, seed) {
  nodes++;
  const k = Math.min(BRANCH, idx.length);
  const { centroids, assign } = kmeans(idx, k, seed);

  // Order the clusters along the group's dominant axis. This is the step that
  // makes MSI a scale: sort the centroids, and consecutive numbers become
  // consecutive regions.
  const { axis, mean } = dominantAxis(
    idx.map((i) => P[i]),
    SUBDIM,
    seed + 13
  );
  const order = centroids
    .map((c, ci) => {
      let p = 0;
      for (let d = 0; d < SUBDIM; d++) p += (c[d] - mean[d]) * axis[d];
      return { ci, p };
    })
    .sort((a, b) => a.p - b.p)
    .map((x) => x.ci);

  const groups = order.map((ci) => idx.filter((_, i) => assign[i] === ci));
  const ordered = order.map((ci) => centroids[ci]);

  // pad so every node has exactly BRANCH slots
  while (ordered.length < BRANCH) ordered.push(ordered[ordered.length - 1].slice());
  while (groups.length < BRANCH) groups.push([]);

  const node = { c: ordered.map((c) => c.map((x) => Number(x.toFixed(ROUND)))) };

  if (depth < DEPTH - 1) {
    // .node, not the wrapper. build() returns { node, groups } and only the
    // node belongs in the shipped tree.
    node.children = groups.map((g, gi) =>
      g.length >= BRANCH * 2 ? build(g, depth + 1, seed * 31 + gi + 1).node : null
    );
  } else {
    // Deepest clustered level, so each of these ten groups is a leaf cell and
    // gets the ordered fourth digit.
    node.leaf = groups.map((g, gi) => leafSplit(g, seed * 31 + gi + 1));
  }

  return { node, groups };
}

const root = build(
  Array.from({ length: N }, (_, i) => i),
  0,
  12345
);

// ── naming ──────────────────────────────────────────────────────────

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── naming ──────────────────────────────────────────────────────────
//
// NOT from the members' own labels. A leaf cell holds about five molecules and
// GS-LF labels them sparsely and idiosyncratically: o-xylene carries only
// "geranium", toluene only "sweet". Counting labels over five such molecules
// is small sample noise, and it is what produced the wrong names. Measured,
// the cell "new car" lands in was named "nutty".
//
// Instead each node is named from the 40 to 120 atlas molecules nearest its
// centroid, weighted by similarity, so a name is supported by dozens of
// molecules even when the cell itself holds five. The same cell then names
// itself phenolic, gasoline, medicinal, smoky.

const NORM = RAW.map((r) => Math.sqrt(dot(r, r)));

/** Centroid of a group, in the full embedding rather than the subspace. */
function anchorOf(idx) {
  const m = new Array(K).fill(0);
  for (const i of idx) for (let c = 0; c < K; c++) m[c] += RAW[i][c] / idx.length;
  return m;
}

/**
 * Rank descriptors for a point by prevalence among its nearest molecules
 * against prevalence in the corpus. Prevalence alone returns whatever is
 * common everywhere; lift alone returns whatever is rare anywhere. The product
 * of prevalence and log ratio wants both.
 */
function nameAt(anchor, near) {
  const an = Math.sqrt(dot(anchor, anchor)) || 1;
  const scored = [];
  for (let i = 0; i < N; i++) {
    scored.push([i, dot(anchor, RAW[i]) / (an * (NORM[i] || 1))]);
  }
  scored.sort((a, b) => b[1] - a[1]);

  const w = new Map();
  let total = 0;
  for (let r = 0; r < near && r < scored.length; r++) {
    const [i, sim] = scored[r];
    // Sharpened, so the closest molecules carry the name and the tail only
    // breaks ties.
    const wt = Math.max(0, sim) ** 6;
    total += wt;
    for (const j of D[i]) w.set(j, (w.get(j) ?? 0) + wt);
  }
  if (total <= 0) return [];

  return [...w.entries()]
    .filter(([j]) => !UNINFORMATIVE.has(LABELS[j]))
    .map(([j, x]) => {
      const pIn = x / total;
      const pAll = Math.max(df[j] / N, 1e-9);
      return [LABELS[j], pIn * Math.log(pIn / pAll)];
    })
    .filter(([, sc]) => sc > 0)
    .sort((a, b) => b[1] - a[1]);
}

// "Minty and mint" is not a name. Compare stems rather than exact strings so
// morphological variants of one descriptor cannot pair up or repeat.
const stem = (w) => w.replace(/(ous|ic|ish|ey|y)$/, "");

function pick(ranked, banned, n) {
  const out = [];
  for (const [name] of ranked) {
    if (banned.has(stem(name))) continue;
    if (out.some((o) => stem(o) === stem(name))) continue;
    out.push(name);
    if (out.length === n) break;
  }
  return out;
}

const macroNames = [];  // 10, the map legend only
const subNames = [];    // 10 x 10, shown as the region
const cellNames = [];   // 10 x 10 x 10, shown as the sub

const usedMacro = new Set();

for (let a = 0; a < BRANCH; a++) {
  const ga = root.groups[a] ?? [];

  // The legend wants ten distinct names, so macros dedup against each other.
  const top = pick(nameAt(anchorOf(ga), 160), usedMacro, 2);
  for (const t of top) usedMacro.add(stem(t));
  macroNames.push(
    top.length >= 2 ? `${titleCase(top[0])} and ${top[1]}` : titleCase(top[0] ?? "Mixed")
  );

  const subs = [];
  const cells = [];

  // build() is deterministic, so this reproduces the groups in the shipped
  // tree exactly.
  const level1 =
    ga.length >= BRANCH * 2 ? build(ga, 1, 12345 * 31 + a + 1).groups : null;

  for (let b = 0; b < BRANCH; b++) {
    const gb = level1?.[b] ?? [];

    // No ban against the macro name. Banning ancestors is what turned the rose
    // region into "Balsamic": the best term was taken and the second best was
    // wrong. Only the pair actually shown together has to differ.
    const nameB = gb.length
      ? pick(nameAt(anchorOf(gb), 80), new Set(), 1)[0]
      : null;
    const region = titleCase(nameB ?? top[0] ?? "Mixed");
    subs.push(region);

    const level2 =
      gb.length >= BRANCH * 2
        ? build(gb, 2, (12345 * 31 + a + 1) * 31 + b + 1).groups
        : null;

    const row = [];
    for (let c = 0; c < BRANCH; c++) {
      const gc = level2?.[c] ?? [];
      const nameC = gc.length
        ? pick(nameAt(anchorOf(gc), 40), new Set([stem(region.toLowerCase())]), 1)[0]
        : null;
      row.push(titleCase(nameC ?? region.toLowerCase()));
    }
    cells.push(row);
  }

  subNames.push(subs);
  cellNames.push(cells);
}

// ── write ───────────────────────────────────────────────────────────

const out = {
  note:
    "MSI zoning map. Three nested k-means levels over the GS-LF embedding, " +
    "each ordered along its dominant axis so adjacent numbers are adjacent " +
    "regions, plus a fourth digit that orders points inside a leaf cell. " +
    "Built by scripts/build-scent-zones.mjs.",
  k: K,
  subdim: SUBDIM,
  branch: BRANCH,
  depth: DEPTH,
  digits: DIGITS,
  molecules: N,
  zones: BRANCH ** DIGITS,
  pcaMean: PCA_MEAN.map((x) => Number(x.toFixed(ROUND))),
  pcaBasis: BASIS.map((b) => b.map((x) => Number(x.toFixed(ROUND)))),
  macroNames,
  subNames,
  cellNames,
  tree: root.node,
};

writeFileSync(join(ROOT, "src", "data", "scent", "zones.json"), JSON.stringify(out) + "\n");

console.log(`  ${nodes} nodes, ${(JSON.stringify(out).length / 1024).toFixed(0)} KB`);
// ── fidelity ────────────────────────────────────────────────────────
//
// The zoning runs in a subspace, so two molecules that are neighbours in the
// full 48 dimensions can still be split apart. This measures how often that
// happens: for a sample of molecules, what share of their ten true nearest
// neighbours land in the same three digit cell.

{
  const cellOf = new Array(N).fill(-1);
  const label = (i) => {
    let node = root.node;
    const p = P[i];
    const d = [];
    for (let lvl = 0; lvl < DEPTH && node; lvl++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < node.c.length; c++) {
        const dd = sqdist(p, node.c[c]);
        if (dd < bd) { bd = dd; best = c; }
      }
      d.push(best);
      node = node.children?.[best] ?? null;
    }
    while (d.length < DEPTH) d.push(0);
    return d[0] * 100 + d[1] * 10 + d[2];
  };
  for (let i = 0; i < N; i++) cellOf[i] = label(i);

  const NORMS = RAW.map((r) => Math.sqrt(dot(r, r)) || 1);
  const rnd = lcg(777);
  let hit = 0, tot = 0, macroHit = 0;
  for (let s = 0; s < 400; s++) {
    const i = Math.floor(rnd() * N);
    const sims = [];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      sims.push([j, dot(RAW[i], RAW[j]) / (NORMS[i] * NORMS[j])]);
    }
    sims.sort((a, b) => b[1] - a[1]);
    for (let r = 0; r < 10; r++) {
      tot++;
      if (cellOf[sims[r][0]] === cellOf[i]) hit++;
      if (Math.floor(cellOf[sims[r][0]] / 100) === Math.floor(cellOf[i] / 100)) macroHit++;
    }
  }
  console.log(
    `\nfidelity at SUBDIM=${SUBDIM}: ${((macroHit / tot) * 100).toFixed(1)}% of true ` +
    `neighbours share the macro zone, ${((hit / tot) * 100).toFixed(1)}% share the cell`
  );
}

console.log("\nmacro regions, in MSI order:");
macroNames.forEach((n, i) => {
  console.log(`  ${i}xx  ${n.padEnd(28)} ${String(root.groups[i]?.length ?? 0).padStart(4)} molecules`);
});
