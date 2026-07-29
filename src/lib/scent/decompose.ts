// Free text -> descriptor weights.
//
// This is the plumbing, and it is worth being honest about that: the model has
// no idea what "my grandmother's kitchen" means. A human wrote that down in
// memories.ts. This file just does the matching, in three passes from most
// specific to least:
//
//   1. lexicon phrases, longest first, each consuming its span
//   2. synonyms for whatever words are left over
//   3. bare descriptor names, so typing "smoky woody" works directly
//
// Consuming spans is what stops "cut grass" from also firing the "grass" entry
// and double-counting green.

import { MEMORY_LEXICON, SYNONYMS } from "@/data/scent/memories";
import { DESCRIPTOR_IDS } from "@/data/scent/descriptors";
import type { Decomposition } from "./types";

const DESCRIPTOR_SET = new Set(DESCRIPTOR_IDS);

/**
 * Lowercase, flatten curly quotes, drop apostrophes entirely so "grandmother's"
 * and "grandmothers" collapse together, and reduce everything else to single
 * spaces. Leading/trailing spaces are kept as padding so we can match on word
 * boundaries with plain indexOf.
 */
export function normalise(text: string): string {
  return (
    " " +
    text
      .toLowerCase()
      .replace(/[‘’ʼ]/g, "")
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim() +
    " "
  );
}

type IndexedPhrase = { phrase: string; entry: number; words: number };

/**
 * Phrase index, built once at module load. Every lexicon phrase is registered
 * under its normalised form, plus an article-stripped alias so "nursery" finds
 * "a nursery". Sorted longest-first (by word count, then characters) so the
 * most specific reading always wins.
 */
const PHRASE_INDEX: IndexedPhrase[] = (() => {
  const out: IndexedPhrase[] = [];
  const seen = new Set<string>();

  const add = (phrase: string, entry: number) => {
    const key = `${phrase}::${entry}`;
    if (!phrase || seen.has(key)) return;
    seen.add(key);
    out.push({ phrase, entry, words: phrase.split(" ").length });
  };

  MEMORY_LEXICON.forEach((entry, i) => {
    for (const raw of entry.phrases) {
      const p = normalise(raw).trim();
      add(p, i);
      const stripped = p.replace(/^(a|an|the|my|some) /, "");
      if (stripped !== p) add(stripped, i);
    }
  });

  return out.sort((a, b) => b.words - a.words || b.phrase.length - a.phrase.length);
})();

/** Singular/plural fallback for a leftover token. */
function variants(word: string): string[] {
  const v = [word];
  if (word.endsWith("ies") && word.length > 4) v.push(word.slice(0, -3) + "y");
  if (word.endsWith("es") && word.length > 3) v.push(word.slice(0, -2));
  if (word.endsWith("s") && word.length > 3) v.push(word.slice(0, -1));
  if (!word.endsWith("s")) v.push(word + "s");
  return v;
}

export function decompose(text: string): Decomposition {
  const norm = normalise(text);
  const weights: Record<string, number> = {};
  const matched: string[] = [];

  // Track which characters have been claimed, so a longer phrase blocks the
  // shorter ones inside it.
  const claimed = new Array<boolean>(norm.length).fill(false);

  const bump = (id: string, value: number) => {
    if (!DESCRIPTOR_SET.has(id)) return;
    // max rather than sum: two phrases both meaning "smoky" should not make a
    // memory twice as smoky as one phrase does.
    weights[id] = Math.max(weights[id] ?? 0, value);
  };

  // ── pass 1: lexicon phrases ──────────────────────────────────────
  for (const { phrase, entry } of PHRASE_INDEX) {
    const needle = ` ${phrase} `;
    let from = 0;
    for (;;) {
      const at = norm.indexOf(needle, from);
      if (at === -1) break;
      const start = at + 1;
      const end = start + phrase.length;

      let free = true;
      for (let i = start; i < end; i++) if (claimed[i]) { free = false; break; }

      if (free) {
        for (let i = start; i < end; i++) claimed[i] = true;
        for (const [id, w] of Object.entries(MEMORY_LEXICON[entry].weights)) bump(id, w);
        matched.push(phrase);
      }
      from = at + 1;
    }
  }

  // ── passes 2 & 3: leftover words ─────────────────────────────────
  const unmatched: string[] = [];
  let totalWords = 0;
  let claimedWords = 0;

  let cursor = 0;
  while (cursor < norm.length) {
    if (norm[cursor] === " ") { cursor++; continue; }
    let end = cursor;
    while (end < norm.length && norm[end] !== " ") end++;
    const word = norm.slice(cursor, end);

    if (claimed[cursor]) {
      totalWords++;
      claimedWords++;
      cursor = end;
      continue;
    }

    // Grammar should not drag confidence down ("coffee in the morning" is a)
    // fully understood memory, not a 25% one.
    if (STOPWORDS.has(word)) {
      cursor = end;
      continue;
    }
    totalWords++;

    let hit = false;
    for (const v of variants(word)) {
      // direct descriptor name beats synonym ("smoky" is already an axis)
      if (DESCRIPTOR_SET.has(v)) { bump(v, 0.85); matched.push(v); hit = true; break; }
      const syn = SYNONYMS[v];
      if (syn) { bump(syn, 0.75); matched.push(word); hit = true; break; }
    }

    if (hit) claimedWords++;
    else if (word.length > 2 && !STOPWORDS.has(word)) unmatched.push(word);

    cursor = end;
  }

  const confidence = totalWords === 0 ? 0 : claimedWords / totalWords;

  return {
    weights,
    matched: [...new Set(matched)],
    unmatched,
    confidence,
    source: "lexicon",
  };
}

// Words that carry no scent information; excluded from `unmatched` so the
// confidence signal is not dragged down by grammar.
const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "was", "were", "are", "but",
  "from", "into", "onto", "when", "then", "just", "like", "very", "really",
  "some", "something", "smell", "smells", "smelled", "smelling", "scent",
  "smelt", "odor", "odor", "aroma", "remember", "remembering", "reminds",
  "reminded", "memory", "always", "used", "would", "could", "there", "their",
  "his", "her", "its", "our", "your", "you", "she", "him", "them", "they",
  "had", "has", "have", "been", "being", "not", "all", "out", "off", "over",
  "after", "before", "during", "while", "still", "back", "down", "about",
  "morning", "afternoon", "evening", "night", "today", "yesterday", "time",
  "every", "each", "once", "again", "one", "two", "old", "new", "little",
]);

/** Weights -> sorted array, largest first. Shared by the UI and the projector. */
export function topWeights(weights: Record<string, number>, limit = 8) {
  return Object.entries(weights)
    .map(([id, value]) => ({ id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/** Merge model output into lexicon output, keeping the stronger claim. */
export function mergeWeights(
  base: Record<string, number>,
  extra: Record<string, number>
): Record<string, number> {
  const out = { ...base };
  for (const [id, v] of Object.entries(extra)) {
    if (!DESCRIPTOR_SET.has(id)) continue;
    const clamped = Math.max(0, Math.min(1, v));
    out[id] = Math.max(out[id] ?? 0, clamped);
  }
  return out;
}
