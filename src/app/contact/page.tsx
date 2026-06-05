"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { TeamGrid } from "@/components/TeamGrid";

const CONTACT_EMAIL = "team@havemoments.com";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/letsmakemoments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@letsmakemoments",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-3.77-1.26V6.69h3.77z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/letsmakemoments",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function TeamModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      <div className="modal team-popup" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <span className="team-popup-title">The Collective</span>
        <TeamGrid />
      </div>
    </div>,
    document.body
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [teamOpen, setTeamOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();

  // Phone OR email required — whichever is filled, the other is optional.
  const hasContact = trimmedEmail.length > 0 || trimmedPhone.length > 0;
  const emailOk = trimmedEmail.length === 0 || EMAIL_RE.test(trimmedEmail);
  const phoneOk =
    trimmedPhone.length === 0 || trimmedPhone.replace(/\D/g, "").length >= 7;

  const canSubmit =
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    hasContact &&
    emailOk &&
    phoneOk;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please add your name.");
    if (!hasContact)
      return setError("Add an email or a phone number so we can reach you.");
    if (!emailOk) return setError("That email doesn't look right.");
    if (!phoneOk) return setError("That phone number doesn't look right.");
    if (!message.trim()) return setError("Tell us what's on your mind.");

    setSubmitting(true);
    const { error: insertError } = await supabase.from("inquiries").insert({
      name: name.trim(),
      email: trimmedEmail ? trimmedEmail.toLowerCase() : null,
      phone: trimmedPhone || null,
      message: message.trim(),
    });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="contact-page">
      <header className="contact-head">
        <p className="contact-eyebrow"></p>
        <h1 className="contact-title">CONTACT</h1>
        <p className="contact-sub">
          GIVE US A SHOUT :) Send us your Ideas, collabs, questions, or even just a hello!
        </p>
      </header>

      <div className="contact-grid">
        {/* Left — reach us */}
        <div className="contact-left">
          <div className="contact-block">
            <span className="contact-block-label">PLATFORMS</span>
            <div className="contact-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="contact-social"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="contact-block">
            <span className="contact-block-label">EMAIL</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="contact-block">
            <span className="contact-block-label">THE PEOPLE BEHIND IT</span>
            <button
              className="contact-team-btn"
              onClick={() => setTeamOpen(true)}
            >
              Meet the team
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right — inquiry box */}
        <div className="contact-right">
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success-mark">✓</span>
              <h2 className="contact-success-title">Message sent.</h2>
              <p className="contact-success-sub">
                Thanks for reaching out. We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2 className="contact-form-title">Send an inquiry</h2>

              <div className="contact-field">
                <label className="contact-label" htmlFor="c-name">
                  Name
                </label>
                <input
                  id="c-name"
                  className="contact-input"
                  type="text"
                  placeholder="preferred name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="contact-field-row">
                <div className="contact-field">
                  <label className="contact-label" htmlFor="c-email">
                    Email <span className="contact-opt"></span>
                  </label>
                  <input
                    id="c-email"
                    className="contact-input"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-label" htmlFor="c-phone">
                    Phone <span className="contact-opt"></span>
                  </label>
                  <input
                    id="c-phone"
                    className="contact-input"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <p className="contact-hint">
                Fill in at least one, email or phone.
              </p>

              <div className="contact-field">
                <label className="contact-label" htmlFor="c-message">
                  Message
                </label>
                <textarea
                  id="c-message"
                  className="contact-input contact-textarea"
                  placeholder="talk to us!"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {error && <p className="contact-error">{error}</p>}

              <button
                type="submit"
                className="contact-submit"
                disabled={!canSubmit || submitting}
              >
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>

      <TeamModal open={teamOpen} onClose={() => setTeamOpen(false)} />
    </div>
  );
}
