// POST /api/scent/post
//
// The only way onto the board. The browser sends what the person wrote and the
// descriptor profile that came out of the decomposition; everything else is
// derived here. It does not send the zone, the region or the position, because
// a post whose address it chose for itself would make every number on /board a
// claim instead of a measurement.
//
// Anonymous inserts are blocked by RLS, so this route holds the service-role
// key and is the single writer.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { project, neighbours } from "@/lib/scent/project";
import { msiFor } from "@/lib/scent/msi";
import { DESCRIPTOR_IDS } from "@/data/scent/descriptors";

const MEMORY_MAX = 600;
const QUERY_MAX = 200;
const VALID = new Set<string>(DESCRIPTOR_IDS);

// Best effort, per instance. Serverless means several instances and therefore
// several counters, so this stops a hammering tab rather than a determined
// attacker. The real protection is that nothing here is expensive.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const seen = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(ip, hits);
  // Unbounded growth is the other failure mode, so the map is swept whenever
  // it gets large rather than on a timer.
  if (seen.size > 500) {
    for (const [k, v] of seen) if (v.every((t) => now - t > WINDOW_MS)) seen.delete(k);
  }
  return hits.length > MAX_PER_WINDOW;
}

/** Keep only real descriptors with usable weights. */
function cleanWeights(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!VALID.has(k)) continue;
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) continue;
    out[k] = Math.min(1, n);
  }
  return out;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Give it a minute before posting again." },
      { status: 429 }
    );
  }

  let body: { memory?: unknown; query?: unknown; weights?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const memory = typeof body.memory === "string" ? body.memory.trim() : "";
  const query = typeof body.query === "string" ? body.query.trim() : "";

  if (memory.length < 2 || memory.length > MEMORY_MAX) {
    return NextResponse.json(
      { error: `Write between 2 and ${MEMORY_MAX} characters.` },
      { status: 400 }
    );
  }
  if (query.length < 1 || query.length > QUERY_MAX) {
    return NextResponse.json({ error: "Missing the search text." }, { status: 400 });
  }

  const weights = cleanWeights(body.weights);
  const vec = project(weights);
  if (!vec) {
    return NextResponse.json(
      { error: "That profile does not land anywhere in the space." },
      { status: 400 }
    );
  }

  // Everything below this line is measured, not received.
  const msi = msiFor(vec);
  const near = neighbours(vec, weights, 6).map((n) => ({
    id: n.molecule.id,
    name: n.molecule.name,
    score: Number(n.score.toFixed(4)),
  }));

  const { data, error } = await supabaseAdmin
    .from("scent_posts")
    .insert({
      memory,
      query,
      sense: msi.sense,
      zone: msi.zone,
      region: msi.region,
      sub: msi.sub,
      profile: weights,
      molecules: near,
      vec,
    })
    .select("id, memory, query, sense, zone, code, region, sub, profile, molecules, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not post that." }, { status: 500 });
  }

  return NextResponse.json({ post: data, msi: msi.label });
}
