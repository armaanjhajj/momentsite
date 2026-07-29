"use client";

import { useState } from "react";

/**
 * Share a link. Uses the native sheet where there is one (which is where
 * sharing actually happens, on a phone) and falls back to the clipboard.
 *
 * The href is relative because the board is rendered on the server and the
 * origin is only knowable in the browser. It gets resolved at click time.
 */
export function ShareButton({
  path,
  title,
  text,
  label = "Share",
  compact = false,
}: {
  path: string;
  title: string;
  text?: string;
  label?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // A cancelled sheet throws the same way a failed one does, so fall
        // through to the clipboard rather than trying to tell them apart.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      // Older Safari and any non-secure origin. The textarea trick still works
      // there, and silently failing to copy a link is worse than the hack.
      const box = document.createElement("textarea");
      box.value = url;
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(box);
      setState(ok ? "copied" : "failed");
    }

    window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button
      type="button"
      className={`scent-share${compact ? " scent-share-compact" : ""}${
        state === "copied" ? " scent-share-done" : ""
      }`}
      onClick={share}
      aria-label={`${label}: ${title}`}
    >
      {state === "copied" ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m4 12.5 5.5 5.5L20 7"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!compact && "Copied"}
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3v13M12 3 7.5 7.5M12 3l4.5 4.5M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!compact && (state === "failed" ? "Copy failed" : label)}
        </>
      )}
    </button>
  );
}
