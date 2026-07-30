"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Msi } from "@/lib/scent/msi";
import type { ScentPost } from "@/lib/scent/board";

const MEMORY_MAX = 200;
const DESC_MAX = 600;

/**
 * Share a memory to its zone. Laid out like an email: the address it is going
 * to, then a subject line, then the body. Nothing else, because everything
 * else about the post is computed and stating it here would only be noise.
 *
 * The memory line is editable. The coordinates are not recomputed from it:
 * they come from the search that produced this result, which is the thing the
 * model and the lexicon actually read.
 */
export function ShareMemory({
  query,
  msi,
  weights,
}: {
  query: string;
  msi: Msi;
  weights: Record<string, number>;
}) {
  const [memory, setMemory] = useState(query);
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState<ScentPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A new search is a new memory. Reset rather than carry the last one over.
  useEffect(() => {
    setMemory(query);
    setDescription("");
    setPosted(null);
    setError(null);
  }, [query]);

  const submit = async () => {
    const subject = memory.trim();
    const body = description.trim();
    if (body.length < 2 || subject.length < 1 || posting) return;

    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/scent/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ memory: body, query: subject, weights }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.post) {
        setError(data?.error ?? "Could not share that.");
        return;
      }

      setPosted(data.post as ScentPost);
    } catch {
      setError("Could not reach the board.");
    } finally {
      setPosting(false);
    }
  };

  if (posted) {
    return (
      <div className="scent-share-box scent-share-sent">
        <span className="scent-share-tick" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="m4 12.5 5.5 5.5L20 7"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p>
          Shared as <strong>{msi.label}</strong>.
        </p>
        <Link href="/board" className="scent-btn">
          See the board
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 17 17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="scent-share-box">
      <div className="scent-field scent-field-msi">
        <label htmlFor="scent-msi-field">MSI</label>
        <span id="scent-msi-field" className="scent-field-msi-value">
          {msi.label}
          <span>{msi.sub}</span>
          <Link href="/board" className="scent-field-link">
            Board
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17 17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </span>
      </div>

      <div className="scent-field">
        <label htmlFor="scent-memory-line">Memory</label>
        <input
          id="scent-memory-line"
          type="text"
          value={memory}
          maxLength={MEMORY_MAX}
          onChange={(e) => setMemory(e.target.value)}
          autoComplete="off"
          spellCheck
        />
      </div>

      <div className="scent-field scent-field-body">
        <label htmlFor="scent-description">Description</label>
        <textarea
          id="scent-description"
          value={description}
          maxLength={DESC_MAX}
          rows={3}
          placeholder="What this memory means to you."
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void submit();
          }}
        />
      </div>

      <div className="scent-share-foot">
        {error && <p className="scent-share-error">{error}</p>}
        <button
          type="button"
          className="scent-btn scent-btn-solid"
          onClick={() => void submit()}
          disabled={description.trim().length < 2 || !memory.trim() || posting}
        >
          {posting ? "Sharing" : "Share"}
        </button>
      </div>
    </div>
  );
}
