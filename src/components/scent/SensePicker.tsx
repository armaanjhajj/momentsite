"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SENSES } from "@/lib/scent/senses";

/**
 * The way in. The Moments Sense Index has five bands and only one of them is
 * built, so the picker states that plainly rather than offering a single
 * button and leaving the other four to be discovered in a tooltip.
 *
 * Each row keeps its band number, because that number is the leading digit of
 * every code the band will ever issue.
 */
export function SensePicker() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    // The only live row takes focus, so the keyboard path is one key long.
    first.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="scent-btn scent-btn-solid"
        onClick={() => setOpen(true)}
      >
        Describe a memory
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
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
              className="scent-findit-modal sense-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Choose a sense"
            >
              <button
                className="scent-findit-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>

              <p className="scent-findit-eyebrow">Moments Sense Index</p>
              <h3 className="scent-findit-title">SENSATION SELECTION</h3>

              <div className="sense-list">
                {SENSES.map((name, i) => {
                  const live = i === 0;
                  return live ? (
                    <button
                      key={name}
                      ref={first}
                      type="button"
                      className="sense-row sense-row-live"
                      onClick={() => router.push("/scent")}
                    >
                      <span className="sense-n">{i + 1}</span>
                      <span className="sense-name">{name}</span>
                      <span className="sense-go">
                        Describe
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M5 12h14M13 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <span key={name} className="sense-row" aria-disabled="true">
                      <span className="sense-n">{i + 1}</span>
                      <span className="sense-name">{name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
