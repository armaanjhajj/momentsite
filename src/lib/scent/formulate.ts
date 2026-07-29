// Turning a set of retrieved molecules into something you could actually build.
//
// Retrieval says "these six molecules are near your memory". That is a result,
// not an instruction. This turns it into a formula: proportions, working
// dilutions, where to buy each material, and the part most people will
// actually use: what to find in a kitchen tonight instead.
//
// The honest caveat, which the UI repeats: proportions here are derived from
// embedding similarity, not from measured odor thresholds. A material that is
// 40% of the formula by similarity might be 2% by weight in a real accord,
// because perceptual intensity varies by orders of magnitude between
// materials. This is a starting point for smelling, not a recipe to trust.

import sourcingData from "@/data/scent/sourcing.json";
import type { Molecule, Neighbour } from "./types";

/**
 * `measured`   verified here against a named primary source
 * `literature` widely reported and commonly cited, not verified here
 * `estimated`  the author's own figure, no citation
 *
 * Nothing currently qualifies as `measured`. No threshold in this project was
 * checked against a primary source, and saying so is cheaper than being caught
 * at it.
 */
export type ThresholdProvenance = "measured" | "literature" | "estimated";

export type Sourcing = {
  kitchen?: string;
  supplier?: string;
  dilution?: string;
  caution?: string;
  thresholdProvenance?: ThresholdProvenance;
};

const SOURCING = sourcingData as unknown as Record<string, Sourcing>;

export function sourcingFor(id: string): Sourcing | null {
  if (id.startsWith("_")) return null;
  return SOURCING[id] ?? null;
}

/** Defaults to `estimated`: an unlabelled number is an unverified one. */
export function thresholdProvenance(id: string): ThresholdProvenance {
  return SOURCING[id]?.thresholdProvenance ?? "estimated";
}

export type FormulaPart = {
  molecule: Molecule;
  /** share of the accord, 0..100, summing to 100 across parts */
  percent: number;
  sourcing: Sourcing | null;
};

export type Formula = {
  parts: FormulaPart[];
  /** parts with a household stand-in, in formula order */
  kitchen: FormulaPart[];
  /** true when at least one material carries a safety note */
  hasCautions: boolean;
};

/**
 * Similarity scores -> percentages.
 *
 * Scores are sharpened before normalising (raised to a power) because raw
 * cosine similarities in a trained embedding sit in a narrow band. Six
 * molecules scoring 0.71 to 0.94 would otherwise all come out near 16%, which
 * says nothing. Sharpening makes the ranking legible without pretending to a
 * precision the numbers do not have.
 */
export function formulate(neighbours: Neighbour[], limit = 5): Formula {
  const chosen = neighbours.slice(0, limit).filter((n) => n.score > 0);
  if (chosen.length === 0) return { parts: [], kitchen: [], hasCautions: false };

  const SHARPEN = 4;
  const weights = chosen.map((n) => Math.pow(Math.max(n.score, 0.001), SHARPEN));
  const total = weights.reduce((s, w) => s + w, 0);

  const raw = chosen.map((n, i) => ({
    molecule: n.molecule,
    percent: (weights[i] / total) * 100,
    sourcing: sourcingFor(n.molecule.id),
  }));

  // Round to whole numbers, then push any rounding drift onto the largest part
  // so the column always sums to exactly 100.
  const rounded = raw.map((p) => ({ ...p, percent: Math.round(p.percent) }));
  const drift = 100 - rounded.reduce((s, p) => s + p.percent, 0);
  if (rounded.length > 0) rounded[0].percent += drift;

  return {
    parts: rounded,
    kitchen: rounded.filter((p) => p.sourcing?.kitchen),
    hasCautions: rounded.some((p) => p.sourcing?.caution),
  };
}
