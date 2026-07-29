// The fixed odor vocabulary. Everything in SCENT (molecule labels, the
// lexicon, the LLM fallback schema) is expressed in exactly these terms, so
// this file is the single source of truth for what an axis of the map can be.
//
// The set is drawn from the descriptor vocabulary used by the GoodScents and
// Leffingwell perfumery archives (the labelled set Pyrfume redistributes),
// trimmed to the terms that carry enough support to be worth an axis.
//
// `hue` is an HSL hue angle. Descriptors in the same perceptual family share a
// neighbourhood on the colour wheel, so chips, bars and map points all agree
// without anyone having to read the legend.

export type Descriptor = {
  id: string;
  label: string;
  hue: number;
};

export const DESCRIPTORS: Descriptor[] = [
  // ── green / vegetal ──────────────────────────────────────────────
  { id: "green", label: "green", hue: 120 },
  { id: "herbal", label: "herbal", hue: 108 },
  { id: "grassy", label: "grassy", hue: 128 },
  { id: "hay", label: "hay", hue: 84 },
  { id: "cucumber", label: "cucumber", hue: 136 },
  { id: "mushroom", label: "mushroom", hue: 96 },
  { id: "vegetable", label: "vegetable", hue: 116 },

  // ── citrus / fruit ───────────────────────────────────────────────
  { id: "citrus", label: "citrus", hue: 52 },
  { id: "fruity", label: "fruity", hue: 40 },
  { id: "berry", label: "berry", hue: 348 },
  { id: "apple", label: "apple", hue: 68 },
  { id: "banana", label: "banana", hue: 48 },
  { id: "melon", label: "melon", hue: 76 },
  { id: "tropical", label: "tropical", hue: 36 },
  { id: "grape", label: "grape", hue: 296 },

  // ── floral ───────────────────────────────────────────────────────
  { id: "floral", label: "floral", hue: 330 },
  { id: "rose", label: "rose", hue: 344 },
  { id: "jasmine", label: "jasmine", hue: 318 },
  { id: "violet", label: "violet", hue: 288 },
  { id: "lavender", label: "lavender", hue: 272 },
  { id: "orangeblossom", label: "orange blossom", hue: 336 },

  // ── sweet / gourmand ─────────────────────────────────────────────
  { id: "sweet", label: "sweet", hue: 42 },
  { id: "vanilla", label: "vanilla", hue: 44 },
  { id: "caramellic", label: "caramellic", hue: 32 },
  { id: "honey", label: "honey", hue: 46 },
  { id: "bready", label: "bready", hue: 38 },
  { id: "nutty", label: "nutty", hue: 30 },
  { id: "almond", label: "almond", hue: 34 },
  { id: "cherry", label: "cherry", hue: 352 },
  { id: "coconut", label: "coconut", hue: 50 },
  { id: "cocoa", label: "cocoa", hue: 22 },
  { id: "coffee", label: "coffee", hue: 20 },
  { id: "maple", label: "maple", hue: 28 },

  // ── dairy / fatty ────────────────────────────────────────────────
  { id: "buttery", label: "buttery", hue: 54 },
  { id: "creamy", label: "creamy", hue: 50 },
  { id: "cheesy", label: "cheesy", hue: 60 },
  { id: "fatty", label: "fatty", hue: 56 },
  { id: "waxy", label: "waxy", hue: 58 },

  // ── spice ────────────────────────────────────────────────────────
  { id: "spicy", label: "spicy", hue: 14 },
  { id: "warm", label: "warm", hue: 20 },
  { id: "clove", label: "clove", hue: 18 },
  { id: "cinnamon", label: "cinnamon", hue: 24 },
  { id: "peppery", label: "peppery", hue: 8 },
  { id: "anise", label: "anise", hue: 100 },

  // ── wood / earth / resin ─────────────────────────────────────────
  { id: "woody", label: "woody", hue: 26 },
  { id: "earthy", label: "earthy", hue: 30 },
  { id: "musty", label: "musty", hue: 34 },
  { id: "mossy", label: "mossy", hue: 92 },
  { id: "pine", label: "pine", hue: 140 },
  { id: "resinous", label: "resinous", hue: 36 },
  { id: "balsamic", label: "balsamic", hue: 28 },
  { id: "camphoreous", label: "camphoreous", hue: 168 },

  // ── fresh / cool / air ───────────────────────────────────────────
  { id: "fresh", label: "fresh", hue: 186 },
  { id: "minty", label: "minty", hue: 162 },
  { id: "cooling", label: "cooling", hue: 174 },
  { id: "marine", label: "marine", hue: 200 },
  { id: "ozone", label: "ozone", hue: 208 },
  { id: "aldehydic", label: "aldehydic", hue: 194 },
  { id: "soapy", label: "soapy", hue: 190 },

  // ── burnt / smoke ────────────────────────────────────────────────
  { id: "smoky", label: "smoky", hue: 12 },
  { id: "roasted", label: "roasted", hue: 16 },
  { id: "burnt", label: "burnt", hue: 10 },
  { id: "tarry", label: "tarry", hue: 6 },

  // ── animal / heavy ───────────────────────────────────────────────
  { id: "animalic", label: "animalic", hue: 282 },
  { id: "musk", label: "musk", hue: 300 },
  { id: "leather", label: "leather", hue: 18 },
  { id: "fecal", label: "fecal", hue: 268 },
  { id: "tobacco", label: "tobacco", hue: 26 },

  // ── chemical / sharp ─────────────────────────────────────────────
  { id: "medicinal", label: "medicinal", hue: 244 },
  { id: "phenolic", label: "phenolic", hue: 250 },
  { id: "sulfurous", label: "sulfurous", hue: 72 },
  { id: "alliaceous", label: "alliaceous", hue: 80 },
  { id: "meaty", label: "meaty", hue: 4 },
  { id: "savoury", label: "savoury", hue: 8 },
  { id: "fried", label: "fried", hue: 44 },
  { id: "fishy", label: "fishy", hue: 204 },
  { id: "sweaty", label: "sweaty", hue: 66 },
  { id: "urinous", label: "urinous", hue: 276 },
  { id: "metallic", label: "metallic", hue: 214 },
  { id: "ethereal", label: "ethereal", hue: 220 },
  { id: "solvent", label: "solvent", hue: 232 },
  { id: "rubbery", label: "rubbery", hue: 258 },
  { id: "plastic", label: "plastic", hue: 238 },
  { id: "ammoniacal", label: "ammoniacal", hue: 226 },
  { id: "sour", label: "sour", hue: 64 },
  { id: "winey", label: "winey", hue: 310 },
  { id: "powdery", label: "powdery", hue: 306 },
];

export const DESCRIPTOR_IDS: string[] = DESCRIPTORS.map((d) => d.id);

export const DESCRIPTOR_BY_ID: Record<string, Descriptor> = Object.fromEntries(
  DESCRIPTORS.map((d) => [d.id, d])
);

export const descriptorLabel = (id: string) =>
  DESCRIPTOR_BY_ID[id]?.label ?? id;

export const descriptorHue = (id: string) => DESCRIPTOR_BY_ID[id]?.hue ?? 0;

/** Chip / bar / map-point colour for a descriptor at a given intensity. */
export const descriptorColor = (id: string, alpha = 1) =>
  `hsla(${descriptorHue(id)}, 70%, 62%, ${alpha})`;
