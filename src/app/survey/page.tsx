"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { track } from "@vercel/analytics";
import { supabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="survey-demo-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <iframe
          src="/moments-demo.html"
          title="MOMENTS interactive demo"
          className="survey-modal-iframe"
        />
      </div>
    </div>,
    document.body
  );
}

const FIND_PEOPLE = [
  { value: "group_chat", label: "Group chat" },
  { value: "text_one", label: "Text one person" },
  { value: "show_up", label: "Show up somewhere" },
  { value: "dont", label: "Don't" },
];

const OPENNESS = [
  { value: "always", label: "Always down" },
  { value: "mutuals", label: "If we have mutuals" },
  { value: "close_friends", label: "Only through close friends" },
  { value: "not_really", label: "Not really" },
];

const GO_SCALE = [1, 2, 3, 4, 5];

export default function Survey() {
  const [findPeople, setFindPeople] = useState("");
  const [openness, setOpenness] = useState("");
  const [wouldGo, setWouldGo] = useState<number | null>(null);
  const [spot, setSpot] = useState("");
  const [email, setEmail] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const trimmedEmail = email.trim();
  const emailOk = trimmedEmail.length === 0 || EMAIL_RE.test(trimmedEmail);
  const canSubmit =
    findPeople.length > 0 && wouldGo !== null && emailOk;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!findPeople) return setError("Pick how you usually find people.");
    if (wouldGo === null) return setError("Answer the invite one first.");
    if (!emailOk) return setError("That email doesn't look right.");

    setSubmitting(true);
    const { error: insertError } = await supabase
      .from("survey_responses")
      .insert({
        find_people: findPeople,
        openness: openness || null,
        would_go: wouldGo,
        spot: spot.trim() || null,
        email: trimmedEmail ? trimmedEmail.toLowerCase() : null,
      });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    track("survey_submit");
    setSubmitted(true);
  }

  return (
    <div className="survey-page">
      <header className="survey-head">
        <h1 className="survey-title">SURVEY</h1>
      </header>

      <div className="survey-grid">
        {/* Left — the demo. Inline + sticky on desktop, popup on mobile. */}
        <div className="survey-demo">
          <div className="survey-demo-frame">
            <iframe
              src="/moments-demo.html"
              title="MOMENTS interactive demo"
              className="survey-iframe"
              loading="lazy"
            />
          </div>
          <button
            type="button"
            className="survey-demo-toggle"
            onClick={() => setDemoOpen(true)}
          >
            <span>Watch the demo</span>
            <svg
              className="survey-demo-chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="7 5 19 12 7 19" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>

        {/* Right — the survey */}
        <div className="survey-right">
          {submitted ? (
            <div className="survey-success">
              <span className="survey-success-mark">✓</span>
              <h2 className="survey-success-title">Got it.</h2>
              <p className="survey-success-sub">
                Thanks for the feedback
              </p>
            </div>
          ) : (
            <form className="survey-form" onSubmit={handleSubmit}>
              <h2 className="survey-form-title">A few questions</h2>

              {/* Q1 — find people */}
              <div className="survey-field">
                <label className="survey-label">
                  1. How do you usually find people to hang out with?{" "}
                  <span className="survey-req">*</span>
                </label>
                <div className="survey-pills">
                  {FIND_PEOPLE.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`survey-pill ${
                        findPeople === o.value ? "sel" : ""
                      }`}
                      onClick={() => setFindPeople(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 — openness */}
              <div className="survey-field">
                <label className="survey-label">
                  2. How open are you to meeting new people?
                </label>
                <div className="survey-pills">
                  {OPENNESS.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`survey-pill ${
                        openness === o.value ? "sel" : ""
                      }`}
                      onClick={() => setOpenness(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 — would you go (1-5) */}
              <div className="survey-field">
                <label className="survey-label">
                  3. Free afternoon, someone new invites you to try something.
                  You go? <span className="survey-req">*</span>
                </label>
                <div className="survey-segment survey-segment-rating">
                  {GO_SCALE.map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={`survey-seg ${wouldGo === n ? "sel" : ""}`}
                      onClick={() => setWouldGo(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="survey-scale">
                  <span>No chance</span>
                  <span>Already there</span>
                </div>
              </div>

              {/* Q4 — the spot */}
              <div className="survey-field">
                <label className="survey-label" htmlFor="s-spot">
                  4. What&apos;s your &ldquo;I know a spot&rdquo; spot?
                </label>
                <textarea
                  id="s-spot"
                  className="survey-input survey-textarea"
                  placeholder="the go-to you'd pull someone to"
                  rows={2}
                  value={spot}
                  onChange={(e) => setSpot(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="survey-field">
                <label className="survey-label" htmlFor="s-email">
                  Email <span className="survey-opt">— optional</span>
                </label>
                <input
                  id="s-email"
                  className="survey-input"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="survey-hint">Only if you want us to follow up.</p>
              </div>

              {error && <p className="survey-error">{error}</p>}

              <button
                type="submit"
                className="survey-submit"
                disabled={!canSubmit || submitting}
              >
                {submitting ? "Sending…" : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
