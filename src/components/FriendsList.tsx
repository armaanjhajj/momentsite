"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const FRIENDS = [
  "Ajit",
  "Val",
  "Amy",
  "Nidhi",
  "Aydin",
  "Dhruv",
  "Esha",
  "Kaushi",
  "Siya",
  "Maggie",
  "Shruthi",
  "Jasmine",
  "Nila",
  "Julia",
  "Katelyn",
  "Anish",
  "David",
  "Meet",
  "Shivani",
];

export function FriendsList() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal = open && mounted && (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div
        className="modal friends-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <span className="friends-modal-title">The Goats</span>
        <div className="friends-modal-grid">
          {FRIENDS.map((name) => (
            <span key={name} className="friends-modal-name">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="about-link friends-trigger"
        onClick={() => setOpen(true)}
      >
        friends
      </button>
      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}
