#!/usr/bin/env node
//
// SUPERSEDED. DO NOT RUN THIS TO REBUILD THE SITE.
//
// This is the pre-GNN estimator. It writes src/data/scent/embedding.json, the
// same file python/scent/embed.py writes, so running it silently replaces the
// trained D-MPNN coordinates with TF-IDF + SVD ones and downgrades every
// number on the page. The shipped file identifies itself: `method` reads
// "gnn-dmpnn" when it came from the model and "tfidf+svd" when it came from
// here.
//
// It is kept because it documents the fallback estimator and still runs
// without a Python toolchain, and because the two writing the same format is
// the seam that let the model drop in. It refuses to run unless you say so:
//
//   SCENT_ALLOW_LEGACY_EMBEDDING=1 npm run scent:build:legacy
//
// To rebuild the real coordinates:
//
//   cd python && .venv/bin/python -m scent.embed --checkpoint runs/best.pt
//
// Reads src/data/scent/{molecules.json,descriptors.ts} and writes
// src/data/scent/embedding.json. The coordinate system the whole site runs on.
//
// The pipeline is latent semantic analysis over the molecule x descriptor
// matrix:
//
//   1. binary incidence matrix        (152 molecules x 87 descriptors)
//   2. TF-IDF column weighting        rare descriptors carry more signal than
//                                     "sweet", which is on a third of the set
//   3. L2-normalise rows              so a molecule with 5 labels does not
//                                     outweigh one with 3
//   4. truncated SVD to rank K        the learned axes
//   5. classical MDS to 2D            the drawable map
//
// Step 4 is the whole thesis in miniature: the embedding, not the labels, is
// the artefact. Two molecules that share no descriptor at all can still land
// near each other if their descriptors co-occur elsewhere in the corpus, which
// is exactly the behaviour a bag-of-labels lookup cannot give you.
//
// This is NOT the GNN from python/. It is the same idea (keep the internal
// representation, throw away the prediction) fitted with a much cheaper
// estimator, because a GNN needs a Python runtime and this site does not have
// one. python/scent/embed.py writes this identical file format, so training the
// real model is a drop-in replacement for this script.
//
// Fully deterministic: no Math.random, no Date. Re-running must reproduce the
// file byte for byte, which the verification step checks.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// The guard. An accidental `npm run scent:build:legacy` costs the trained
// embedding and there is no git history here to restore it from, so the
// refusal is deliberate rather than advisory.
if (process.env.SCENT_ALLOW_LEGACY_EMBEDDING !== "1") {
  console.error(
    [
      "",
      "  REFUSING TO RUN.",
      "",
      "  This is the superseded TF-IDF + SVD estimator. Running it overwrites",
      "  src/data/scent/embedding.json and replaces the trained D-MPNN",
      "  coordinates the site ships.",
      "",
      "  To rebuild the real embedding:",
      "    cd python && .venv/bin/python -m scent.embed --checkpoint runs/best.pt",
      "",
      "  If you genuinely want the legacy estimator:",
      "    SCENT_ALLOW_LEGACY_EMBEDDING=1 npm run scent:build:legacy",
      "",
    ].join("\n")
  );
  process.exit(1);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "src", "data", "scent");

const K = 16; // embedding rank
const ROUND = 6; // decimal places written to JSON (keeps the file diffable)

// ── load ────────────────────────────────────────────────────────────

const molecules = JSON.parse(readFileSync(join(DATA, "molecules.json"), "utf8"));

// descriptors.ts is the source of truth for vocabulary *order*, which the
// query path depends on (a descriptor vector is positional). Pulled out by
// regex rather than importing, so this stays a dependency-free .mjs script.
const dsrc = readFileSync(join(DATA, "descriptors.ts"), "utf8");
const DESCRIPTORS = [...dsrc.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
const dIndex = new Map(DESCRIPTORS.map((d, i) => [d, i]));

const N = molecules.length;
const D = DESCRIPTORS.length;

for (const m of molecules) {
  for (const d of m.descriptors) {
    if (!dIndex.has(d)) {
      console.error(`FATAL: ${m.id} uses "${d}", which is not in descriptors.ts`);
      process.exit(1);
    }
  }
}

// ── 1. incidence matrix ─────────────────────────────────────────────

const X = molecules.map((m) => {
  const row = new Float64Array(D);
  for (const d of m.descriptors) row[dIndex.get(d)] = 1;
  return row;
});

// ── 2. TF-IDF ───────────────────────────────────────────────────────

const df = new Float64Array(D);
for (const row of X) for (let j = 0; j < D; j++) if (row[j] > 0) df[j]++;

// Smoothed IDF. +1 inside the log keeps a descriptor that labels every
// molecule at a small positive weight rather than exactly zero.
const idf = new Float64Array(D);
for (let j = 0; j < D; j++) idf[j] = Math.log((1 + N) / (1 + df[j])) + 1;

for (const row of X) for (let j = 0; j < D; j++) row[j] *= idf[j];

// ── 3. L2-normalise rows ────────────────────────────────────────────

const l2 = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));

