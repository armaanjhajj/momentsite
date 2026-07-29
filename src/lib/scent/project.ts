// Descriptor weights -> a point on the odor map -> nearest molecules.
//
// The projection has to mirror scripts/build-scent-embedding.mjs exactly: same
// IDF weighting, same L2 normalisation, same component matrix. If the two ever
// drift apart the query lands in a space the molecules do not live in, and the
// results quietly become nonsense rather than visibly breaking.

import embedding from "@/data/scent/embedding.json";
import moleculeData from "@/data/scent/molecules.json";
import type { Molecule, Neighbour } from "./types";

export const MOLECULES = moleculeData as Molecule[];
export const MOLECULES_BY_ID = new Map(MOLECULES.map((m) => [m.id, m]));

const DESCRIPTORS: string[] = embedding.descriptors;
const IDF: number[] = embedding.idf;
const COMPONENTS: number[][] = embedding.components;
const K: number = embedding.k;
const MDS_BASIS: number[][] = embedding.mdsBasis;
const MDS_SCALE: number[] = embedding.mdsScale;

const D_INDEX = new Map(DESCRIPTORS.map((d, i) => [d, i]));

/** Every molecule's precomputed unit-norm embedding, in MOLECULES order. */
const EMBEDDINGS: number[][] = MOLECULES.map(
  (m) => (embedding.embeddings as Record<string, number[]>)[m.id]
);

// JSON import widens the pair arrays to number[]; the build script guarantees
// exactly two entries, so the tuple assertion is safe.
export const MOLECULE_XY = embedding.xy as unknown as Record<string, [number, number]>;
type TrainingMetrics = {
  valMacroAuroc?: number;
  labels?: number;
  trainingMolecules?: number;
};

export const EMBEDDING_META = {
  method: embedding.method as string,
  k: K,
  /** molecules the embedding was fitted over (the full GS-LF set) */
  molecules: embedding.molecules as number,
  /** molecules with hand-written occurrences, facts and sourcing */
  curated: MOLECULES.length,
  explainedVariance: embedding.explainedVariance as number,
  descriptors: DESCRIPTORS.length,
  training: ((embedding as Record<string, unknown>).trainingMetrics ??
    {}) as TrainingMetrics,
  isGnn: (embedding.method as string) === "gnn-dmpnn",
};

const dot = (a: number[], b: number[]) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

const unit = (v: number[]) => {
  const n = Math.sqrt(dot(v, v));
  return n > 0 ? v.map((x) => x / n) : v;
};

/**
 * Weights -> a unit vector in the K-dimensional odor space.
 * Returns null when nothing in the vocabulary was touched at all.
 */
export function project(weights: Record<string, number>): number[] | null {
  const raw = new Array<number>(DESCRIPTORS.length).fill(0);
  let any = false;

  for (const [id, w] of Object.entries(weights)) {
    const j = D_INDEX.get(id);
    if (j === undefined || w <= 0) continue;
    raw[j] = w * IDF[j]; // same TF-IDF weighting the corpus got
    any = true;
  }
  if (!any) return null;

  const x = unit(raw);
  const e = new Array<number>(K).fill(0);
  for (let c = 0; c < K; c++) e[c] = dot(x, COMPONENTS[c]);

  const n = Math.sqrt(dot(e, e));
  if (n < 1e-9) return null;
  return e.map((v) => v / n);
}

/** Where a query vector sits on the drawn 2D map. */
export function projectXY(e: number[]): [number, number] {
  return [dot(e, MDS_BASIS[0]) * MDS_SCALE[0], dot(e, MDS_BASIS[1]) * MDS_SCALE[1]];
}

/**
 * Cosine nearest neighbours. 152 molecules is small enough that brute force is
 * instant, knowing you do not need a vector database here is the point.
 */
export function neighbours(
  e: number[],
  queryWeights: Record<string, number>,
  limit = 6
): Neighbour[] {
  const active = new Set(
    Object.entries(queryWeights)
      .filter(([, w]) => w > 0.15)
      .map(([id]) => id)
  );

  return MOLECULES.map((molecule, i) => ({
    molecule,
    score: dot(e, EMBEDDINGS[i]),
    shared: molecule.descriptors.filter((d) => active.has(d)),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((n) => ({ ...n, score: Math.max(0, Math.min(1, n.score)) }));
}

// ── operations that only exist because this is a coordinate system ──
//
// Neither of these can be faked with a lookup table: you cannot negate a tag,
// and you cannot ask a tag index what sits furthest from a point.

/**
 * Opposite. The anti-smell.
 *
 * Negating a unit vector gives the point of minimum cosine similarity, so its
 * nearest neighbours are the molecules furthest from the original in the
 * learned geometry. Worth being precise about what this is not: it is the
 * furthest point in *descriptor-correlation* space, not a molecule that
 * cancels the first one on the nose. There is no such thing as anti-coffee in
 * a glass; there is only the far side of the map.
 */
export function opposite(e: number[]): number[] {
  return e.map((v) => -v);
}

/**
 * Read a point in the embedding back out as descriptor words.
 *
 * Needed because the inverse of a memory is a coordinate, and a coordinate is
 * not something anyone can be asked to imagine.
 *
 * The obvious implementation scores the point against each descriptor's own
 * direction (its column of the component matrix). That was tried and it lies:
 * those directions come from a ridge regression, and the ones fitted on very
 * few molecules are close to arbitrary. Anti-coffee came back as "sweaty" while
 * its nearest molecules were nerol and geraniol, which are unmistakably rose.
 *
 * So the naming is grounded in the corpus instead. Take the molecules actually
 * nearest the point and tally the descriptors real perfumers gave them,
 * weighted by how near each molecule is and by IDF so that "sweet", which
 * labels a third of the set, cannot win by sheer commonness.
 */
export function describe(
  e: number[],
  limit = 3
): Array<{ id: string; score: number }> {
  const near = neighbours(e, {}, 5);
  const tally = new Map<string, number>();

  for (const n of near) {
    for (const d of n.molecule.descriptors) {
      const j = D_INDEX.get(d);
      if (j === undefined) continue;
      tally.set(d, (tally.get(d) ?? 0) + n.score * IDF[j]);
    }
  }

  return [...tally.entries()]
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** A curated molecule's position, for zoning and colouring. */
export function moleculeVector(id: string): number[] {
  return (embedding.embeddings as Record<string, number[]>)[id];
}

/** The dominant descriptor for a molecule, used to colour it on the map. */
export function dominantDescriptor(m: Molecule): string {
  let best = m.descriptors[0];
  let bestIdf = -Infinity;
  for (const d of m.descriptors) {
    const j = D_INDEX.get(d);
    if (j === undefined) continue;
    if (IDF[j] > bestIdf) {
      bestIdf = IDF[j];
      best = d;
    }
  }
  return best;
}
