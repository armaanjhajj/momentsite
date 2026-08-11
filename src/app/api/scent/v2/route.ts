// POST /api/scent/v2
//
// The Cohere bridge, with its working shown.
//
// THE IDEA
//
// The GNN maps a molecule to 150 descriptor probabilities. Cohere Embed maps
// arbitrary text to a vector. The 150 descriptor names exist in both worlds, so
// they are anchors. A molecule's position in text space is the probability
// weighted sum of its own descriptor anchors; a query goes through the same
// embedder and lands in the same space. Cohere never sees a molecule.
//
// WHY THIS REPLACES THE LEXICON
//
// v1 turns text into descriptor weights with a hand written phrase table, and
// falls back to Claude when the table misses. Both are authored. This path has
// no table and no reasoning at query time: the phrase becomes a vector, the
// vector meets 5,548 precomputed positions, and Rerank orders the head of the
// list. It is geometry, and geometry is deterministic. The same query returns
// the same vector and the same ranking every time, which is the property v1
// loses the moment it asks a model.
//
// THE ARITHMETIC, WHICH IS SMALLER THAN IT LOOKS
//
//   score(m) = (q . m) / |m|   where m = sum_j p_j D_j
//            = sum_j p_j (q . D_j) / |m|
//
// So the 5,548 comparisons cost 150 dot products of length 1024, then one
// weighted sum of at most 24 terms per molecule. Not 5,548 dot products of
// length 1024. |m| needs the anchor Gram matrix, computed once at cold start.

import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { msiFor } from "@/lib/scent/msi";
import { MOLECULES_BY_ID, project, neighbours } from "@/lib/scent/project";
import { decompose, topWeights } from "@/lib/scent/decompose";
import { supabaseAdmin } from "@/lib/supabase-admin";
import curatedMap from "@/data/scent/curated-atlas-map.json";

export const runtime = "nodejs";

const EMBED_MODEL = "embed-v4.0";
const RERANK_MODEL = "rerank-v3.5";
const SHORTLIST = 50;
const FINAL = 12;

// How many of the 150 anchors define a query, and how sharply they are
// weighted. Measured: a weighted sum over the molecule's whole profile ranks by
// how ordinary a molecule is rather than how well it matches, because Cohere's
// dot products between short phrases sit in a narrow band (mean 0.23, sd 0.04)
// and every molecule scores positively on everything. Standardising the anchor
// scores and keeping only the head turns the query into the same shape the
// lexicon used to emit, a sparse descriptor profile, which is then compared
// against the GNN's probabilities as a cosine.
const QUERY_ANCHORS = 16;
const SHARPEN = 0.6;

type Anchors = {
  model: string;
  dim: number;
  template: string;
  labels: string[];
  vectors: number[][];
};
type Probs = {
  labels: string[];
  topK: number;
  // Human names from the GoodScents and Leffingwell archives. atlas.json
  // carries structures and no names, so without these an unannotated molecule
  // renders as a SMILES string.
  names: string[];
  rows: Array<{ i: number[]; p: number[] }>;
};
type Atlas = { labels: string[]; molecules: Array<{ id: string; smiles: string; e: number[] }> };

let A: Anchors | null = null;
let P: Probs | null = null;
let AT: Atlas | null = null;
let NORMS: Float64Array | null = null;
let coldStartMs = 0;

const read = <T,>(f: string) =>
  JSON.parse(readFileSync(join(process.cwd(), "public", "scent", f), "utf8")) as T;

/**
 * Load once per server process, and precompute what does not depend on the
 * query: the anchor Gram matrix, and from it every molecule's vector length.
 */
function warm() {
  if (A) return;
  const t0 = Date.now();
  A = read<Anchors>("cohere-anchors.json");
  P = read<Probs>("probs.json");
  AT = read<Atlas>("atlas.json");

  const n = A.labels.length;
  const gram = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let s = 0;
      const a = A.vectors[i];
      const b = A.vectors[j];
      for (let c = 0; c < a.length; c++) s += a[c] * b[c];
      gram[i * n + j] = s;
      gram[j * n + i] = s;
    }
  }

  NORMS = new Float64Array(P.rows.length);
  P.rows.forEach((row, m) => {
    let s = 0;
    for (let x = 0; x < row.i.length; x++) {
      for (let y = 0; y < row.i.length; y++) {
        s += row.p[x] * row.p[y] * gram[row.i[x] * n + row.i[y]];
      }
    }
    NORMS![m] = Math.sqrt(Math.max(s, 1e-12));
  });
  coldStartMs = Date.now() - t0;
}

