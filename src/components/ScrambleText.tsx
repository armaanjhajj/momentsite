"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/\\[]{}=+*^?#%";

function randGlyph() {
  return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
}

/**
 * Hacker-style decode text. By default every character is constantly scrambling.
 * When `active`, characters lock to the real word one at a time, left to right;
 * when `active` goes false they fall back into the scramble, left to right.
 * `onResolved` fires once each time the word becomes fully decoded while active
 * (used to navigate after the reveal on touch devices). Static under reduced motion.
 */
export function ScrambleText({
  text,
  active,
  onResolved,
  className,
}: {
  text: string;
  active: boolean;
  onResolved?: () => void;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const activeRef = useRef(active);
  activeRef.current = active;
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const n = text.length;
    // Spaces start locked so they never scramble and don't block completion.
    const locked = Array.from({ length: n }, (_, i) => text[i] === " ");
    const SWEEP_EVERY = 2; // advance the lock/unlock front every N frames (~90ms)
    let frame = 0;
    let fired = false;

    const id = window.setInterval(() => {
      frame += 1;

      if (frame % SWEEP_EVERY === 0) {
        if (activeRef.current) {
          const next = locked.indexOf(false); // leftmost still-scrambling -> lock
          if (next !== -1) locked[next] = true;
        } else {
          const next = locked.indexOf(true); // leftmost locked -> release
          if (next !== -1) locked[next] = false;
        }
      }

      let out = "";
      let allLocked = true;
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        if (ch === " " || locked[i]) {
          out += ch;
        } else {
          out += randGlyph();
          allLocked = false;
        }
      }
      setDisplay(out);

      if (activeRef.current) {
        if (allLocked && !fired) {
          fired = true;
          onResolvedRef.current?.();
        }
      } else {
        fired = false;
      }
    }, 45);

    return () => window.clearInterval(id);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
