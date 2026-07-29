/**
 * Re-file every post under the current map.
 *
 *   npm run scent:rezone -- --dry-run
 *   npm run scent:rezone
 *
 * WHY THIS HAS TO EXIST
 *
 * A post stores the code it was written with. The map moves underneath it:
 * growing the curated set from 152 to 157 re-fitted all 87 descriptor
 * directions and changed where every text query lands. A post written before
 * that rebuild keeps a code that no longer points anywhere sensible, and
 * nothing about the row says so.
 *
 * RUN THIS AFTER ANY OF:
 *   - molecules.json changing (curated set added to or removed from)
 *   - python/scent/embed.py being re-run (descriptor directions re-fitted)
 *   - scripts/build-scent-zones.mjs being re-run (zone tree rebuilt)
 *   - scripts/stamp-map-version.mjs reporting a different MAP_VERSION
 *
 * IT STARTS FROM `profile`, NEVER FROM `vec`
 *
 * `profile` is what the person's words decomposed to. It is the semantic
 * content and it does not expire. `vec` is that profile pushed through one
 * particular set of descriptor directions, so it is already stale by the time
 * this runs. Re-projecting a stored vector would carry the old projection
 * forward and fix only the zoning half of the problem.
 */

import { createClient } from "@supabase/supabase-js";
import { project, neighbours } from "../src/lib/scent/project";
import { msiFor } from "../src/lib/scent/msi";
import { MAP_VERSION } from "../src/data/scent/map-version";

const DRY = process.argv.includes("--dry-run");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("  need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Row = {
  id: string;
  query: string;
  profile: Record<string, number>;
  sense: number;
  zone: number;
  code: number;
  region: string;
  sub: string;
  map_version: string;
};

async function main() {
  console.log(`  current map version: ${MAP_VERSION}`);
  console.log(`  mode: ${DRY ? "dry run, nothing will be written" : "WRITING"}\n`);

  const { data, error } = await db
    .from("scent_posts")
    .select("id, query, profile, sense, zone, code, region, sub, map_version")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("  read failed:", error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as Row[];
  if (rows.length === 0) {
    console.log("  no posts. Nothing to do.");
    return;
  }

  let moved = 0;
  let same = 0;
  let unplaceable = 0;

  for (const row of rows) {
    // From the profile. Not from row.vec, which is why vec is not even selected.
    const vec = project(row.profile ?? {});
    if (!vec) {
      unplaceable++;
      console.log(`  SKIP  ${row.id.slice(0, 8)}  profile does not project  "${row.query}"`);
      continue;
    }

    const msi = msiFor(vec);
    const near = neighbours(vec, row.profile ?? {}, 6).map((n) => ({
      id: n.molecule.id,
      name: n.molecule.name,
      score: Number(n.score.toFixed(4)),
    }));

    const changed = msi.code !== row.code || row.map_version !== MAP_VERSION;
    if (msi.code === row.code) same++;
    else moved++;

    const arrow = msi.code === row.code ? "==" : "->";
    console.log(
      `  ${changed ? "UPDATE" : "  ok  "}  ${row.id.slice(0, 8)}  ` +
        `${row.code} ${arrow} ${msi.code}  ` +
        `${row.region} > ${row.sub} ${arrow} ${msi.region} > ${msi.sub}  ` +
        `"${row.query.slice(0, 40)}"`
    );

    if (DRY || !changed) continue;

    const { error: upErr } = await db
      .from("scent_posts")
      .update({
        // `code` is generated from sense and zone, so it is not written here.
        sense: msi.sense,
        zone: msi.zone,
        region: msi.region,
        sub: msi.sub,
        molecules: near,
        vec,
        map_version: MAP_VERSION,
      })
      .eq("id", row.id);

    if (upErr) console.error(`  FAILED ${row.id}: ${upErr.message}`);
  }

  console.log(
    `\n  ${rows.length} posts: ${moved} would move, ${same} unchanged, ` +
      `${unplaceable} unplaceable` +
      (DRY ? "\n  dry run, nothing written" : "\n  written")
  );
}

void main();
