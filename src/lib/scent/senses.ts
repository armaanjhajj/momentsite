// The sense bands, on their own.
//
// Separate from msi.ts on purpose. That module imports zones.json, which is
// 99 KB of k-means centroids, and any client component that only wants to
// name the five bands would drag the whole thing into its bundle. msi.ts
// re-exports these, so there is still one source of truth.

/**
 * Only scent is built; the rest are reserved so the numbering does not have to
 * change when they are, and so a scent code cannot silently become a taste
 * code later.
 */
export const SENSES = ["Scent", "Taste", "Sound", "Sight", "Touch"] as const;

/** Scent. First band, first built. */
export const SENSE_SCENT = 1;
export const SENSE_COUNT = SENSES.length;

/** The separator between the sense band and the zone, in every rendered code. */
export const SENSE_SEP = "·";
