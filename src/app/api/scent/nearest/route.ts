// POST /api/scent/nearest
//
// Retrieval across the whole corpus, not just the annotated part of it.
//
// WHY THIS IS A ROUTE AND NOT A FUNCTION IN THE BUNDLE
//
// Placement has always used all 5,548 GS-LF molecules; retrieval used the 157
// curated ones, because those are the only entries with occurrences, facts and
// sourcing text. The page therefore placed a memory among 5,548 molecules and
// then answered from 157, and said nothing about it.
//
// Closing that gap client-side would mean shipping 5,548 x 48 floats, roughly
// 2.5 MB, to every visitor. So the comparison happens here, where atlas.json
// is already on disk, and the browser receives ranked results instead of the
// corpus.
//
// The curated boost is a constant, not a partition. A curated molecule gets a
// small bump so the richer cards tend to lead, but a genuinely closer
// uncurated molecule still outranks it. Ranking by real distance and then
// nudging is honest; sorting curated first and calling it a ranking is not.

import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { msiFor } from "@/lib/scent/msi";
import { MOLECULES_BY_ID, moleculeVector } from "@/lib/scent/project";
import curatedMap from "@/data/scent/curated-atlas-map.json";
import { DESCRIPTOR_IDS } from "@/data/scent/descriptors";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

/** How much a hand-written card is worth in similarity terms. */
const CURATED_BOOST = 0.02;
const MAX_RESULTS = 12;

type AtlasMol = { id: string; smiles: string; d: number[]; e: number[] };
type Atlas = { k: number; labels: string[]; molecules: AtlasMol[] };

// Read once per server process. 2.5 MB of JSON parsed on every request would
// dominate the response time; parsed once it is a few hundred milliseconds at
// cold start and free afterwards.
let ATLAS: Atlas | null = null;
let NORMS: Float64Array | null = null;

function atlas(): Atlas {
  if (!ATLAS) {
    const p = join(process.cwd(), "public", "scent", "atlas.json");
    ATLAS = JSON.parse(readFileSync(p, "utf8")) as Atlas;
    NORMS = new Float64Array(ATLAS.molecules.length);
    ATLAS.molecules.forEach((m, i) => {
      let s = 0;
      for (const v of m.e) s += v * v;
      NORMS![i] = Math.sqrt(s) || 1;
    });
  }
  return ATLAS;
}

/**
 * curated id -> atlas id, joined offline on canonical SMILES by
 * python/build_curated_map.py.
 *
 * Comparing the raw SMILES strings matches only 110 of 156, because the
 * curated entries are hand-typed and the atlas is RDKit-canonical. That gap
 * would have rendered geosmin, both carvones, limonene and linalool as
 * unannotated molecules on their own site.
 */
const CURATED_TO_ATLAS = (curatedMap as { map: Record<string, string> }).map;
const ATLAS_TO_CURATED = new Map(
  Object.entries(CURATED_TO_ATLAS).map(([cur, at]) => [at, cur])
);

/**
 * The twelve curated molecules with no atlas row at all.
 *
 * 2-acetyl-1-pyrroline, beta-damascenone, geraniol and nine others are simply
 * not in the merged GS-LF corpus. Ranking over the atlas alone would drop them
 * from results they used to win, so they are carried as extra candidates using
 * their own embeddings from embedding.json, which sit in the same space.
 */
const CURATED_ONLY: string[] = Object.keys(
  Object.fromEntries([...MOLECULES_BY_ID.keys()].map((id) => [id, true]))
).filter((id) => !CURATED_TO_ATLAS[id]);

const VALID = new Set<string>(DESCRIPTOR_IDS);

function cleanWeights(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!VALID.has(k)) continue;
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) out[k] = Math.min(1, n);
  }
  return out;
}

export async function POST(req: Request) {
  let body: { vec?: unknown; weights?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const vec = Array.isArray(body.vec) ? (body.vec as number[]).map(Number) : null;
  if (!vec || vec.length === 0 || vec.some((x) => !Number.isFinite(x))) {
    return NextResponse.json({ error: "bad_vector" }, { status: 400 });
  }

  const A = atlas();
  if (vec.length !== A.k) {
    return NextResponse.json({ error: "dimension_mismatch" }, { status: 400 });
  }

  let qn = 0;
  for (const v of vec) qn += v * v;
  qn = Math.sqrt(qn) || 1;

  type Cand = {
    key: string;
    smiles: string;
    labels: number[];
    vec: number[];
    curatedId: string | null;
    sim: number;
    ranked: number;
  };

  const cands: Cand[] = A.molecules.map((m, i) => {
    let dot = 0;
    for (let c = 0; c < vec.length; c++) dot += vec[c] * m.e[c];
    const sim = dot / (qn * NORMS![i]);
    const curatedId = ATLAS_TO_CURATED.get(m.id) ?? null;
    return {
      key: m.id,
      smiles: m.smiles,
      labels: m.d,
      vec: m.e,
      curatedId,
      sim,
      ranked: sim + (curatedId ? CURATED_BOOST : 0),
    };
  });

  // The curated-only twelve, scored the same way against their own vectors.
  for (const id of CURATED_ONLY) {
    const mol = MOLECULES_BY_ID.get(id);
    if (!mol) continue;
    const e = moleculeVector(id);
    if (!e.length) continue;
    let dot = 0;
    let en = 0;
    for (let c = 0; c < vec.length; c++) {
      dot += vec[c] * e[c];
      en += e[c] * e[c];
    }
    const sim = dot / (qn * (Math.sqrt(en) || 1));
    cands.push({
      key: id,
      smiles: mol.smiles,
      labels: [],
      vec: e,
      curatedId: id,
      sim,
      ranked: sim + CURATED_BOOST,
    });
  }

  // The true nearest is by raw similarity, with no boost applied. It is the
  // one number on the page that must not be flattered.
  let best = cands[0];
  for (const s of cands) if (s.sim > best.sim) best = s;

  cands.sort((a, b) => b.ranked - a.ranked);
  const top = cands.slice(0, MAX_RESULTS);

  const shape = (s: Cand) => {
    const curated = s.curatedId ? MOLECULES_BY_ID.get(s.curatedId) : null;
    return {
      id: s.curatedId ?? s.key,
      atlasId: s.key,
      name: curated?.name ?? null,
      smiles: s.smiles,
      curated: Boolean(curated),
      similarity: Number(s.sim.toFixed(4)),
      distance: Number((1 - s.sim).toFixed(4)),
      msi: msiFor(s.vec).label,
      // GS-LF's own labels for an atlas row, the site vocabulary for a
      // curated-only one. Different vocabularies, not claimed to be the same.
      descriptors: s.labels.length
        ? s.labels.map((j) => A.labels[j]).slice(0, 6)
        : (curated?.descriptors ?? []).slice(0, 6),
    };
  };

  const results = top.map(shape);
  const nearest = shape(best);

  // Demand, so curation can follow it. Fire and forget: a failed counter must
  // never cost the caller their results.
  void supabaseAdmin
    .rpc("scent_bump_hits", {
      ids: results.map((r) => r.atlasId),
      curated_ids: results.filter((r) => r.curated).map((r) => r.atlasId),
    })
    .then(
      () => undefined,
      () => undefined
    );

  return NextResponse.json({
    results,
    nearest,
    // True when the closest molecule in the whole corpus already has a card,
    // so the UI can say so instead of printing it twice.
    nearestIsCurated: nearest.curated,
    corpus: A.molecules.length,
  });
}
