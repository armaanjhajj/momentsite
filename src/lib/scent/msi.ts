// MSI, the Moments Sense Index.
//
// An absolute postcode for a position in perceptual space. Every point has
// exactly one five digit MSI and needs no reference to compute it, which is
// the whole difference from a pairwise distance: "backyard bonfire is a
// 1·9472" is a sentence someone can say out loud and someone else can look up.
//
// The leading digit is the sense band. Five senses, 1000 zones each, 5000
// codes in total, so a code carries its own modality and two bands can never
// be confused for one another. Scent is band 1 because it is the sense wired
// hardest into memory, and because it is the one that is built.
//
// The zoning is a nested k-means hierarchy, 10 x 10 x 10, built offline by
// scripts/build-scent-zones.mjs over all 5,548 GS-LF molecules, plus a fourth
// digit that orders points along their leaf cell's dominant axis. Clustering
// makes the groups, so points that are neighbours in the embedding share a
// zone. The dominant axis of each group then only sorts its ten clusters, so
// 3460 and 3470 are neighbouring regions rather than merely consecutive
// integers. Assignment at query time is a nearest centroid descent, then one
// projection.
//
// THE NAMES DO NOT COME FROM THE MACRO DIGIT. A macro zone is 550 molecules
// and its highest lift term is often true of a minority of them: "new car"
// landed in the macro whose top term is vanilla, next to styrene and
// naphthalene, and read as "Vanilla and phenolic" when it is a solvent smell.
// `region` and `sub` below are the second and third level names, each fitted
// against its own parent, because those are the levels small enough for a name
// to be true. The macro name survives only as the map legend.
//
// Two limits, both inherent to any zoning system and both surfaced in the UI:
//
//   COLLISIONS ARE GUARANTEED. Compressing 48 dimensions into 1000 buckets
//   means genuinely different smells will sometimes share a zone. MSI is a
//   postcode, not an address. The full descriptor profile remains the precise
//   location; MSI is the handle you say out loud.
//
//   BOUNDARIES ARE ARBITRARY AT THE EDGES. Two near identical smells can
//   straddle a line and take different first digits. Ordering the clusters
//   keeps the damage small, since neighbouring zones really are neighbouring,
//   and `edge` below reports when a point sits close enough to a boundary that
//   the reader should know.

import zones from "@/data/scent/zones.json";
import { SENSES, SENSE_SCENT, SENSE_COUNT, SENSE_SEP } from "./senses";

type Node = {
  /** ten ordered centroids, in the zoning subspace */
  c: number[][];
  children?: (Node | null)[];
  /** on the deepest clustered level: how to order points inside each cell */
  leaf?: (Leaf | null)[];
};

/**
 * A leaf cell's own axis and nine decile cut points along it. No mean: the
 * thresholds are quantiles of the raw projection, so a shift common to every
 * point cancels.
 */
type Leaf = { a: number[]; t: number[] };

const TREE = zones.tree as Node;
const BRANCH: number = zones.branch;
const SUBDIM: number = zones.subdim;
const PCA_MEAN: number[] = zones.pcaMean;
const PCA_BASIS: number[][] = zones.pcaBasis;
const MACRO: string[] = zones.macroNames;
const SUB: string[][] = zones.subNames;
const CELL: string[][][] = zones.cellNames;
const DIGITS: number = zones.digits;

export const ZONE_COUNT: number = zones.zones;
export const ZONING_MOLECULES: number = zones.molecules;
export const MACRO_NAMES = MACRO;

// The band names live in senses.ts so a component that only needs to list
// them does not have to import zones.json to get them.
export { SENSES, SENSE_SCENT, SENSE_COUNT, SENSE_SEP } from "./senses";

export const TOTAL_ZONES = SENSE_COUNT * ZONE_COUNT;

export type Msi = {
  /** which sense, 1 to 5. Always 1 here. */
  sense: number;
  /** display name of the band, e.g. "Scent" */
  senseName: string;
  /** 0 to 9999 within the band */
  zone: number;
  /** zero padded zone, without the band */
  zoneLabel: string;
  /** 10000 x sense + zone, e.g. 13472 */
  code: number;
  /** the form you would read aloud, e.g. "1·3472" */
  label: string;
  digits: [number, number, number, number];
  /** the broadest name, 1 of 10. Map legend only, too coarse to be quoted. */
  band: string;
  /** second level name, e.g. "Solvent" */
  region: string;
  /** third level name, e.g. "Tarry" */
  sub: string;
  /**
   * Set when the point sits close to a macro boundary, naming the zone it is
   * nearly in. Null when it is comfortably inside its own.
   */
  edge: { toward: number; towardLabel: string; towardRegion: string } | null;
};

