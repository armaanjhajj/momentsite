"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { track } from "@vercel/analytics";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "moments-waitlist-joined";

// Always shown below the waitlist — the "build it with us" path.
function TeamSection({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="modal-divider" />
      <div className="modal-team">
        <p className="modal-team-label">Want to help build it?</p>
        <p className="modal-team-text">
          <Link
            href="/apply"
            className="modal-team-link"
            onClick={() => {
              track("apply_click", { from: "waitlist_modal" });
              onClose();
            }}
          >
            Apply
          </Link>{" "}
          to join the Moments team.
        </p>
      </div>
    </>
  );
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
      setSubmitted(true);
    }
  }, []);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError("");

    const { error: insertError } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    setSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505") {
        localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
        setSubmitted(true);
        return;
      }
      setError(insertError.message);
      return;
    }

    localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
    track("waitlist_join");
    setSubmitted(true);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal-logo">
          <Logo color="white" size={36} strokeWidth={18} />
        </div>

        {submitted ? (
          <div className="modal-success">
            <h2 className="modal-title">You&apos;re already on the waitlist</h2>
            <p
              className="modal-subtitle"
              style={{ fontSize: 14, fontWeight: 400 }}
            >
              We&apos;ll email you when it&apos;s time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <h2 className="modal-title">Make Moments</h2>
            <p className="modal-subtitle">Join the Waitlist</p>

            <label className="phone-label">Email</label>
            <input
              type="email"
              className="waitlist-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />

            {error && <p className="modal-error">{error}</p>}

            <button
              type="submit"
              className="modal-submit"
              disabled={!isValid || submitting}
            >
              {submitting ? "JOINING..." : "JOIN"}
            </button>

            <p className="modal-legal">
              By joining, you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </form>
        )}

        <TeamSection onClose={onClose} />
      </div>
    </div>
  );
}

export function WaitlistModal({
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

  return createPortal(<ModalContent onClose={onClose} />, document.body);
}
