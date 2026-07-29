"use client";

import { useEffect, useRef, useState } from "react";
import type { Msi } from "@/lib/scent/msi";
import { nearestPosts, POSTED_EVENT, type ScentPost } from "@/lib/scent/board";
import { PostCard } from "./PostCard";

/**
 * Similar memories, ordered by position in the space rather than by time.
 *
 * Renders nothing at all until there is something to show. An empty state here
 * would be a box explaining its own emptiness directly under the MSI number,
 * which is worse than the section simply not existing yet.
 */
export function NearestMemories({ vec, msi }: { vec: number[]; msi: Msi }) {
  const [near, setNear] = useState<ScentPost[]>([]);

  // Guards against a slow response for a previous memory landing after a
  // newer one has already been drawn.
  const runId = useRef(0);

  useEffect(() => {
    const id = ++runId.current;
    setNear([]);
    void nearestPosts(vec, 8).then((posts) => {
      if (runId.current === id) setNear(posts);
    });
  }, [vec, msi.code]);

  // Something shared from the box above belongs at the top of this list at
  // once, and seeing it arrive is the confirmation that it was filed.
  useEffect(() => {
    const onPosted = (e: Event) => {
      const post = (e as CustomEvent<ScentPost>).detail;
      if (post) setNear((list) => [post, ...list]);
    };
    window.addEventListener(POSTED_EVENT, onPosted);
    return () => window.removeEventListener(POSTED_EVENT, onPosted);
  }, []);

  if (near.length === 0) return null;

  return (
    <div className="scent-near">
      <h3 className="scent-near-title">Similar memories</h3>
      <div className="scent-near-list">
        {near.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} />
        ))}
      </div>
    </div>
  );
}
