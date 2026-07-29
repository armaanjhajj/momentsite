// The polygon axes.
//
// A radar chart is only readable if every chart has the SAME axes in the SAME
// order. Plotting each query's top-8 descriptors would produce a shape that
// cannot be compared with any other shape, which is exactly the failure mode
// of the bar list it replaces.
//
// So the 87-term vocabulary collapses onto 14 fixed families. Every memory and
// every molecule gets a 14-vector, always in this order, and two of them can be
// laid on top of each other and read instantly.
//
// 14 rather than 12: dropping the sulfur or chemical axis would make "cut
// onions" and "wet dog", or "a new car" and "a campfire", render as near
// identical shapes. Distinctions that the nose obviously makes should survive
// into the picture.

import { DESCRIPTOR_IDS } from "./descriptors";

export type Family = {
  id: string;
  label: string;
  hue: number;
  members: string[];
};

export const FAMILIES: Family[] = [
  {
    id: "green",
    label: "green",
    hue: 120,
    members: ["green", "grassy", "herbal", "hay", "cucumber", "vegetable", "mossy"],
  },
  {
    id: "citrus",
    label: "citrus",
    hue: 52,
    members: ["citrus"],
  },
  {
    id: "fruity",
    label: "fruity",
    hue: 36,
    members: [
      "fruity", "berry", "apple", "banana", "melon", "tropical", "grape",
      "cherry", "winey", "sour",
    ],
  },
  {
    id: "floral",
    label: "floral",
    hue: 330,
    members: ["floral", "rose", "jasmine", "violet", "lavender", "orangeblossom"],
  },
  {
    id: "sweet",
    label: "sweet",
    hue: 44,
    members: ["sweet", "vanilla", "caramellic", "honey", "maple", "coconut", "powdery"],
  },
  {
    id: "baked",
    label: "baked",
    hue: 28,
    members: ["bready", "roasted", "nutty", "almond", "cocoa", "coffee"],
  },
  {
    id: "creamy",
    label: "creamy",
    hue: 54,
    members: ["creamy", "buttery", "cheesy", "fatty", "waxy"],
  },
  {
    id: "spicy",
    label: "spicy",
    hue: 14,
    members: ["spicy", "clove", "cinnamon", "peppery", "anise", "warm"],
  },
  {
    id: "woody",
    label: "woody",
    hue: 26,
    members: [
      "woody", "earthy", "musty", "pine", "resinous", "balsamic", "tobacco",
      "leather", "mushroom",
    ],
  },
  {
    id: "fresh",
    label: "fresh",
    hue: 186,
    members: ["fresh", "minty", "cooling", "camphoreous", "marine", "ozone", "aldehydic", "soapy"],
  },
  {
    id: "smoky",
    label: "smoky",
    hue: 12,
    members: ["smoky", "burnt", "tarry", "phenolic", "medicinal"],
  },
  {
    id: "animal",
    label: "animal",
    hue: 290,
    members: ["animalic", "musk", "fecal", "sweaty", "urinous", "fishy", "ammoniacal"],
  },
  {
    id: "sulfur",
    label: "sulfur",
    hue: 76,
    members: ["sulfurous", "alliaceous", "meaty", "savoury", "fried"],
  },
  {
    id: "chemical",
    label: "chemical",
    hue: 232,
    members: ["solvent", "ethereal", "plastic", "rubbery", "metallic"],
  },
];

export const FAMILY_COUNT = FAMILIES.length;

const FAMILY_OF: Record<string, number> = {};
FAMILIES.forEach((f, i) => {
  for (const m of f.members) FAMILY_OF[m] = i;
});

/** Descriptors that fell through the grouping. Should be empty. */
export const UNGROUPED = DESCRIPTOR_IDS.filter((d) => FAMILY_OF[d] === undefined);

/**
 * Descriptor weights -> a 14-vector on the fixed axes.
 *
 * A family takes the MAX of its members, not the sum: a memory that is
 * "rose + jasmine + violet" is emphatically floral, not three times floral,
 * and summing would let a family with many members dominate purely by being
 * a big bucket.
 */
export function toFamilyVector(weights: Record<string, number>): number[] {
  const out = new Array<number>(FAMILY_COUNT).fill(0);
  for (const [id, w] of Object.entries(weights)) {
    const f = FAMILY_OF[id];
    if (f === undefined || w <= 0) continue;
    out[f] = Math.max(out[f], w);
  }
  return out;
}

/** A molecule's descriptor list -> the same 14 axes. */
export function moleculeFamilyVector(descriptors: string[]): number[] {
  const out = new Array<number>(FAMILY_COUNT).fill(0);
  for (const d of descriptors) {
    const f = FAMILY_OF[d];
    if (f !== undefined) out[f] = 1;
  }
  return out;
}
