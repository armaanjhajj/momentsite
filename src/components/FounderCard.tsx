"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Founder } from "@/lib/founders";

export function FounderCard({ founder }: { founder: Founder }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal = open && (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div
        className="modal founder-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          &times;
        </button>

        <img src={founder.image} alt={founder.name} className="founder-modal-img" />
        <h2 className="founder-modal-name">{founder.name}</h2>
        <span className="founder-modal-major">{founder.major}</span>
        <p className="founder-modal-role">{founder.role}</p>

        <div className="founder-modal-fact">
          <span className="founder-modal-fact-label">{founder.factLabel}</span>
          <a
            href={founder.factHref}
            target="_blank"
            rel="noopener noreferrer"
            className="founder-modal-fact-link"
          >
            {founder.factValue}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="founder-name-btn"
        onClick={() => setOpen(true)}
      >
        {founder.name}
      </button>
      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}

