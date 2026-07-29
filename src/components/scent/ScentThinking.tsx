"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DESCRIPTORS } from "@/data/scent/descriptors";
import { FAMILIES, FAMILY_COUNT } from "@/data/scent/families";
import { ScentPolygon } from "./ScentPolygon";

// The wait is real and worth dressing, but only on one path: the lexicon
// answers instantly, and the several-second pause happens when it fails and
// the model gets asked. So this shows what is actually going on, a shape
// searching odor space for one that fits. Rather than a generic spinner.
//
// Everything here is decorative and says so. The shapes are random, not
// candidate readings of the input; pretending otherwise would be a progress
// bar that lies.

const SETTLE_MS = 780;
const WORD_MS = 70;

/** A plausible-looking scent profile: a few strong families, the rest quiet. */
function randomProfile(seed: number): number[] {
  // Deterministic per tick so the tween has a stable target identity.
  const out = new Array<number>(FAMILY_COUNT).fill(0);
  const rnd = (n: number) => {
    const x = Math.sin(seed * 977.13 + n * 31.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const peaks = 3 + Math.floor(rnd(0) * 3);
  for (let i = 0; i < FAMILY_COUNT; i++) out[i] = 0.04 + rnd(i + 1) * 0.12;
  for (let p = 0; p < peaks; p++) {
    const idx = Math.floor(rnd(50 + p) * FAMILY_COUNT);
    out[idx] = 0.5 + rnd(80 + p) * 0.5;
    // bleed into neighbours so the shape reads organic rather than spiky
    out[(idx + 1) % FAMILY_COUNT] = Math.max(out[(idx + 1) % FAMILY_COUNT], 0.25 + rnd(90 + p) * 0.3);
    out[(idx + FAMILY_COUNT - 1) % FAMILY_COUNT] = Math.max(
      out[(idx + FAMILY_COUNT - 1) % FAMILY_COUNT],
      0.2 + rnd(95 + p) * 0.3
    );
  }
  return out;
}

export function ScentThinking({ stage }: { stage: string }) {
  const [tick, setTick] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [reduced, setReduced] = useState(false);
  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Shape settles into a new profile every beat.
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setTick((v) => v + 1), SETTLE_MS);
    return () => window.clearInterval(t);
  }, [reduced]);

  // Vocabulary scan.
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(
      () => setWordIdx((v) => (v + 1) % DESCRIPTORS.length),
      WORD_MS
    );
    return () => window.clearInterval(t);
  }, [reduced]);

  // Elapsed seconds, so a long wait is acknowledged rather than silent.
  useEffect(() => {
    const t = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      500
    );
    return () => window.clearInterval(t);
  }, []);

  const profile = useMemo(() => randomProfile(tick), [tick]);
  const word = DESCRIPTORS[wordIdx];

  return (
    <div className="scent-thinking" role="status" aria-live="polite">
      <div className="scent-thinking-viz" aria-hidden="true">
        <ScentPolygon
          size={190}
          morph={!reduced}
          showLabels={false}
          series={[{ values: profile, color: "rgba(255,255,255,0.9)" }]}
        />
        <span className="scent-thinking-pulse" />
      </div>

      <div className="scent-thinking-body">
        <p className="scent-thinking-stage">{stage}</p>

        <p className="scent-thinking-scan" aria-hidden="true">
          <span className="scent-thinking-scan-label">scanning</span>
          <span
            className="scent-thinking-word"
            style={{ color: `hsl(${word.hue}, 72%, 68%)` }}
          >
            {word.label}
          </span>
        </p>

        <div className="scent-thinking-track" aria-hidden="true">
          <span className="scent-thinking-sweep" />
        </div>

        <p className="scent-thinking-meta">
          {FAMILIES.length} axes · {DESCRIPTORS.length} descriptors
          {elapsed >= 4 && <> · {elapsed}s</>}
        </p>
      </div>

      <span className="scent-sr-only">{stage}</span>
    </div>
  );
}
