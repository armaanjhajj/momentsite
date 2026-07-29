// Optional model fallback for the text -> descriptor step.
//
// The lexicon in src/data/scent/memories.ts handles anything it has been
// taught. This route handles everything else ("the inside of my violin case",
// "the third floor of my old office") by asking Claude to decompose the
// memory into the same fixed vocabulary.
//
// It is deliberately non-load-bearing. The client only calls it when lexicon
// confidence is low, and treats any non-200 as "keep what you had". No key
// configured, network down, rate limited, model refuses. The page behaves
// identically, just with slightly coarser results. That is why there is no
// server-side `fallbacks` retry here: every failure path already degrades to a
// working answer, so a second model call would buy nothing the client does not
// already get for free.
//
// The LLM is plumbing in this project, not the contribution. Worth saying out
// loud: it does not know anything about odor space. It only translates
// English into the vocabulary the embedding was built on.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DESCRIPTOR_IDS } from "@/data/scent/descriptors";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_INPUT = 400;

type Identity = { label: string; summary: string } | null;

/**
 * The cache key.
 *
 * Lowercase, trim, collapse internal whitespace. Deliberately conservative:
 * it does not strip punctuation or articles, because "a rose" and "rose" are
 * different phrases to the lexicon and collapsing them would hand one of them
 * the other's answer.
 */
function normaliseQuery(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Look up a previous answer.
 *
 * Never throws. A cache that is down has to degrade to "call the model", not
 * to an error page.
 */
async function readCache(queryNorm: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("scent_decompositions")
      .select("profile, identity, source")
      .eq("query_norm", queryNorm)
      .maybeSingle();
    if (error || !data) return null;
    return data as {
      profile: Record<string, number>;
      identity: Identity;
      source: string;
    };
  } catch {
    return null;
  }
}

/**
 * Record an answer, once.
 *
 * `ignoreDuplicates` is the whole point: the first answer a phrase ever gets
 * is the answer it keeps. Two searches racing the same new phrase both call
 * the model, and whichever insert lands first wins permanently. Without that,
 * a later model run with different weights would move a code that people may
 * already have quoted.
 */
async function writeCache(row: {
  query_norm: string;
  query_raw: string;
  profile: Record<string, number>;
  source: "lexicon" | "model";
  identity: Identity;
}) {
  try {
    await supabaseAdmin
      .from("scent_decompositions")
      .upsert(row, { onConflict: "query_norm", ignoreDuplicates: true });
  } catch {
    // A failed write costs a repeat model call later. It must not cost the
    // caller their answer.
  }
}

/**
 * Strip em dashes from generated prose.
 *
 * The system prompt forbids them, but a prompt rule is a request and this is a
 * guarantee. Applied to every string that reaches the page, so a slip never
 * shows up in the UI. A dash between two clauses becomes a comma, which is the
 * replacement that stays grammatical whatever follows it.
 */
function noEmDash(s: string): string {
  return s
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/,\s*,/g, ",")
    .trim();
}

const SYSTEM = `You identify a thing, then decompose what it smells of into a fixed
odor-descriptor vocabulary.

IDENTIFY. Say what the input actually is, in plain language, for someone who
may not recognise it. A brand, a product, a place, a scene, a material, a dish,
a plant. "White Monster" is a zero-sugar energy drink; "Fabuloso" is a lavender
floor cleaner; "petrichor" is the smell of rain hitting dry ground; "the inside
of a violin case" is a felt-lined wooden case holding rosin and varnish. A
remembered place or moment counts as a thing: describe it.

  label   the thing's common name, tidied up
  summary 1-2 sentences: what it is, then what it actually smells of and why.
          Name real aroma chemistry where you are confident of it.

Omit the identity object only in two cases. First, when the input is a bare
list of smell words with no thing behind it ("something smoky", "green and
sharp"). Second, when it names a brand or term you do not actually recognise.
Never invent a plausible-sounding product: an unrecognised input with no
identity is correct, a confident fiction is not.

WRITING. Never use an em dash, in the label or the summary. Use a
comma, a colon, a full stop or brackets instead. This is a hard rule with no
exceptions.

DECOMPOSE. Return only descriptors from the supplied enum. Weight each 0 to 1
by how strongly it belongs: 1.0 for the defining note, 0.3 for a faint one.
Between 3 and 8 descriptors. Describe what it physically smells of, not what it
means or how it feels, "my grandmother's kitchen" is bready, vanilla, buttery,
caramellic, not "nostalgic". If the input describes no smell at all, return an
empty descriptor list.`;

