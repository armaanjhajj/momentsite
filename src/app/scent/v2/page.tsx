"use client";

// SCENT v2, the semantic retrieval bench.
//
// Unlisted on purpose. This is not a nicer version of /scent; it is the same
// question asked a different way, with the working left in so the two can be
// compared honestly. Every number on this page comes from the response to the
// query you typed, not from a fixture.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExhibitClose } from "@/components/ExhibitClose";
import { ScentThinking } from "@/components/scent/ScentThinking";
import { SmilesStructure } from "@/components/scent/SmilesStructure";

const MIN_LOADING_MS = 420;

const PROBES = [
  "orange peel",
  "campfire",
  "new car",
  "the inside of my violin case",
  "a hospital corridor at night",
  "petrichor",
];

type Weighted = { label: string; z: number; weight: number };
type Desc = { label: string; p: number };
type Cand = {
  atlasId: string;
  smiles: string;
  name: string | null;
  curated: boolean;
  msi: string;
  embedScore: number;
  embedRank: number;
  descriptors: Desc[];
  rerankScore?: number;
  finalRank?: number;
  movedBy?: number;
  document?: string;
};

type V2 = {
  query: string;
  determinism: string;
  cold: { warmedThisRequest: boolean; warmMs: number; coldStartMs: number };
  embed: {
    model: string;
    inputType: string;
    dim: number;
    ms: number;
    billed: Record<string, number>;
    cached: boolean;
    preview: number[];
    norm: number;
  };
  anchors: {
    count: number;
    template: string;
    ms: number;
    mean: number;
    sd: number;
    top: Array<{ label: string; score: number }>;
    bottom: Array<{ label: string; score: number }>;
  };
  profile: { anchorsKept: number; sharpen: number; note: string; weights: Weighted[] };
  scoring: {
    molecules: number;
    topK: number;
    ms: number;
    dotProducts: number;
    note: string;
    shortlist: number;
    preRerank: Cand[];
  };
  rerank: {
    model: string;
    ms: number;
    cached: boolean;
    billed: Record<string, number>;
    documentsSent: number;
    error: string | null;
    results: Cand[];
  };
  v1: {
    matched: string[];
    confidence: number;
    wouldCallModel: boolean;
    weights: Array<{ id: string; value: number }>;
    msi: string | null;
    placed: boolean;
    molecules: Array<{ name: string; smiles: string; score: number }>;
  };
  totalMs: number;
  apiCalls: number;
  cached: boolean;
};