/** Embedding position into the lower dimensional space the zoning lives in. */
function toSubspace(v: number[]): number[] {
  const out = new Array<number>(SUBDIM);
  for (let k = 0; k < SUBDIM; k++) {
    let p = 0;
    const b = PCA_BASIS[k];
    for (let c = 0; c < v.length; c++) p += (v[c] - PCA_MEAN[c]) * b[c];
    out[k] = p;
  }
  return out;
}

const sqdist = (a: number[], b: number[]) => {
  let s = 0;
  for (let c = 0; c < a.length; c++) {
    const d = a[c] - b[c];
    s += d * d;
  }
  return s;
};

/** Nearest centroid, plus the runner up, which is what edge detection needs. */
function nearestCentroid(node: Node, p: number[]) {
  let best = 0;
  let bestD = Infinity;
  let second = 0;
  let secondD = Infinity;

  for (let i = 0; i < node.c.length; i++) {
    const d = sqdist(p, node.c[i]);
    if (d < bestD) {
      secondD = bestD;
      second = best;
      bestD = d;
      best = i;
    } else if (d < secondD) {
      secondD = d;
      second = i;
    }
  }
  return { best, bestD, second, secondD };
}

// A point is called "near the edge" when the runner up zone is within this
// ratio of the winner. Straddling is inherent to any zoning system, so the
// honest move is to report it rather than pretend the line is meaningful.
const EDGE_RATIO = 1.18;

export function msiFor(vec: number[]): Msi {
  const p = toSubspace(vec);

  const top = nearestCentroid(TREE, p);
  const d0 = top.best;

  const macroNode = TREE.children?.[d0] ?? null;
  const d1 = macroNode ? nearestCentroid(macroNode, p).best : 0;

  const subNode = macroNode?.children?.[d1] ?? null;
  const d2 = subNode ? nearestCentroid(subNode, p).best : 0;

  // Fourth digit: where the point falls along its leaf cell's own axis. Cells
  // with too few members to quantile carry no split, and their fourth digit is
  // 0 rather than a number invented from nothing.
  const leaf = subNode?.leaf?.[d2] ?? null;
  let d3 = 0;
  if (leaf) {
    let proj = 0;
    for (let c = 0; c < SUBDIM; c++) proj += p[c] * leaf.a[c];
    while (d3 < leaf.t.length && proj >= leaf.t[d3]) d3++;
  }

  const zone = d0 * 1000 + d1 * 100 + d2 * 10 + d3;
  const zoneLabel = String(zone).padStart(DIGITS, "0");

  // Macro level only. A sub level boundary moves the last digit, which nobody
  // is going to quote; a macro boundary moves the first digit and changes the
  // region name, which is worth saying out loud.
  const ratio = Math.sqrt(top.secondD) / Math.max(Math.sqrt(top.bestD), 1e-9);
  const edge =
    ratio < EDGE_RATIO
      ? {
          toward: top.second,
          towardLabel: `${SENSE_SCENT}${SENSE_SEP}${top.second}xxx`,
          towardRegion: MACRO[top.second],
        }
      : null;

  return {
    sense: SENSE_SCENT,
    senseName: SENSES[SENSE_SCENT - 1],
    zone,
    zoneLabel,
    code: SENSE_SCENT * 10000 + zone,
    label: `${SENSE_SCENT}${SENSE_SEP}${zoneLabel}`,
    digits: [d0, d1, d2, d3],
    band: MACRO[d0] ?? "Mixed",
    region: SUB[d0]?.[d1] ?? MACRO[d0] ?? "Mixed",
    sub: CELL[d0]?.[d1]?.[d2] ?? SUB[d0]?.[d1] ?? "Mixed",
    edge,
  };
}

/** Just the macro digit, for colouring the map. */
export function macroZone(vec: number[]): number {
  return nearestCentroid(TREE, toSubspace(vec)).best;
}

/** A stored code back into the form people read. */
export function formatCode(code: number): string {
  const sense = Math.floor(code / 10000);
  return `${sense}${SENSE_SEP}${String(code % 10000).padStart(DIGITS, "0")}`;
}