const SCHEMA = {
  type: "object",
  properties: {
    identity: {
      type: "object",
      properties: {
        label: { type: "string" },
        summary: { type: "string" },
      },
      required: ["label", "summary"],
      additionalProperties: false,
    },
    descriptors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", enum: DESCRIPTOR_IDS },
          weight: { type: "number" },
        },
        required: ["id", "weight"],
        additionalProperties: false,
      },
    },
  },
  required: ["descriptors"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;

  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const input = text.trim().slice(0, MAX_INPUT);
  const queryNorm = normaliseQuery(input);

  // Ask the cache before asking the model. A hit costs one indexed primary-key
  // lookup and no tokens, and returns the identical profile every time, which
  // is what stops the same phrase drifting to a different MSI between sessions.
  const hit = await readCache(queryNorm);
  if (hit) {
    return NextResponse.json({
      weights: hit.profile,
      identity: hit.identity ?? null,
      cached: true,
    });
  }

  // The key check sits below the cache, not above it. A phrase that has been
  // answered once should keep answering with no key configured at all, which
  // also means a deploy that loses the key degrades to "the corpus we have"
  // rather than to nothing.
  if (!key) {
    // Not an error condition. The site is designed to run without this.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const client = new Anthropic({ apiKey: key });

    const response = await client.messages.create({
      // Sonnet, not Opus. This is a short extraction against a fixed enum with
      // the schema doing most of the constraining, so the frontier model was
      // paying roughly twice as much for no measurable gain. Haiku was tried
      // too and got the brands right, but turned conservative on remembered
      // scenes and dropped the identity card for them.
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: SYSTEM,
      // Thinking off and effort low. Sonnet 5 runs adaptive thinking when the
      // field is omitted, which is billed and pointless here: there is nothing
      // to reason about, the schema already pins the output shape.
      thinking: { type: "disabled" },
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: [{ role: "user", content: input }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "refused" }, { status: 502 });
    }

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      return NextResponse.json({ error: "empty" }, { status: 502 });
    }

    const parsed = JSON.parse(block.text) as {
      identity?: { label?: string; summary?: string };
      descriptors?: Array<{ id: string; weight: number }>;
    };

    const weights: Record<string, number> = {};
    for (const d of parsed.descriptors ?? []) {
      if (typeof d?.id !== "string" || typeof d?.weight !== "number") continue;
      // The enum constrains ids, but never trust it blindly, a bad id here
      // would silently skew the projection rather than throw.
      if (!DESCRIPTOR_IDS.includes(d.id)) continue;
      weights[d.id] = Math.max(0, Math.min(1, d.weight));
    }

    // Identity is optional by design: the model is told to omit it rather than
    // guess, so a missing one is a correct answer and the UI just shows less.
    const i = parsed.identity;
    const identity =
      i && typeof i.label === "string" && typeof i.summary === "string"
        ? {
            label: noEmDash(i.label).slice(0, 120),
            summary: noEmDash(i.summary).slice(0, 600),
          }
        : null;

    await writeCache({
      query_norm: queryNorm,
      query_raw: input,
      profile: weights,
      source: "model",
      identity,
    });

    return NextResponse.json({ weights, identity, cached: false });
  } catch (err) {
    console.error("[scent/decompose]", err);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