for (const row of X) {
  const n = l2(row);
  if (n > 0) for (let j = 0; j < D; j++) row[j] /= n;
}

// ── 4. truncated SVD (NIPALS power iteration with deflation) ────────
//
// Deterministic seeding: each component starts from a fixed unit vector
// derived from its own index, so there is no RNG anywhere in the build.

const dot = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

const seedVector = (comp) => {
  // A fixed, well-spread starting direction. Using cos of an irrational
  // multiple avoids accidentally landing orthogonal to the true component.
  const v = new Float64Array(D);
  for (let j = 0; j < D; j++) v[j] = Math.cos((j + 1) * (comp + 1) * 0.7548776662466927);
  const n = l2(v);
  for (let j = 0; j < D; j++) v[j] /= n;
  return v;
};

const R = X.map((row) => Float64Array.from(row)); // residual, deflated in place
const V = []; // D-dim right singular vectors (descriptor loadings)
const S = []; // singular values
const U = []; // N-dim left singular vectors

const totalVariance = R.reduce((s, row) => s + dot(row, row), 0);

for (let c = 0; c < K; c++) {
  let v = seedVector(c);
  let sigma = 0;
  let u = new Float64Array(N);

  for (let iter = 0; iter < 300; iter++) {
    // u = R v, normalised
    for (let i = 0; i < N; i++) u[i] = dot(R[i], v);
    const un = l2(u);
    if (un < 1e-12) break;
    for (let i = 0; i < N; i++) u[i] /= un;

    // v = R^T u, normalised
    const vNext = new Float64Array(D);
    for (let i = 0; i < N; i++) {
      const ui = u[i];
      if (ui === 0) continue;
      const row = R[i];
      for (let j = 0; j < D; j++) vNext[j] += ui * row[j];
    }
    const vn = l2(vNext);
    if (vn < 1e-12) break;
    for (let j = 0; j < D; j++) vNext[j] /= vn;

    const delta = Math.abs(1 - Math.abs(dot(v, vNext)));
    v = vNext;
    sigma = vn;
    if (delta < 1e-11) break;
  }

  // Sign convention: make the largest-magnitude loading positive. Without
  // this, an arbitrary sign flip would change the output file between runs
  // on different hardware even though the maths is identical.
  let big = 0;
  for (let j = 1; j < D; j++) if (Math.abs(v[j]) > Math.abs(v[big])) big = j;
  if (v[big] < 0) {
    for (let j = 0; j < D; j++) v[j] = -v[j];
    for (let i = 0; i < N; i++) u[i] = -u[i];
  }

  V.push(v);
  S.push(sigma);
  U.push(Float64Array.from(u));

  // deflate: R := R - sigma * u v^T
  for (let i = 0; i < N; i++) {
    const f = u[i] * sigma;
    if (f === 0) continue;
    const row = R[i];
    for (let j = 0; j < D; j++) row[j] -= f * v[j];
  }
}

const explained = S.reduce((s, x) => s + x * x, 0) / totalVariance;

// Molecule embedding = U * S, then unit-normalised so cosine similarity is a
// plain dot product at query time.
const embeddings = molecules.map((m, i) => {
  const e = new Float64Array(K);
  for (let c = 0; c < K; c++) e[c] = U[c][i] * S[c];
  const n = l2(e);
  if (n > 0) for (let c = 0; c < K; c++) e[c] /= n;
  return e;
});

// ── 5. classical MDS to 2D ──────────────────────────────────────────
//
// Double-centre the squared-distance matrix, then take the top two
// eigenvectors by power iteration. Deterministic, and it needs no Python
// a UMAP would look slightly prettier and would not be reproducible here.

const sqdist = [];
for (let i = 0; i < N; i++) {
  const row = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    let s = 0;
    for (let c = 0; c < K; c++) {
      const d = embeddings[i][c] - embeddings[j][c];
      s += d * d;
    }
    row[j] = s;
  }
  sqdist.push(row);
}

const rowMean = new Float64Array(N);
let grandMean = 0;
for (let i = 0; i < N; i++) {
  let s = 0;
  for (let j = 0; j < N; j++) s += sqdist[i][j];
  rowMean[i] = s / N;
  grandMean += s;
}
grandMean /= N * N;

// B = -0.5 * J D^2 J
const B = [];
for (let i = 0; i < N; i++) {
  const row = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    row[j] = -0.5 * (sqdist[i][j] - rowMean[i] - rowMean[j] + grandMean);
  }
  B.push(row);
}