export default function ScentV2() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<V2 | null>(null);
  const [thinking, setThinking] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const runId = useRef(0);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const run = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;
    const id = ++runId.current;
    const t0 = Date.now();

    setError(null);
    setThinking(true);
    setStage("embedding the phrase with cohere");

    try {
      const res = await fetch("/api/scent/v2", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: q }),
      });
      const body = await res.json().catch(() => null);
      if (runId.current !== id) return;

      const left = MIN_LOADING_MS - (Date.now() - t0);
      if (left > 0) await new Promise((r) => setTimeout(r, left));
      if (runId.current !== id) return;

      if (!res.ok || !body || body.error) {
        setError(body?.detail ?? body?.error ?? `request failed (${res.status})`);
        setData(null);
        return;
      }
      setData(body as V2);
    } catch {
      if (runId.current === id) setError("could not reach the route");
    } finally {
      if (runId.current === id) setThinking(false);
    }
  }, []);

  useEffect(() => {
    if (!data) return;
    const top = (resultsRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 24), behavior: "smooth" });
  }, [data]);

  return (
    <div className="scent-page v2-page">
      <ExhibitClose />

      <nav className="v2-back">
        <Link href="/scent">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to the deployed SCENT
        </Link>
        <span className="v2-badge">unlisted test</span>
      </nav>

      <header className="scent-hero">
        <p className="scent-eyebrow">Moments Sense Index · bench</p>
        <h1 className="scent-title">
          SCENT<span className="v2-mark">V2</span>
        </h1>

        <dl className="v2-facts">
          <div>
            <dt>v1</dt>
            <dd>Hand-written lexicon. Claude API failsafe when it misses.</dd>
          </div>
          <div>
            <dt>v2</dt>
            <dd>Deterministic, no reasoning at runtime.</dd>
          </div>
          <div>
            <dt>Bridge</dt>
            <dd>
              GNN scores every molecule against 150 descriptors which are also
              embedded as text. Query phrase embeds into the same space and
              produces a dot product for each.
            </dd>
          </div>
        </dl>
      </header>

      <form
        className="scent-form"
        onSubmit={(e) => {
          e.preventDefault();
          void run(input);
        }}
      >
        <input
          className="scent-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="describe any smell"
          aria-label="A smell to test"
          autoComplete="off"
          maxLength={300}
        />
        <button
          className="scent-submit"
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Run"
        >
          {thinking ? (
            <span className="scent-submit-spin" aria-label="Working" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4.5 12h14M12.5 5.5 19 12l-6.5 6.5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </form>

      <ul className="v2-probes">
        {PROBES.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => {
                setInput(p);
                void run(p);
              }}
              disabled={thinking}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>

      {thinking && <ScentThinking stage={stage} />}
      {error && <p className="v2-error">{error}</p>}

      <div ref={resultsRef}>
        {data && !thinking && <Trace d={data} />}
      </div>
    </div>
  );
}

/* ── the whole pipeline, one step per block ──────────────────────── */

function Trace({ d }: { d: V2 }) {
  return (
    <div className="scent-results v2-trace">
      <Step n="01" title="Query embedding" ms={d.embed.ms} api="Cohere Embed">
        <dl className="v2-kv">
          <div><dt>model</dt><dd>{d.embed.model}</dd></div>
          <div><dt>input_type</dt><dd>{d.embed.inputType}</dd></div>
          <div><dt>dimensions</dt><dd>{d.embed.dim}</dd></div>
          <div><dt>vector norm</dt><dd>{d.embed.norm}</dd></div>
          <div><dt>billed</dt><dd>{JSON.stringify(d.embed.billed)}</dd></div>
          <div><dt>source</dt><dd>{d.embed.cached ? "cache" : "cohere"}</dd></div>
        </dl>
        <p className="v2-vec">
          [{d.embed.preview.join(", ")}, … {d.embed.dim - d.embed.preview.length} more]
        </p>
      </Step>

      <Step n="02" title="Anchor projection" ms={d.anchors.ms} api="local">
        <p className="v2-note">
          Each of the GNN&apos;s 150 descriptor names was embedded once, as
          <em> {d.anchors.template}</em>. This is a dot product against each,
          which is the step that replaces the phrase table.
        </p>
        <p className="v2-note v2-note-dim">
          Raw scores cluster tightly (mean {d.anchors.mean}, sd {d.anchors.sd}),
          so the signal is the deviation, not the value. Bars below are z-scores.
        </p>
        <Bars
          rows={d.anchors.top.map((a) => ({
            label: a.label,
            value: (a.score - d.anchors.mean) / d.anchors.sd,
          }))}
          max={Math.max(
            ...d.anchors.top.map((a) => (a.score - d.anchors.mean) / d.anchors.sd)
          )}
          fmt={(v) => v.toFixed(2)}
        />
        <p className="v2-note v2-note-dim">
          Furthest anchors: {d.anchors.bottom.map((b) => b.label).join(", ")}
        </p>
      </Step>

      <Step n="03" title="Descriptor profile" ms={0} api="local">
        <p className="v2-note">{d.profile.note}</p>
        <p className="v2-note v2-note-dim">
          Top {d.profile.anchorsKept} anchors kept, sharpened at T={d.profile.sharpen}.
        </p>
        <ul className="v2-chips">
          {d.profile.weights.map((w) => (
            <li key={w.label}>
              {w.label}
              <span>{w.weight.toFixed(3)}</span>
            </li>
          ))}
        </ul>
      </Step>

      <Step
        n="04"
        title="Corpus scoring"
        ms={d.scoring.ms}
        api="local"
      >
        <p className="v2-note">
          {d.scoring.molecules.toLocaleString()} molecules. {d.scoring.note}.
        </p>
        <p className="v2-note v2-note-dim">
          Each molecule carries its top {d.scoring.topK} descriptor probabilities
          from the GNN&apos;s classifier head, the part the deployed site throws
          away. Cosine between that and the profile above. Shortlist of{" "}
          {d.scoring.shortlist} goes to the reranker.
        </p>
        <CandTable rows={d.scoring.preRerank} mode="embed" />
      </Step>

      <Step n="05" title="Rerank" ms={d.rerank.ms} api="Cohere Rerank">
        {d.rerank.error ? (
          <p className="v2-error">rerank failed: {d.rerank.error}</p>
        ) : (
          <>
            <dl className="v2-kv">
              <div><dt>model</dt><dd>{d.rerank.model}</dd></div>
              <div><dt>documents</dt><dd>{d.rerank.documentsSent}</dd></div>
              <div><dt>billed</dt><dd>{JSON.stringify(d.rerank.billed)}</dd></div>
              <div><dt>source</dt><dd>{d.rerank.cached ? "cache" : "cohere"}</dd></div>
            </dl>
            <p className="v2-note v2-note-dim">
              Rerank reads text, so each candidate is described by its own
              predicted descriptors. It still never sees a molecule. Example
              document: <em>{d.rerank.results[0]?.document}</em>
            </p>
            <CandTable rows={d.rerank.results} mode="rerank" />
          </>
        )}
      </Step>

      <Step n="06" title="Result" ms={0} api="">
        <div className="v2-cards">
          {d.rerank.results.slice(0, 6).map((c) => (
            <article key={c.atlasId} className="scent-card scent-card-thin">
              <div className="scent-card-head">
                <span className="scent-card-rank">
                  {String(c.finalRank).padStart(2, "0")}
                </span>
                <div className="scent-card-id">
                  <h3>{c.name ?? c.smiles}</h3>
                  <span className="scent-card-score">
                    MSI {c.msi} &middot; rerank {c.rerankScore?.toFixed(3)}
                  </span>
                </div>
              </div>
              <SmilesStructure smiles={c.smiles} name={c.name ?? c.smiles} size={220} />
              <ul className="scent-chips">
                {c.descriptors.slice(0, 5).map((x) => (
                  <li key={x.label} className="scent-chip">
                    {x.label}
                    <em>{x.p.toFixed(2)}</em>
                  </li>
                ))}
              </ul>
              {!c.curated && (
                <p className="scent-card-unannotated">
                  Placed by the model, not yet annotated.
                </p>
              )}
            </article>
          ))}
        </div>
      </Step>

      <Step n="07" title="v1 comparison" ms={0} api="deployed site">
        <dl className="v2-kv">
          <div><dt>lexicon matched</dt><dd>{d.v1.matched.length ? d.v1.matched.join(", ") : "nothing"}</dd></div>
          <div><dt>confidence</dt><dd>{d.v1.confidence}</dd></div>
          <div><dt>falls back to Claude</dt><dd>{d.v1.wouldCallModel ? "yes" : "no"}</dd></div>
          <div><dt>MSI</dt><dd>{d.v1.msi ?? "could not place"}</dd></div>
        </dl>

        {d.v1.wouldCallModel && (
          <p className="v2-note v2-flag">
            This is the case v2 exists for. v1 hands the phrase to a language
            model, so the descriptors, and therefore the MSI, depend on what the
            model returns that day. v2 answers it with a dot product.
          </p>
        )}

        {d.v1.placed ? (
          <>
            <ul className="v2-chips">
              {d.v1.weights.map((w) => (
                <li key={w.id}>
                  {w.id}
                  <span>{w.value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="v2-note v2-note-dim">
              v1 molecules: {d.v1.molecules.map((m) => m.name).join(", ")}
            </p>
          </>
        ) : (
          <p className="v2-note v2-note-dim">
            The lexicon could not place this at all, so the deployed site would
            show nothing without the model call.
          </p>
        )}
      </Step>

    </div>
  );
}

/* ── small pieces ────────────────────────────────────────────────── */

function Step({
  n,
  title,
  ms,
  api,
  children,
}: {
  n: string;
  title: string;
  ms: number;
  api: string;
  children: React.ReactNode;
}) {
  return (
    <section className="v2-step">
      <h2>
        <span className="v2-step-n">{n}</span>
        {title}
        <span className="v2-step-meta">
          {api && <span className={api.startsWith("Cohere") ? "v2-tag v2-tag-api" : "v2-tag"}>{api}</span>}
          {ms > 0 && <span className="v2-ms">{ms} ms</span>}
        </span>
      </h2>
      <div className="v2-step-body">{children}</div>
    </section>
  );
}

function Bars({
  rows,
  max,
  fmt,
}: {
  rows: Array<{ label: string; value: number }>;
  max: number;
  fmt: (v: number) => string;
}) {
  return (
    <ul className="v2-bars">
      {rows.map((r) => (
        <li key={r.label}>
          <span className="v2-bar-label">{r.label}</span>
          <span className="v2-bar-track">
            <span
              className="v2-bar-fill"
              style={{ width: `${Math.max(2, (r.value / (max || 1)) * 100)}%` }}
            />
          </span>
          <span className="v2-bar-value">{fmt(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

function CandTable({ rows, mode }: { rows: Cand[]; mode: "embed" | "rerank" }) {
  return (
    <div className="v2-table-scroll">
      <table className="v2-table">
        <thead>
          <tr>
            <th>#</th>
            <th>molecule</th>
            <th className="v2-num">{mode === "embed" ? "cosine" : "rerank"}</th>
            {mode === "rerank" && <th className="v2-num">moved</th>}
            <th>predicted descriptors</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.atlasId}>
              <td className="v2-num">{mode === "embed" ? c.embedRank : (c.finalRank ?? i + 1)}</td>
              <td className="v2-mol">
                {c.name ? <strong>{c.name}</strong> : <code>{c.smiles}</code>}
                {c.curated && <span className="v2-curated">card</span>}
              </td>
              <td className="v2-num">
                {mode === "embed" ? c.embedScore.toFixed(3) : c.rerankScore?.toFixed(3)}
              </td>
              {mode === "rerank" && (
                <td className="v2-num">
                  {c.movedBy === 0 ? (
                    <span className="v2-move-flat">0</span>
                  ) : (c.movedBy ?? 0) > 0 ? (
                    <span className="v2-move-up">+{c.movedBy}</span>
                  ) : (
                    <span className="v2-move-down">{c.movedBy}</span>
                  )}
                </td>
              )}
              <td className="v2-desc">
                {c.descriptors.slice(0, 4).map((x) => `${x.label} ${x.p.toFixed(2)}`).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
