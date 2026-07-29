export type Molecule = {
  id: string;
  name: string;
  smiles: string;
  descriptors: string[];
  occurrences: string[];
  fact?: string;
  threshold?: string;
};

/** A descriptor and how strongly the memory pulled on it. */
export type Weight = { id: string; value: number };

export type Decomposition = {
  /** descriptor id -> 0..1 */
  weights: Record<string, number>;
  /** the lexicon phrases that fired, for showing your work */
  matched: string[];
  /** words we could not place at all */
  unmatched: string[];
 /** 0..1. Share of the input the lexicon actually consumed */
  confidence: number;
  source: "lexicon" | "lexicon+model";
};

export type Neighbour = {
  molecule: Molecule;
  /** cosine similarity in embedding space, 0..1 */
  score: number;
  /** the descriptors this molecule shares with the query */
  shared: string[];
};

export type ScentResult = {
  decomposition: Decomposition;
  neighbours: Neighbour[];
  /** query position on the 2D map, same space as embedding.json xy */
  xy: [number, number];
};
