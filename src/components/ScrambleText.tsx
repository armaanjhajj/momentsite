"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/\\[]{}=+*^?#%";

function randGlyph() {
  return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
}

/**
 * Hacker-style decode text. By default every character is constantly scrambling.
 * When `active` (hovered), characters lock to the real word one at a time, left
 * to right. When `active` goes false again, they fall back into the scramble one
 * at a time, left to right. Falls back to static text under reduced motion.
 */
export function ScrambleText({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const n = text.length;
    // locked[i] === true -> char i shows its real letter; false -> scrambling.
    const locked = new Array<boolean>(n).fill(false);
    const SWEEP_EVERY = 2; // advance the lock/unlock front every N frames (~90ms)
    let frame = 0;

    const id = window.setInterval(() => {
      frame += 1;

      // Move the reveal front one character per sweep, left to right.
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
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        out += ch === " " || locked[i] ? ch : randGlyph();
      }
      setDisplay(out);
    }, 45);

    return () => window.clearInterval(id);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
