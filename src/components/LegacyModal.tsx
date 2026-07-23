"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// The legacy F25 cohort — shown on the team page and linked from the ORG
// exhibit. zIndex is elevated so it can stack above the exhibit modal (z 200).
const LEGACY = [
  "Ajit", "Amy", "Nidhi", "Aydin", "Dhruv", "Esha",
  "Kaushi", "Siya", "Maggie", "Shruthi", "Jasmine", "Nila",
  "Julia", "Katelyn", "Anish", "David", "Meet", "Shivani",
];

export function LegacyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="modal-overlay" style={{ zIndex: 300 }} onClick={onClose}>
      <div className="modal friends-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <span className="friends-modal-title">Legacy</span>
        <div className="friends-modal-grid">
          {LEGACY.map((name) => (
            <span key={name} className="friends-modal-name">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
