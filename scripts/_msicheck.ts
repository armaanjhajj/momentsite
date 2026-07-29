import { decompose } from "../src/lib/scent/decompose";
import { project, MOLECULES } from "../src/lib/scent/project";
import { msiFor, macroZone, MACRO_NAMES, ZONE_COUNT } from "../src/lib/scent/msi";
import embedding from "../src/data/scent/embedding.json";

const E = embedding.embeddings as Record<string, number[]>;
const v = (q: string) => project(decompose(q).weights)!;

console.log(`${ZONE_COUNT} zones\n`);

console.log("=== absolute: every point has one MSI, no reference needed ===");
for (const q of [
  "sidewalk on a rainy day",
  "campfire",
  "my grandmother's kitchen",
  "blue cheese",
  "a hospital",
  "the sea",
  "coffee",
  "a rose",
]) {
  const m = msiFor(v(q));
  const edge = m.edge ? `  (near ${m.edge.towardLabel} ${m.edge.towardRegion})` : "";
  console.log(`  MSI ${m.label}  ${m.region} > ${m.sub}${edge}   ${q}`);
}

console.log("\n=== deterministic ===");
const a = msiFor(v("campfire")).label;
const reps = [...Array(5)].map(() => msiFor(v("campfire")).label);
console.log(`  ${a} then ${reps.join(", ")}  stable: ${reps.every((x) => x === a)}`);

console.log("\n=== neighbouring numbers are neighbouring regions ===");
console.log("  molecules grouped by macro digit:");
const byZone = new Map<number, string[]>();
for (const m of MOLECULES) {
  const z = macroZone(E[m.id]);
  if (!byZone.has(z)) byZone.set(z, []);
  byZone.get(z)!.push(m.name);
}
for (let z = 0; z < 10; z++) {
  const names = byZone.get(z) ?? [];
  console.log(
    `   ${z}xx ${MACRO_NAMES[z].padEnd(24)} ${String(names.length).padStart(3)}  ${names.slice(0, 4).join(", ")}`
  );
}

console.log("\n=== collisions are expected: how many curated molecules share a zone ===");
const codes = new Map<string, string[]>();
for (const m of MOLECULES) {
  const c = msiFor(E[m.id]).label;
  if (!codes.has(c)) codes.set(c, []);
  codes.get(c)!.push(m.name);
}
const shared = [...codes.entries()].filter(([, v2]) => v2.length > 1);
console.log(`  ${codes.size} distinct zones for ${MOLECULES.length} molecules`);
console.log(`  ${shared.length} zones hold more than one:`);
for (const [c, names] of shared.slice(0, 5)) console.log(`    ${c}  ${names.join(", ")}`);
