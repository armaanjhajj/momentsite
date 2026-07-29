import { PROBES } from "./naming-probes";
import { decompose } from "../src/lib/scent/decompose";
import { project, neighbours } from "../src/lib/scent/project";
import { msiFor } from "../src/lib/scent/msi";

let pass = 0, fail = 0, unplaced = 0;
const rows: string[] = [];

for (const { q, expect } of PROBES) {
  const d = decompose(q);
  const v = project(d.weights);
  if (!v) { unplaced++; rows.push(`  --      ${"NO MATCH".padEnd(26)} ${q}`); continue; }
  const m = msiFor(v);
  const names = [m.region.toLowerCase(), m.sub.toLowerCase()];
  const hit = names.some((n) => expect.includes(n));
  hit ? pass++ : fail++;
  rows.push(
    `  ${hit ? "PASS" : "FAIL"}  ${m.label}  ${(m.region + " > " + m.sub).padEnd(26)} ${q}` +
    `\n           conf ${d.confidence.toFixed(2)}  ${neighbours(v, d.weights, 4).map(n => n.molecule.name).join(", ")}`
  );
}

console.log(rows.join("\n"));
console.log(`\n  ${pass}/${PROBES.length} PASS   ${fail} FAIL   ${unplaced} unplaced`);
