"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExhibitClose } from "@/components/ExhibitClose";
import { Footnote } from "@/components/Footnote";
import { SmilesStructure } from "@/components/scent/SmilesStructure";
import { OdorMap } from "@/components/scent/OdorMap";
import { ScentPolygon } from "@/components/scent/ScentPolygon";
import { ScentThinking } from "@/components/scent/ScentThinking";
import { FindIt } from "@/components/scent/FindIt";
import { Crumbs } from "@/components/scent/Crumbs";
import { ShareMemory } from "@/components/scent/ShareMemory";
import { descriptorColor, descriptorLabel } from "@/data/scent/descriptors";
import { toFamilyVector, moleculeFamilyVector } from "@/data/scent/families";
import { decompose, mergeWeights, topWeights } from "@/lib/scent/decompose";
import {
  EMBEDDING_META,
  describe,
  moleculeVector,
  neighbours,
  opposite,
  project,
  projectXY,
} from "@/lib/scent/project";
import { formulate, thresholdProvenance } from "@/lib/scent/formulate";
import { msiFor, SENSES, SENSE_SEP, ZONE_COUNT, TOTAL_ZONES } from "@/lib/scent/msi";
import type { Msi } from "@/lib/scent/msi";
import type { Decomposition, Neighbour } from "@/lib/scent/types";

const ASK_MODEL_BELOW = 0.6;
// The lexicon answers in under a millisecond, which reads as nothing having
// happened at all. Holding the loading state briefly makes the work legible.
// Purely a UI beat, not real latency being hidden.
const MIN_LOADING_MS = 520;
// Cards shown before the More button. Three fills a row on desktop and
// keeps the section from burying everything under it.
const VISIBLE_CARDS = 3;

// Shuffle pool. Deliberately spread across places, materials, food and
// weather so consecutive presses do not all land in the same corner of the map.
const SHUFFLE_POOL = [
  "sidewalk on a rainy day",
  "my grandmother's kitchen",
  "a used bookstore",
  "the pool in summer",
  "campfire",
  "a new car",
  "wet dog",
  "a hospital hallway",
  "cut grass",
  "the sea at low tide",
  "gasoline at a petrol station",
  "cinnamon and cloves at christmas",
  "an old wardrobe",
  "fresh laundry",
  "a tyre shop",
  "burnt toast",
  "my dad's garage",
  "jasmine at night",
  "crayons",
  "a locker room",
  "coffee in the morning",
  "an antique shop",
  "peaches in summer",
  "chlorine and sunscreen",
  "wet soil in a greenhouse",
  "leather jacket",
  "popcorn at the cinema",
  "a struck match",
  "grandma's perfume",
  "the underground",
];

type Identity = { label: string; summary: string };

type Side = { text: string; dec: Decomposition; vec: number[] };

type Result = {
  a: Side;
  /** the memory's own zone */
  msi: Msi;
  /** each returned molecule's zone, in the same order */
  cardMsi: string[];
  neighbours: Neighbour[];
  xy: [number, number];
  /** the far side of the map, named in words rather than drawn */
  inverse: { words: Array<{ id: string; score: number }> };
};

/** One molecule from the corpus-wide ranking. */
type Ranked = {
  id: string;
  atlasId: string;
  name: string | null;
  smiles: string;
  curated: boolean;
  similarity: number;
  distance: number;
  msi: string;
  descriptors: string[];
};

type Corpus = {
  results: Ranked[];
  nearest: Ranked;
  nearestIsCurated: boolean;
  corpus: number;
};

