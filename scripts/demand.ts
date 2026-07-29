/**
 * What people actually reach, so curation can follow demand.
 *
 *   npm run scent:demand
 *
 * Every molecule returned by /api/scent/nearest increments a counter. The
 * useful output is the uncurated rows with high counts: those are the cards
 * worth writing next, as opposed to the ones that felt interesting to write.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("  need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const LIMIT = Number(process.env.LIMIT ?? 200);

// A bare "gslf-7237" tells you nothing about whether a card is worth writing.
// Resolve to structure and to GS-LF's own labels, which is what someone would
// actually look at before deciding.
type Atlas = { labels: string[]; molecules: Array<{ id: string; smiles: string; d: number[] }> };
const atlas = JSON.parse(
  readFileSync(join(process.cwd(), "public", "scent", "atlas.json"), "utf8")
) as Atlas;
const INFO = new Map(
  atlas.molecules.map((m) => [
    m.id,
    { smiles: m.smiles, labels: m.d.map((j) => atlas.labels[j]).slice(0, 5).join(", ") },
  ])
);

async function main() {
  const { data, error } = await db
    .from("scent_molecule_hits")
    .select("molecule_id, curated, hit_count, last_hit_at")
    .order("hit_count", { ascending: false })
    .limit(LIMIT * 3);

  if (error) { console.error("  ", error.message); process.exit(1); }

  const rows = data ?? [];
  const uncurated = rows.filter((r) => !r.curated).slice(0, LIMIT);

  console.log(`  ${rows.length} molecules seen, ${rows.filter((r) => !r.curated).length} of them uncurated\n`);
  if (uncurated.length === 0) { console.log("  no uncurated hits yet"); return; }

  console.log("  top uncurated by traffic (these are the cards worth writing):");
  console.log("  rank  hits  structure                        GS-LF labels");
  uncurated.forEach((r, i) => {
    const info = INFO.get(r.molecule_id);
    console.log(
      `  ${String(i + 1).padStart(4)}  ${String(r.hit_count).padStart(4)}  ` +
        `${(info?.smiles ?? r.molecule_id).slice(0, 32).padEnd(32)} ${info?.labels ?? ""}`
    );
  });
}
void main();