/**
 * The cache key, same normalisation the v1 decomposition cache uses.
 */
const normalise = (t: string) => t.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Why the vector is cached at all.
 *
 * Measured, two calls to Cohere Embed with the same string return vectors that
 * differ around the fourth decimal. That is enough to swap two near tied
 * anchors and reorder the shortlist. Pinning the first vector makes the rest of
 * the pipeline, which is arithmetic over static files, genuinely reproducible
 * rather than merely usually the same.
 */
async function readCache(queryNorm: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("scent_v2_cache")
      .select("vec, rerank")
      .eq("query_norm", queryNorm)
      .maybeSingle();
    if (error || !data) return null;
    return data as { vec: number[]; rerank: unknown };
  } catch {
    return null;
  }
}

async function writeCache(row: {
  query_norm: string;
  query_raw: string;
  model: string;
  dim: number;
  vec: number[];
  rerank: unknown;
}) {
  try {
    await supabaseAdmin
      .from("scent_v2_cache")
      .upsert(row, { onConflict: "query_norm", ignoreDuplicates: true });
  } catch {
    /* a lost write costs one repeat call, never the answer */
  }
}

const CURATED_TO_ATLAS = (curatedMap as { map: Record<string, string> }).map;
const ATLAS_TO_CURATED = new Map(
  Object.entries(CURATED_TO_ATLAS).map(([cur, at]) => [at, cur])
);

