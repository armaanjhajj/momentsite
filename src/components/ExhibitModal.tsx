"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ExhibitMedia = { type: "image" | "video"; src: string; alt?: string };

export type ExhibitContent = {
  title: string;
  // ReactNode so blurbs can carry inline links (e.g. ORG's "team", VIDEOS' "tiktok").
  blurb: ReactNode;
  media: ExhibitMedia[];
};

// Blurb + media gallery popup for an exhibit. Driven by the exhibits list:
// pass `content` to open, null to close. Esc / backdrop / × all dismiss back
// to the exhibits index underneath.
export function ExhibitModal({
  content,
  onClose,
}: {
  content: ExhibitContent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!content) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [content, onClose]);

  if (!content) return null;

  return createPortal(
    <div className="exhibit-modal-overlay" onClick={onClose}>
      <button
        className="exhibit-modal-close"
        onClick={onClose}
        aria-label="Back to exhibits"
      >
        &times;
      </button>

      <div className="exhibit-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="exhibit-modal-title">{content.title}</h2>
        <p className="exhibit-modal-blurb">{content.blurb}</p>

        {content.media.length > 0 && (
          <div className="exhibit-modal-media">
            {content.media.map((m, i) =>
              m.type === "video" ? (
                <video
                  key={i}
                  className="exhibit-modal-figure"
                  src={m.src}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  key={i}
                  className="exhibit-modal-figure"
                  src={m.src}
                  alt={m.alt || ""}
                  loading="lazy"
                />
              )
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
