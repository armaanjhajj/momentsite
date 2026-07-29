// Cold evaluation of the zone naming.
//
// The naming fix was tuned against 12 probes, several already seen failing.
// That is fitting on the test set. These 15 are disjoint from those 12, the
// expected families were written before the script was run once, and the
// result is the first and only run. Nothing was adjusted afterwards.
//
// Grading, fixed in advance:
//   PASS  at least one of the two displayed names is in `expect`
//   FAIL  neither is

export const PROBES: Array<{ q: string; expect: string[] }> = [
  { q: "peanut butter",         expect: ["nutty", "roasted", "peanut", "cocoa"] },
  { q: "a pine forest",         expect: ["pine", "terpenic", "woody", "camphoreous", "resinous"] },
  { q: "bacon frying",          expect: ["meaty", "smoky", "savoury", "savory", "fried", "roasted"] },
  { q: "nail polish remover",   expect: ["solvent", "ethereal", "gasoline", "acetone"] },
  { q: "blue cheese",           expect: ["cheesy", "sour", "dairy", "buttery", "acidic", "fatty"] },
  { q: "fresh laundry",         expect: ["soapy", "powdery", "musk", "floral", "aldehydic"] },
  { q: "a struck match",        expect: ["sulfurous", "smoky", "burnt", "phosphorus"] },
  { q: "lavender",              expect: ["lavender", "herbal", "floral", "camphoreous"] },
  { q: "orange peel",           expect: ["citrus", "orange", "terpenic", "fruity"] },
  { q: "the dentist",           expect: ["medicinal", "minty", "phenolic", "clove", "eugenol"] },
  { q: "low tide at the beach", expect: ["marine", "fishy", "ozone", "sulfurous", "algae"] },
  { q: "cucumber",              expect: ["cucumber", "green", "melon", "aldehydic", "watery"] },
  { q: "burnt rubber",          expect: ["rubbery", "burnt", "smoky", "sulfurous", "tarry"] },
  { q: "vanilla ice cream",     expect: ["vanilla", "creamy", "sweet", "lactonic", "milky"] },
  { q: "black pepper",          expect: ["peppery", "spicy", "woody", "terpenic"] },
];