export async function POST(req: Request) {
  const key = process.env.COHERE_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const query = text.trim().slice(0, 300);

  const tWarm = Date.now();
  warm();
  const warmMs = Date.now() - tWarm;

  // ── step 1: the query becomes a vector ────────────────────────────
  const queryNorm = normalise(query);
  const cached = await readCache(queryNorm);

  const t1 = Date.now();
  let q: number[];
  let embedBilled: Record<string, number> = {};
  let embedMs = 0;

  if (cached?.vec?.length) {
    q = cached.vec;
    embedMs = Date.now() - t1;
  } else {
    const eRes = await fetch("https://api.cohere.com/v2/embed", {
      method: "POST",
      headers: { authorization: `bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: EMBED_MODEL,
        input_type: "search_query",
        embedding_types: ["float"],
        output_dimension: A!.dim,
        texts: [query],
      }),
    });
    const eData = (await eRes.json()) as {
      embeddings?: { float?: number[][] };
      message?: string;
      meta?: { billed_units?: Record<string, number> };
    };
    embedMs = Date.now() - t1;
    if (!eRes.ok || !eData.embeddings?.float?.[0]) {
      return NextResponse.json(
        { error: "embed_failed", detail: eData.message ?? eRes.status },
        { status: 502 }
      );
    }
    q = eData.embeddings.float[0];
    embedBilled = eData.meta?.billed_units ?? {};
  }

  let qn = 0;
  for (const x of q) qn += x * x;
  qn = Math.sqrt(qn) || 1;

  // ── step 2: the query against the 150 anchors ─────────────────────
  // This is the replacement for the lexicon. No phrase table, no fallback.
  const t2 = Date.now();
  const anchorDot = new Float64Array(A!.labels.length);
  for (let i = 0; i < A!.labels.length; i++) {
    const v = A!.vectors[i];
    let s = 0;
    for (let c = 0; c < v.length; c++) s += q[c] * v[c];
    anchorDot[i] = s / qn; // anchors are unit length from the API
  }
  const anchorMs = Date.now() - t2;

  const anchorRank = Array.from(anchorDot, (s, i) => ({ label: A!.labels[i], score: s }))
    .sort((a, b) => b.score - a.score);

  // ── step 3: the query becomes a descriptor profile, then every molecule
  //           is scored against it ──────────────────────────────────
  const t3 = Date.now();

  // Standardise. The absolute dot products are all positive and tightly
  // clustered, so the signal is in the deviation, not the value.
  let mu = 0;
  for (const d of anchorDot) mu += d;
  mu /= anchorDot.length;
  let sd = 0;
  for (const d of anchorDot) sd += (d - mu) ** 2;
  sd = Math.sqrt(sd / anchorDot.length) || 1;

  const zs = Array.from(anchorDot, (d) => (d - mu) / sd);
  const head = Array.from(zs.keys())
    .sort((a, b) => zs[b] - zs[a])
    .slice(0, QUERY_ANCHORS);

  const w = new Float64Array(A!.labels.length);
  for (const j of head) w[j] = Math.exp(zs[j] / SHARPEN);
  let wn = 0;
  for (const x of w) wn += x * x;
  wn = Math.sqrt(wn) || 1;

  const scores = new Float64Array(P!.rows.length);
  for (let m = 0; m < P!.rows.length; m++) {
    const row = P!.rows[m];
    let s = 0;
    let pn = 0;
    for (let x = 0; x < row.i.length; x++) {
      s += w[row.i[x]] * row.p[x];
      pn += row.p[x] * row.p[x];
    }
    scores[m] = s / (wn * (Math.sqrt(pn) || 1));
  }
  const order = Array.from(scores.keys()).sort((a, b) => scores[b] - scores[a]);
  const shortlist = order.slice(0, SHORTLIST);
  const scoreMs = Date.now() - t3;

  const queryProfile = head.map((j) => ({
    label: A!.labels[j],
    z: Number(zs[j].toFixed(2)),
    weight: Number((w[j] / wn).toFixed(4)),
  }));

  const describe = (m: number) => {
    const row = P!.rows[m];
    return row.i.slice(0, 6).map((j, x) => ({
      label: P!.labels[j],
      p: row.p[x],
    }));
  };

  const shape = (m: number, rank: number) => {
    const mol = AT!.molecules[m];
    const curatedId = ATLAS_TO_CURATED.get(mol.id) ?? null;
    const curated = curatedId ? MOLECULES_BY_ID.get(curatedId) : null;
    return {
      atlasIndex: m,
      atlasId: mol.id,
      smiles: mol.smiles,
      // Curated name first, since those are the ones written for people; then
      // the archive name; SMILES only when neither exists.
      name: curated?.name ?? P!.names?.[m] ?? null,
      curated: Boolean(curated),
      msi: msiFor(mol.e).label,
      embedScore: Number(scores[m].toFixed(4)),
      embedRank: rank,
      descriptors: describe(m),
    };
  };

  const preRerank = shortlist.map((m, i) => shape(m, i + 1));

  // ── step 4: rerank the shortlist ──────────────────────────────────
  // Rerank reads text, so each candidate is described by its own predicted
  // descriptors. It still never sees a molecule.
  const docs = preRerank.map(
    (c) => `an odor that smells ${c.descriptors.map((d) => d.label).join(", ")}`
  );

  const t4 = Date.now();

  type RerankRow = { index: number; relevance_score: number };
  let rerankRows: RerankRow[] = [];
  let rerankErr: string | null = null;
  let rerankBilled: Record<string, number> = {};
  const rerankCached = Array.isArray(cached?.rerank);

  if (rerankCached) {
    // Pinned from the first run. The shortlist is already fixed by the cached
    // vector, so replaying the stored order reproduces that run exactly.
    rerankRows = cached!.rerank as RerankRow[];
  } else {
    const rRes = await fetch("https://api.cohere.com/v2/rerank", {
      method: "POST",
      headers: { authorization: `bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: RERANK_MODEL,
        query,
        documents: docs,
        top_n: FINAL,
      }),
    });
    const rData = (await rRes.json()) as {
      results?: RerankRow[];
      message?: string;
      meta?: { billed_units?: Record<string, number> };
    };
    if (rRes.ok && rData.results) {
      rerankRows = rData.results.map((r) => ({
        index: r.index,
        relevance_score: Number(r.relevance_score.toFixed(4)),
      }));
      rerankBilled = rData.meta?.billed_units ?? {};
    } else {
      rerankErr = rData.message ?? String(rRes.status);
    }
  }
  const rerankMs = Date.now() - t4;

  // First answer wins, permanently. Only written when both calls succeeded, so
  // a partial failure is never the version that gets pinned.
  if (!cached && !rerankErr && rerankRows.length) {
    await writeCache({
      query_norm: queryNorm,
      query_raw: query,
      model: EMBED_MODEL,
      dim: q.length,
      vec: q,
      rerank: rerankRows,
    });
  }

  const reranked = rerankRows
    .filter((r) => preRerank[r.index])
    .map((r, i) => ({
      ...preRerank[r.index],
      rerankScore: r.relevance_score,
      finalRank: i + 1,
      movedBy: preRerank[r.index].embedRank - (i + 1),
      document: docs[r.index],
    }));

  // ── the v1 path, for comparison ───────────────────────────────────
  // Run here rather than in the browser so both answers come from one request
  // and describe exactly the same query string.
  const lex = decompose(query);
  const lexVec = project(lex.weights);
  const v1 = {
    matched: lex.matched,
    confidence: Number(lex.confidence.toFixed(2)),
    // Below this the live site abandons the lexicon and asks Claude, which is
    // the step that makes v1 non-deterministic.
    wouldCallModel: lex.confidence < 0.6,
    weights: topWeights(lex.weights, 8).map((w) => ({ id: w.id, value: w.value })),
    msi: lexVec ? msiFor(lexVec).label : null,
    placed: Boolean(lexVec),
    molecules: lexVec
      ? neighbours(lexVec, lex.weights, 6).map((n) => ({
          name: n.molecule.name,
          smiles: n.molecule.smiles,
          score: Number(n.score.toFixed(4)),
        }))
      : [],
  };

  return NextResponse.json({
    query,
    determinism:
      "No inference at query time. Once the vector is fixed, every step after " +
      "it is arithmetic over static files, so the same string produces the " +
      "same profile, the same shortlist and the same order, every run.",
    cold: { warmedThisRequest: warmMs > 1, warmMs, coldStartMs },
    embed: {
      model: EMBED_MODEL,
      inputType: "search_query",
      dim: q.length,
      ms: embedMs,
      cached: Boolean(cached?.vec?.length),
      billed: embedBilled,
      preview: q.slice(0, 8).map((x) => Number(x.toFixed(4))),
      norm: Number(qn.toFixed(6)),
    },
    anchors: {
      count: A!.labels.length,
      template: A!.template,
      ms: anchorMs,
      mean: Number(mu.toFixed(4)),
      sd: Number(sd.toFixed(4)),
      top: anchorRank.slice(0, 12).map((a) => ({
        label: a.label,
        score: Number(a.score.toFixed(4)),
      })),
      bottom: anchorRank.slice(-3).map((a) => ({
        label: a.label,
        score: Number(a.score.toFixed(4)),
      })),
    },
    profile: {
      anchorsKept: QUERY_ANCHORS,
      sharpen: SHARPEN,
      note:
        "The query as a sparse descriptor profile. This is what the lexicon " +
        "used to produce by hand, derived here from the embedding instead.",
      weights: queryProfile,
    },
    scoring: {
      molecules: P!.rows.length,
      topK: P!.topK,
      ms: scoreMs,
      dotProducts: A!.labels.length,
      note: `${A!.labels.length} dot products of length ${A!.dim}, then one weighted sum per molecule`,
      shortlist: SHORTLIST,
      preRerank: preRerank.slice(0, FINAL),
    },
    rerank: {
      model: RERANK_MODEL,
      ms: rerankMs,
      cached: rerankCached,
      billed: rerankBilled,
      documentsSent: docs.length,
      error: rerankErr,
      results: reranked,
    },
    v1,
    totalMs: Date.now() - t1,
    // Two on a cold phrase, zero on a repeat. The cache is what turns "the
    // same answer every time" from a hope into a property.
    apiCalls: cached ? 0 : 2,
    cached: Boolean(cached),
  });
}
