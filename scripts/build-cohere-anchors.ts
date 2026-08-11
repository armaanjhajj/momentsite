/**
 * Embed the 150 descriptor names once, so molecules and queries can meet.
 *
 *   COHERE_API_KEY=... npm run scent:anchors
 *
 * THE BRIDGE
 *
 * The GNN maps a molecule to 150 descriptor probabilities. Cohere Embed maps
 * arbitrary text to a vector. The 150 descriptor names exist in both worlds, so
 * they are the anchors: embed each name once, then a molecule's position in
 * text space is the probability-weighted sum of its own descriptor anchors. A
 * query goes through the same embedder and lands in the same space.
 *
 * Cohere never sees a molecule. It sees 150 short strings once, here, and one
 * query per search.
 *
 * THE TEMPLATE MATTERS
 *
 * Bare descriptor names are ambiguous as text: "green", "fresh", "sharp" and
 * "animal" all mean something else outside a flavour lab. Each name is wrapped
 * in a short phrase that puts it in the right domain before embedding. This is
 * the one piece of prompt design in the pipeline and it is worth stating out
 * loud rather than burying.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MODEL = "embed-v4.0";
const DIM = 1024;
const ROUND = 5;

const template = (name: string) => `the smell of something ${name}`;

async function main() {
  const key = process.env.COHERE_API_KEY;
  if (!key) {
    console.error("  set COHERE_API_KEY");
    process.exit(1);
  }

  const probs = JSON.parse(
    readFileSync(join(ROOT, "public", "scent", "probs.json"), "utf8")
  ) as { labels: string[] };

  const labels = probs.labels;
  console.log(`  embedding ${labels.length} descriptor anchors with ${MODEL}`);

  // Cohere caps a single embed call at 96 texts, so 150 anchors is two calls.
  // Batched rather than looped one at a time: the cap is per request, not per
  // text, and two round trips is the whole build cost of this bridge.
  const BATCH = 96;
  const vectors: number[][] = [];
  const billed: Record<string, number> = {};

  for (let start = 0; start < labels.length; start += BATCH) {
    const slice = labels.slice(start, start + BATCH);
    const res = await fetch("https://api.cohere.com/v2/embed", {
      method: "POST",
      headers: { authorization: `bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        // Anchors are the corpus side of the comparison, queries are the query
        // side. Cohere's asymmetric embedding wants to be told which is which.
        input_type: "search_document",
        embedding_types: ["float"],
        output_dimension: DIM,
        texts: slice.map(template),
      }),
    });

    const data = (await res.json()) as {
      embeddings?: { float?: number[][] };
      message?: string;
      meta?: { billed_units?: Record<string, number> };
    };

    if (!res.ok || !data.embeddings?.float) {
      console.error("  cohere error:", data.message ?? res.status);
      process.exit(1);
    }
    vectors.push(...data.embeddings.float);
    for (const [k, v] of Object.entries(data.meta?.billed_units ?? {})) {
      billed[k] = (billed[k] ?? 0) + (v as number);
    }
    console.log(`    batch ${start / BATCH + 1}: ${slice.length} anchors`);
  }

  if (vectors.length !== labels.length) {
    console.error(`  expected ${labels.length} vectors, got ${vectors.length}`);
    process.exit(1);
  }

  const payload = {
    note:
      "Cohere embeddings of the 150 GS-LF descriptor names, the anchors that " +
      "bridge the GNN's label space to text space. Built by " +
      "scripts/build-cohere-anchors.ts.",
    model: MODEL,
    dim: DIM,
    inputType: "search_document",
    template: template("<descriptor>"),
    labels,
    vectors: vectors.map((v) => v.map((x) => Number(x.toFixed(ROUND)))),
  };

  const dest = join(ROOT, "public", "scent", "cohere-anchors.json");
  writeFileSync(dest, JSON.stringify(payload));
  const kb = (readFileSync(dest).length / 1024).toFixed(0);

  console.log(`  billed: ${JSON.stringify(billed)}`);
  console.log(`  wrote cohere-anchors.json  ${labels.length} x ${DIM}  ${kb} KB`);

  // Sanity: the anchors should agree with olfactory intuition, or the bridge
  // is built on sand. Nearest neighbours of a few names, in Cohere's space.
  const norm = (v: number[]) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  const cos = (a: number[], b: number[]) => {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s / (norm(a) * norm(b));
  };
  for (const probe of ["smoky", "citrus", "animal", "solvent"]) {
    const i = labels.indexOf(probe);
    if (i < 0) continue;
    const near = labels
      .map((l, j) => ({ l, s: cos(vectors[i], vectors[j]) }))
      .filter((x) => x.l !== probe)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((x) => `${x.l} ${x.s.toFixed(3)}`);
    console.log(`    ${probe.padEnd(9)} -> ${near.join(", ")}`);
  }
}

void main();