export default function Scent() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [empty, setEmpty] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [stage, setStage] = useState("");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [showAll, setShowAll] = useState(false);
  // Corpus-wide retrieval. Arrives after the page renders, because it needs a
  // round trip and the curated answer is already good enough to show.
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const runId = useRef(0);
  const shuffleAt = useRef(0);

  /**
   * Decompose one string.
   *
   * The model is asked every time and we always wait for it, because it
   * supplies the identity card and that card sits above everything else. An
   * earlier version rendered the lexicon answer straight away and let the
   * identity arrive late, which put a loading skeleton on top of a finished
   * page. Now nothing appears until the whole answer is ready.
   */
  const resolve = useCallback(async (text: string, id: number): Promise<Side | null> => {
    const lexical = decompose(text);

    const pending = fetch("/api/scent/decompose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null) as Promise<{
      weights?: Record<string, number>;
      identity?: Identity | null;
    } | null>;

    setIdentity(null);

    // The stage line still distinguishes the two cases, because when the
    // lexicon already understood the input the model is only being asked for
    // the description, and saying so is more honest than a generic spinner.
    setStage(
      lexical.confidence >= ASK_MODEL_BELOW
        ? "reading your memory. asking the model what it is"
        : lexical.matched.length > 0
          ? "the lexicon only caught part of that. asking the model"
          : "the lexicon doesn’t know that one. asking the model"
    );

    const data = await pending;
    if (runId.current === id) setIdentity(data?.identity ?? null);

    // A lexicon hit keeps its own reading; the model only adds weights when
    // the lexicon was unsure.
    if (lexical.confidence >= ASK_MODEL_BELOW) {
      const vec = project(lexical.weights);
      return vec ? { text, dec: lexical, vec } : null;
    }

    const dec: Decomposition = data?.weights
      ? {
          ...lexical,
          weights: mergeWeights(lexical.weights, data.weights),
          source: "lexicon+model",
        }
      : lexical;

    const vec = project(dec.weights);
    return vec ? { text, dec, vec } : null;
  }, []);

  const run = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q) return;

      const id = ++runId.current;
      const t0 = Date.now();
      setEmpty(null);
      setThinking(true);
      setStage("reading your memory");
      setShowAll(false);

      // Hold the loading state to a floor so a lexicon hit does not flash.
      const settle = async () => {
        const left = MIN_LOADING_MS - (Date.now() - t0);
        if (left > 0) await new Promise((r) => setTimeout(r, left));
      };

      try {
        const a = await resolve(q, id);
        if (runId.current !== id) return;

        await settle();
        if (runId.current !== id) return;

        if (!a) {
          setResult(null);
          setEmpty(q);
          return;
        }

        const near = neighbours(a.vec, a.dec.weights, 6);

        // All 5,548, ranked server-side. Deliberately not awaited: the curated
        // answer renders immediately and this fills in behind it.
        setCorpus(null);
        void fetch("/api/scent/nearest", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ vec: a.vec }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d: Corpus | null) => {
            if (runId.current === id && d) setCorpus(d);
          })
          .catch(() => undefined);

        setResult({
          a,
          msi: msiFor(a.vec),
          cardMsi: near.map((n) => msiFor(moleculeVector(n.molecule.id)).label),
          neighbours: near,
          xy: projectXY(a.vec),
          // Negating a unit vector gives the point of least similarity, then
          // describe() reads that coordinate back out as words.
          inverse: { words: describe(opposite(a.vec), 3) },
        });
      } finally {
        if (runId.current === id) setThinking(false);
      }
    },
    [resolve]
  );

  // Shared results have to reopen. Read from window rather than
  // useSearchParams so the page does not need a Suspense boundary for a
  // parameter that is almost never present.
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (!q) return;
    setInput(q);
    void run(q);
  }, [run]);

  const lastQuery = useRef<string | null>(null);
  useEffect(() => {
    if (!result || result.a.text === lastQuery.current) return;
    lastQuery.current = result.a.text;
    const top =
      (resultsRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    // Leave a margin so the card is not welded to the top of the viewport.
    window.scrollTo({ top: Math.max(0, top - 28), behavior: "smooth" });
  }, [result]);

  const shuffle = () => {
    // Step forward by a variable stride rather than sampling uniformly, so
    // pressing twice never lands on the same memory.
    shuffleAt.current = (shuffleAt.current + 1 + Math.floor(Math.random() * 7)) % SHUFFLE_POOL.length;
    const pick = SHUFFLE_POOL[shuffleAt.current];
    setInput(pick);
    run(pick);
  };

  const bars = result ? topWeights(result.a.dec.weights, 7) : [];
  // Only the top three are shown up front; the rest sit behind More.
  const visible = result ? result.neighbours.slice(0, VISIBLE_CARDS) : [];
  const hidden = result ? result.neighbours.slice(VISIBLE_CARDS) : [];

  return (
    <div className="scent-page">
      <ExhibitClose />

      <header className="scent-hero">
        <Crumbs
          items={[
            { label: "Artifacts", href: "/artifacts" },
            { label: "Board", href: "/board" },
            { label: "Scent", href: "/scent" },
          ]}
        />
        <h1 className="scent-title">SCENT</h1>
        <p className="scent-tagline">Describe a smell you remember.</p>
      </header>

      <form
        className="scent-form"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
      >
        <input
          className="scent-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="sidewalk on a rainy day"
          aria-label="A smell you remember"
          autoComplete="off"
          maxLength={400}
        />
        <button
          className="scent-submit"
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Search"
        >
          {thinking ? (
            <span className="scent-submit-spin" aria-label="Working" />
          ) : (
            // Drawn rather than typed: the "→" glyph is a hairline at this
            // size and looked weightless against a solid button.
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
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

        <span className="scent-or" aria-hidden="true">
          or
        </span>

        <button
          className="scent-shuffle"
          type="button"
          onClick={shuffle}
          disabled={thinking}
          aria-label="Shuffle to a random memory"
          title="Shuffle"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      {thinking && <ScentThinking stage={stage} />}

      {empty && (
        <p className="scent-empty">
          Nothing in <em>{empty}</em> mapped onto the descriptor vocabulary. Try
          a place, a material, or a food, or a plain smell word like{" "}
          <em>smoky</em>, <em>green</em>, <em>metallic</em>.
        </p>
      )}

      <div ref={resultsRef}>
        {identity && result && <IdentityCard identity={identity} />}
        {result && (
          <ShareMemory
            query={result.a.text}
            msi={result.msi}
            weights={result.a.dec.weights}
          />
        )}
      </div>

      {result && (
        <div className="scent-results">
          {/* ── MSI ──────────────────────────────────────────────── */}
          <section className="scent-section">
            <h2 className="scent-h2">
              <span className="scent-h2-num">01</span> <MsiFootnote />
            </h2>
            <div className="scent-msi">
              <div className="scent-msi-code">
                <span className="scent-msi-band" title={`${result.msi.senseName} band`}>
                  {result.msi.sense}
                  <span className="scent-msi-band-dot">{SENSE_SEP}</span>
                </span>
                {result.msi.zoneLabel}
              </div>
              <p className="scent-msi-region">
                {result.msi.senseName}
                <span className="scent-msi-sep">›</span>
                {result.msi.region}
                {/* A cell with nothing to add beyond its region falls back to
                    the region's own name, and saying it twice reads as a bug. */}
                {result.msi.sub !== result.msi.region && (
                  <>
                    <span className="scent-msi-sep">›</span>
                    {result.msi.sub}
                  </>
                )}
              </p>

              {result.msi.edge && (
                <p className="scent-msi-edge">
                  Sits near the edge of {result.msi.edge.towardLabel},{" "}
                  {result.msi.edge.towardRegion}.
                </p>
              )}

            </div>
          </section>

          {/* ── profile ──────────────────────────────────────────── */}
          <section className="scent-section">
            <h2 className="scent-h2">
              <span className="scent-h2-num">02</span> Decomp
            </h2>

            <div className="scent-profile">
              <ScentPolygon
                size={340}
                series={[
                  { values: toFamilyVector(result.a.dec.weights), color: "#ffffff" },
                ]}
              />

              <ul className="scent-bars">
                {bars.map((b) => (
                  <li key={b.id} className="scent-bar-row">
                    <span className="scent-bar-label">{descriptorLabel(b.id)}</span>
                    <span className="scent-bar-track">
                      <span
                        className="scent-bar-fill"
                        style={{
                          width: `${b.value * 100}%`,
                          background: descriptorColor(b.id, 0.85),
                        }}
                      />
                    </span>
                    <span className="scent-bar-value">{b.value.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <InverseNote
              words={result.inverse.words}
              onPick={(w) => {
                setInput(w);
                run(w);
              }}
            />
          </section>

          {/* ── molecules ────────────────────────────────────────── */}
          <section className="scent-section">
            <h2 className="scent-h2">
              <span className="scent-h2-num">03</span> Molecules
            </h2>

            <div className="scent-cards">
              {visible.map((n, i) => (
                <MoleculeCard key={n.molecule.id} n={n} i={i} msi={result.cardMsi[i]} />
              ))}
            </div>

            {/* The closest molecule in the whole corpus, boosted by nothing.
                Retrieval is ranked with a small curated bump so the richer
                cards lead; this line is the unflattered answer. */}
            <TrueNearest corpus={corpus} />

            {hidden.length > 0 && (
              <div className={`scent-more${showAll ? " scent-more-open" : ""}`}>
                <div className="scent-more-clip">
                  <div className="scent-cards">
                    {hidden.map((n, i) => (
                      <MoleculeCard
                        key={n.molecule.id}
                        n={n}
                        i={i + VISIBLE_CARDS}
                        msi={result.cardMsi[i + VISIBLE_CARDS]}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="scent-more-btn"
                  onClick={() => setShowAll((v) => !v)}
                  aria-expanded={showAll}
                >
                  {showAll ? "Hide" : "More"}
                  {!showAll && (
                    <span className="scent-more-count">+{hidden.length}</span>
                  )}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="scent-more-chev"
                  >
                    <path
                      d="m5 9 7 7 7-7"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* The second tier. Ranked in the same list server-side, rendered
                apart here only because the cards carry less. */}
            {corpus && corpus.results.some((r) => !r.curated) && (
              <div className="scent-tier2">
                <h3 className="scent-tier2-head">
                  Also nearby, from the wider corpus
                  <span>
                    {corpus.corpus.toLocaleString()} molecules placed, 156 annotated
                  </span>
                </h3>
                <div className="scent-cards">
                  {corpus.results
                    .filter((r) => !r.curated)
                    .slice(0, 3)
                    .map((r, i) => (
                      <RankedCard key={r.atlasId} m={r} i={i} />
                    ))}
                </div>
              </div>
            )}
          </section>

          <MakeIt result={result} />

          {/* ── the map ──────────────────────────────────────────── */}
          <section className="scent-section">
            <h2 className="scent-h2">
              <span className="scent-h2-num">05</span> Map
            </h2>
            <OdorMap
              highlight={result.neighbours.map((n) => n.molecule.id)}
              query={result.xy}
              queryMsi={result.msi.label}
            />
          </section>

          {result.neighbours.some((n) => n.molecule.id.startsWith("carvone-")) && (
            <aside className="scent-caveat">
              <h3>Both carvones came back, and that is the flaw</h3>
              <p>
                (R)-carvone smells of spearmint; its mirror image smells of
                caraway. The network was given chirality tags, and the audit says
                enantiomer pairs sit at <strong>20% of the distance</strong>{" "}
                random pairs do, so it sees handedness a little and nowhere near
                enough. A flat molecular graph has no 3D geometry to work with.
                That number is measured, not assumed, and it is the honest
                ceiling on this approach.
              </p>
            </aside>
          )}

          <Method />
        </div>
      )}
    </div>
  );
}

/* ── the true nearest, across all 5,548 ─────────────────────────── */

function TrueNearest({ corpus }: { corpus: Corpus | null }) {
  if (!corpus) return null;
  const n = corpus.nearest;

  return (
    <p className="scent-truest">
      <span className="scent-truest-label">Closest in the corpus</span>
      {corpus.nearestIsCurated ? (
        <>
          <strong>{n.name}</strong>, distance {n.distance.toFixed(3)}. It is
          already in the results above.
        </>
      ) : (
        <>
          <strong>{n.smiles}</strong>, distance {n.distance.toFixed(3)}. Closer
          than anything with a written card, and one of the{" "}
          {(corpus.corpus - 156).toLocaleString()} molecules placed by the model
          but not yet annotated.
        </>
      )}
    </p>
  );
}

/* ── an unannotated molecule ─────────────────────────────────────── */

// The reduced card. Same frame, less inside it: no occurrences, no threshold,
// no fact, because nobody has written them. Missing sections collapse rather
// than excluding the molecule from the page, which is what turns this from a
// content problem into a rendering one.
function RankedCard({ m, i }: { m: Ranked; i: number }) {
  return (
    <article className="scent-card scent-card-thin">
      <div className="scent-card-head">
        <span className="scent-card-rank">{String(i + 1).padStart(2, "0")}</span>
        <div className="scent-card-id">
          <h3>{m.name ?? m.smiles}</h3>
          <span className="scent-card-score">
            MSI {m.msi} &middot; distance {m.distance.toFixed(3)}
          </span>
        </div>
      </div>

      <SmilesStructure smiles={m.smiles} name={m.name ?? m.smiles} size={240} />

      {m.descriptors.length > 0 && (
        <ul className="scent-chips">
          {m.descriptors.map((d) => (
            <li key={d} className="scent-chip">
              {d}
            </li>
          ))}
        </ul>
      )}

      <p className="scent-card-unannotated">
        Placed by the model, not yet annotated.
      </p>
    </article>
  );
}

/* ── one molecule ────────────────────────────────────────────────── */

function MoleculeCard({
  n,
  i,
  msi,
}: {
  n: Neighbour;
  i: number;
  msi: string;
}) {
  return (
    <article className="scent-card" key={n.molecule.id}>
      <div className="scent-card-head">
        <span className="scent-card-rank">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div className="scent-card-id">
          <h3>{n.molecule.name}</h3>
          <span className="scent-card-score">
            MSI {msi}
          </span>
        </div>
      </div>
    
      <SmilesStructure
        smiles={n.molecule.smiles}
        name={n.molecule.name}
        size={240}
      />
    
      <ScentPolygon
        size={150}
        showLabels={false}
        series={[
          {
            values: moleculeFamilyVector(n.molecule.descriptors),
            color: "rgba(255,255,255,0.75)",
          },
        ]}
      />
    
      <ul className="scent-chips">
        {n.molecule.descriptors.map((d) => {
          const on = n.shared.includes(d);
          return (
            <li
              key={d}
              className={`scent-chip${on ? " scent-chip-on" : ""}`}
              style={
                on
                  ? {
                      borderColor: descriptorColor(d, 0.55),
                      color: descriptorColor(d, 1),
                    }
                  : undefined
              }
            >
              {descriptorLabel(d)}
            </li>
          );
        })}
      </ul>
    
      <div className="scent-card-where">
        <span className="scent-card-where-label">Where you meet it</span>
        <ul>
          {n.molecule.occurrences.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    
      {n.molecule.threshold && (
        <p className="scent-card-threshold">
          Detected at {n.molecule.threshold}
          {/* Nothing here was verified against a primary source during this
              project, so nothing is marked measured. Saying which is which
              beats printing them all in the same type. */}
          {thresholdProvenance(n.molecule.id) !== "measured" && (
            <span className="scent-prov">{thresholdProvenance(n.molecule.id)}</span>
          )}
        </p>
      )}
      {n.molecule.fact && (
        <p className="scent-card-fact">{n.molecule.fact}</p>
      )}
    </article>
  );
}

/* ── what MSI actually is ────────────────────────────────────────── */

// The tooltip normally opens upward. This one is tall enough, and sits high
// enough on the page, that upward can mean straight under the sticky header.
// So it measures the room it actually has and flips below when there is not
// enough. Scroll and resize both change the answer, and so does opening the
// drawer, which is what the ResizeObserver is for.

/** Sticky header height, the same clearance the survey page reserves. */
const HEADER_CLEARANCE = 96;
/** Distance the popup floats from the term, matching the CSS. */
const POP_GAP = 10;

function MsiFootnote() {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [below, setBelow] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Laid out even while hidden, since it is only transparent, so its height
    // is readable before the first hover.
    const pop = host.querySelector<HTMLElement>(".footnote-pop");
    if (!pop) return;

    const measure = () => {
      const top = host.getBoundingClientRect().top;
      const roomAbove = top - HEADER_CLEARANCE;
      const roomBelow = window.innerHeight - top;
      const needed = pop.offsetHeight + POP_GAP;
      // Only flip if below is genuinely better. Near the bottom of a short
      // window neither side fits, and upward is the nicer of two bad options.
      setBelow(needed > roomAbove && roomBelow > roomAbove);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pop);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <span ref={hostRef} className={`scent-fn${below ? " scent-fn-below" : ""}`}>
      <Footnote note={<MsiNote />}>MSI</Footnote>
    </span>
  );
}

// The popup opens on hover and has to stay small, so the definition is one
// paragraph and everything underneath is folded away. Only band 1 opens: the
// other four are the reserved half of the namespace and have nothing to say
// yet, so they read as greyed rows rather than empty drawers.
function MsiNote() {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="scent-note"
      // Hover is what shows the popup, so leaving it is the only close event
      // there is. Without this the drawer would still be open next time.
      onMouseLeave={() => setOpen(false)}
    >
      <span className="scent-note-title">Moments Sense Index</span>

      <span className="scent-note-lede">
        An absolute address for a remembered sensation. The leading digit says
        which sense; the three after it say where inside that sense. No
        reference point is needed, so the same code means the same place to
        anyone who looks it up.
      </span>

      <span className="scent-note-more">
        <span className="scent-note-more-label">Learn more</span>

        <button
          type="button"
          className={`scent-sense${open ? " scent-sense-on" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="scent-sense-n">1</span>
          <span className="scent-sense-name">{SENSES[0]}</span>
          <svg
            className="scent-sense-chev"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m5 9 7 7 7-7"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <span className="scent-sense-body">
            <span className="scent-sense-text">
              Band 1 because scent is the sense wired hardest into memory, and
              because it is the one that is built.
            </span>

            <span className="scent-note-math">
              <span>
                <em>s</em> = sense band, 1 for scent
              </span>
              <span>
                <em>x</em> = position, projected into the 24 dimensional zoning
                space
              </span>
              <span>
                <em>d</em>₁ = nearest of 10 macro centroids
              </span>
              <span>
                <em>d</em>₂ = nearest of 10 centroids inside <em>d</em>₁
              </span>
              <span>
                <em>d</em>₃ = nearest of 10 centroids inside <em>d</em>₂
              </span>
              <span>
                <em>d</em>₄ = decile along that cell&rsquo;s own axis
              </span>
              <span className="scent-note-eq">
                MSI = 10000<em>s</em> + 1000<em>d</em>₁ + 100<em>d</em>₂ +{" "}
                10<em>d</em>₃ + <em>d</em>₄
              </span>
            </span>

            <span className="scent-note-foot">
              {ZONE_COUNT.toLocaleString()} zones per sense,{" "}
              {TOTAL_ZONES.toLocaleString()} in total. The scent band is k-means
              over 5,548 molecules, and each level is sorted along its own
              dominant axis, so 1{SENSE_SEP}3460 and 1{SENSE_SEP}3470 are
              neighboring regions rather than merely consecutive numbers. The
              names come from the molecules nearest a zone, not from the broad
              region it sits in.
            </span>
          </span>
        )}

        {SENSES.slice(1).map((name, i) => (
          <span key={name} className="scent-sense scent-sense-off">
            <span className="scent-sense-n">{i + 2}</span>
            <span className="scent-sense-name">{name}</span>
          </span>
        ))}
      </span>

      <span className="scent-note-why">
        Capture the feeling, capture the Moment
      </span>
    </span>
  );
}

/* ── the far side of the map, in words ───────────────────────────── */

function InverseNote({
  words,
  onPick,
}: {
  words: Array<{ id: string; score: number }>;
  onPick: (word: string) => void;
}) {
  if (words.length === 0) return null;

  const head = descriptorLabel(words[0].id);
  const rest = words.slice(1).map((w) => descriptorLabel(w.id));

  return (
    <p className="scent-inverse">
      <span className="scent-inverse-label">Inverse</span>
      The furthest point from this memory, the region of odor space it has
      least in common with, reads as{" "}
      <button
        type="button"
        className="scent-inverse-link"
        onClick={() => onPick(head)}
        title={`Search ${head}`}
      >
        {head}
      </button>
      {rest.length > 0 && <>, with {rest.join(" and ")} underneath</>}.{" "}
      <span className="scent-inverse-note">
        Note: this is the region sitting furthest away in the embedding, not a
        smell that cancels this one out.
      </span>
    </p>
  );
}

/* ── what the thing actually is ──────────────────────────────────── */

// No skeleton here any more. The card only mounts once the whole answer is
// ready, so there is nothing to hold a place for, and the reveal below is a
// real entrance rather than a swap on top of finished content.
function IdentityCard({ identity }: { identity: Identity }) {
  return (
    <section className="scent-identity" aria-live="polite">
      <span className="scent-identity-eyebrow">What this is</span>
      <h2 className="scent-identity-label">{identity.label}</h2>
      <p className="scent-identity-summary">{identity.summary}</p>
    </section>
  );
}

/* ── the make-it section ─────────────────────────────────────────── */

function MakeIt({ result }: { result: Result }) {
  const formula = formulate(result.neighbours, 5);
  if (formula.parts.length === 0) return null;

  return (
    <section className="scent-section">
      <h2 className="scent-h2">
        <span className="scent-h2-num">04</span> Replicate
        <FindIt
          memory={result.a.text}
          msi={result.msi.label}
          region={result.msi.region}
          sub={result.msi.sub}
          neighbours={result.neighbours}
          weights={result.a.dec.weights}
        />
      </h2>

      <div className="scent-make">
        <table className="scent-formula">
          <thead>
            <tr>
              <th>Material</th>
              <th className="scent-num">Share</th>
              <th>Work at</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {formula.parts.map((p) => (
              <tr key={p.molecule.id}>
                <td>
                  <span className="scent-formula-name">{p.molecule.name}</span>
                  {p.sourcing?.caution && (
                    <span className="scent-formula-caution">{p.sourcing.caution}</span>
                  )}
                </td>
                <td className="scent-num">
                  <span className="scent-formula-pct">{p.percent}%</span>
                  <span
                    className="scent-formula-barfill"
                    style={{ width: `${p.percent}%` }}
                  />
                </td>
                <td className="scent-formula-dim">{p.sourcing?.dilution ?? "·"}</td>
                <td className="scent-formula-dim">{p.sourcing?.supplier ?? "·"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {formula.kitchen.length > 0 && (
          <div className="scent-kitchen">
            <h3>The kitchen version</h3>
            <p>
              You do not need to order anything. Put these next to each other and
 smell them together. It is a crude accord, and it works.
            </p>
            <ol>
              {formula.kitchen.map((p) => (
                <li key={p.molecule.id}>
                  <strong>{p.sourcing!.kitchen}</strong>
 <span>, for the {p.molecule.name.toLowerCase()}</span>
                </li>
              ))}
            </ol>
            {formula.kitchen.length < formula.parts.length && (
              <p className="scent-kitchen-gap">
                {formula.parts.length - formula.kitchen.length} of these have no
                honest household stand-in and are left out rather than faked.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── method footer ───────────────────────────────────────────────── */

function Method() {
  const t = EMBEDDING_META.training;
  return (
    <footer className="scent-method">
      <p>
        <strong>How this is built.</strong>{" "}
        {EMBEDDING_META.isGnn ? (
          <>
            A directed message-passing neural network (D-MPNN) trained on{" "}
            {(t.trainingMolecules ?? EMBEDDING_META.molecules).toLocaleString()}{" "}
            molecules from the GoodScents and Leffingwell archives via Pyrfume,
            across {t.labels ?? "150"} odor descriptors. Test macro-AUROC{" "}
            <strong>0.846</strong>, averaged over the 114 labels with enough
            held-out positives to score honestly. The other 36 are too rare to
            mean anything and are excluded rather than quietly averaged in. The
            classifier head was then discarded and the penultimate layer kept:
            that layer is the map.
          </>
        ) : (
          <>
            TF-IDF weighting and truncated SVD over a descriptor matrix,{" "}
            {EMBEDDING_META.k} dimensions.
          </>
        )}
      </p>
      <p>
        <strong>Does the map match human perception?</strong> Tested against
        Snitz et al.&apos;s perceptual-similarity ratings, 77 molecule pairs the
        network never saw. Embedding distance on the 48 dimensional vectors this
        page actually ships tracks human judgement at Spearman{" "}
        <strong>ρ = 0.553</strong> (permutation p = 0.0001; the model&apos;s
        native 256 dimensional output scores 0.577). The control matters
        more than the number: plain Morgan-fingerprint structural similarity, on
        the same pairs, reaches only ρ = 0.205 and does not clear significance.
        Structure does not predict percept; the learned space does.
      </p>
      <p>
        The embedding is precomputed and shipped as static JSON. Retrieval runs
        across all {EMBEDDING_META.molecules.toLocaleString()} molecules, of
        which {EMBEDDING_META.curated} have a hand-written card; the rest are
        placed by the model and marked as unannotated. Training code, the Snitz
        evaluation and the stereochemistry audit are in <code>python/</code>.
      </p>
      <p>
        <strong>What here is measured and what is asserted.</strong> The
        embedding, the zone assignments, the AUROC and the Snitz correlation are
        measured. The phrase weights in the lexicon, the descriptors on the
        added solvent molecules, and any detection threshold marked{" "}
        <em>estimated</em> or <em>literature</em> are hand-assigned by the
        author and carry no citation. They are labelled in place rather than
        left to look like results.
      </p>
    </footer>
  );
}
