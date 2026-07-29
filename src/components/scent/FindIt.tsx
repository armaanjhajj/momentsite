"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Neighbour } from "@/lib/scent/types";
import { descriptorLabel } from "@/data/scent/descriptors";

// "Replicate" tells you what the accord is made of. This tells you how to go
// and buy something that already smells like it. Two routes, because they want
// different text: a model wants the full descriptor breakdown and will reason
// about it, a search box wants a short phrase it can actually match.

type Props = {
  memory: string;
  msi: string;
  region: string;
  sub: string;
  neighbours: Neighbour[];
  weights: Record<string, number>;
};

function topWords(weights: Record<string, number>, n: number) {
  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id]) => descriptorLabel(id));
}

function buildPrompt(p: Props): string {
  const words = topWords(p.weights, 8);
  const mols = p.neighbours.slice(0, 6);

  return [
    `I am looking for products that smell like this. Here is the full profile.`,
    ``,
    `MEMORY: ${p.memory}`,
    `MSI: ${p.msi} (Moments Sense Index, band 1 is scent; ${p.region} > ${p.sub})`,
    ``,
    `SCENT PROFILE, strongest first:`,
    ...topWords(p.weights, 8).map((w, i) => {
      const v = Object.entries(p.weights).sort((a, b) => b[1] - a[1])[i];
      return `  ${w} (${v ? v[1].toFixed(2) : "0"})`;
    }),
    ``,
    `KEY AROMA MOLECULES, nearest first:`,
    ...mols.map(
      (n) =>
        `  ${n.molecule.name}: ${n.molecule.descriptors
          .map(descriptorLabel)
          .join(", ")}. Found in ${n.molecule.occurrences.slice(0, 2).join(", ")}.`
    ),
    ``,
    `Please recommend:`,
    `  1. Fragrances or colognes whose notes match this profile, with the specific notes that overlap.`,
    `  2. Candles, soaps or home scents that hit the same accord.`,
    `  3. Anything at a lower price that gets close, and what it compromises on.`,
    ``,
    `Prioritise products that carry ${words.slice(0, 3).join(", ")} together, since those dominate the profile. Say why each one matches rather than just listing names.`,
  ].join("\n");
}

function buildSearch(p: Props): string {
  const words = topWords(p.weights, 4);
  return `${words.join(" ")} fragrance notes perfume similar to ${p.memory}`;
}

export function FindIt(props: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const copy = async (text: string, which: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard is permission gated and fails silently in some contexts, so
      // fall back to a selection the user can copy by hand.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing left to try */
      }
      document.body.removeChild(ta);
    }
    setCopied(which);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1800);
  };

  const prompt = buildPrompt(props);
  const search = buildSearch(props);

  return (
    <>
      <button type="button" className="scent-findit" onClick={() => setOpen(true)}>
        Find it
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 17 17 7M8 7h9v9"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div className="scent-findit-overlay" onClick={() => setOpen(false)}>
            <div
              className="scent-findit-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Find products that match this scent"
            >
              <button
                className="scent-findit-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>

              <p className="scent-findit-eyebrow">Find it</p>
              <h3 className="scent-findit-title">
                Buy something that smells like {props.memory}
              </h3>

              <section className="scent-findit-block">
                <div className="scent-findit-head">
                  <h4>Ask an LLM</h4>
                  <button
                    type="button"
                    className="scent-copy"
                    onClick={() => copy(prompt, "llm")}
                  >
                    {copied === "llm" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="scent-findit-hint">
                  The whole profile, so it can reason about overlap rather than
                  guess from a name.
                </p>
                <pre className="scent-findit-pre">{prompt}</pre>
              </section>

              <section className="scent-findit-block">
                <div className="scent-findit-head">
                  <h4>Search the web</h4>
                  <button
                    type="button"
                    className="scent-copy"
                    onClick={() => copy(search, "web")}
                  >
                    {copied === "web" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="scent-findit-hint">
                  Short enough for a search box to actually match.
                </p>
                <pre className="scent-findit-pre scent-findit-pre-short">{search}</pre>
                <div className="scent-findit-links">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(search)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google
                  </a>
                  <a
                    href={`https://www.fragrantica.com/search/?query=${encodeURIComponent(
                      topWords(props.weights, 3).join(" ")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fragrantica
                  </a>
                </div>
              </section>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