const topEigen = (M, seedIdx, previous) => {
  let v = new Float64Array(N);
  for (let i = 0; i < N; i++) v[i] = Math.cos((i + 1) * (seedIdx + 1) * 1.3247179572447458);
  let n = l2(v);
  for (let i = 0; i < N; i++) v[i] /= n;

  let lambda = 0;
  for (let iter = 0; iter < 500; iter++) {
    const w = new Float64Array(N);
    for (let i = 0; i < N; i++) w[i] = dot(M[i], v);

    // Gram-Schmidt against already-extracted eigenvectors
    for (const p of previous) {
      const c = dot(w, p);
      for (let i = 0; i < N; i++) w[i] -= c * p[i];
    }

    n = l2(w);
    if (n < 1e-12) break;
    for (let i = 0; i < N; i++) w[i] /= n;
    const delta = Math.abs(1 - Math.abs(dot(v, w)));
    v = w;
    lambda = n;
    if (delta < 1e-12) break;
  }

  let big = 0;
  for (let i = 1; i < N; i++) if (Math.abs(v[i]) > Math.abs(v[big])) big = i;
  if (v[big] < 0) for (let i = 0; i < N; i++) v[i] = -v[i];

  return { vec: v, lambda };
};

const e1 = topEigen(B, 0, []);
const e2 = topEigen(B, 1, [e1.vec]);

const axis1 = Math.sqrt(Math.max(e1.lambda, 0));
const axis2 = Math.sqrt(Math.max(e2.lambda, 0));

let coords = molecules.map((_, i) => [e1.vec[i] * axis1, e2.vec[i] * axis2]);

// Scale into [-1, 1] preserving aspect ratio, so the front end can map to any
// canvas size without distorting the geometry.
const maxAbs = Math.max(...coords.flat().map(Math.abs)) || 1;
coords = coords.map(([x, y]) => [x / maxAbs, y / maxAbs]);

// The MDS basis, expressed in embedding space, so a query point can be placed
// on the same map without re-running MDS over the whole corpus. Recovered by
// least squares: axis_c = sum_i vec[i] * embedding[i] (the embeddings are
// unit-norm and near-orthogonal after SVD, so this projection is well behaved).
const mdsBasis = [0, 1].map((k) => {
  const src = k === 0 ? e1.vec : e2.vec;
  const b = new Float64Array(K);
  for (let i = 0; i < N; i++) for (let c = 0; c < K; c++) b[c] += src[i] * embeddings[i][c];
  return b;
});

// Calibrate the basis so projecting a known molecule reproduces its plotted
// position. Without this the query ring lands on a different scale to the dots.
const mdsScale = [0, 1].map((k) => {
  let num = 0;
  let den = 0;
  for (let i = 0; i < N; i++) {
    const p = dot(embeddings[i], mdsBasis[k]);
    num += p * coords[i][k];
    den += p * p;
  }
  return den > 0 ? num / den : 0;
});

// ── write ───────────────────────────────────────────────────────────

const r = (x) => Number(x.toFixed(ROUND));
const rArr = (a) => Array.from(a, r);

const out = {
  // provenance, so nobody has to guess how the file was made
  method: "tfidf+svd",
 note: "Built by scripts/build-scent-embedding.mjs. Not a GNN embedding. See python/ for that pipeline.",
  k: K,
  molecules: N,
  explainedVariance: r(explained),
  descriptors: DESCRIPTORS,
  idf: rArr(idf),
  // V[c][j] (loading of descriptor j on component c)
  components: V.map(rArr),
  singularValues: rArr(S),
  mdsBasis: mdsBasis.map(rArr),
  mdsScale: rArr(mdsScale),
  embeddings: Object.fromEntries(molecules.map((m, i) => [m.id, rArr(embeddings[i])])),
  xy: Object.fromEntries(molecules.map((m, i) => [m.id, [r(coords[i][0]), r(coords[i][1])]])),
};

writeFileSync(join(DATA, "embedding.json"), JSON.stringify(out, null, 1) + "\n");

// ── report ──────────────────────────────────────────────────────────

console.log(
  `built odor map: ${N} molecules x ${D} descriptors -> ${K}-D embedding`
);
console.log(
  `  variance retained by top ${K} components: ${(explained * 100).toFixed(1)}%`
);
console.log(
  `  MDS axes: ${(((e1.lambda + e2.lambda) / S.reduce((s, x) => s + x * x, 0)) * 100).toFixed(1)}% of embedding variance drawn`
);

// Sanity: the strongest descriptor on each of the first few axes, which is the
// cheapest way to see whether the components mean anything.
for (let c = 0; c < Math.min(5, K); c++) {
  const top = DESCRIPTORS.map((d, j) => [d, V[c][j]])
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 5)
    .map(([d, w]) => `${d}${w < 0 ? "−" : "+"}`)
    .join(" ");
  console.log(`  axis ${c}: ${top}`);
}
