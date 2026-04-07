"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { TastePicker, TasteItem } from "@/components/TastePicker";

type Step = "status" | "group" | "songs" | "done";

function ModalContent({
  eventSlug,
  eventTitle,
  onClose,
}: {
  eventSlug: string;
  eventTitle: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("status");
  const [status, setStatus] = useState<"going" | "maybe" | null>(null);
  const [groupType, setGroupType] = useState<"solo" | "group" | null>(null);
  const [songs, setSongs] = useState<TasteItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSaving(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Not signed in");
      setSaving(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from("event_rsvps")
      .upsert(
        {
          user_id: session.user.id,
          event_slug: eventSlug,
          status,
          group_type: groupType,
          song_requests: songs.map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            cover: s.cover,
          })),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,event_slug" }
      );

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setStep("done");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal rsvp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {step !== "done" && (
          <>
            <span className="rsvp-modal-kicker">RSVP</span>
            <h2 className="modal-title">{eventTitle}</h2>
          </>
        )}

        {step === "status" && (
          <>
            <p className="rsvp-modal-question">Are you coming?</p>
            <div className="rsvp-choice-row">
              <button
                type="button"
                className={`rsvp-choice ${status === "going" ? "selected" : ""}`}
                onClick={() => setStatus("going")}
              >
                Going
              </button>
              <button
                type="button"
                className={`rsvp-choice ${status === "maybe" ? "selected" : ""}`}
                onClick={() => setStatus("maybe")}
              >
                Maybe
              </button>
            </div>
            <button
              className="modal-submit"
              disabled={!status}
              onClick={() => setStep("group")}
            >
              CONTINUE
            </button>
          </>
        )}

        {step === "group" && (
          <>
            <p className="rsvp-modal-question">Coming solo or with a group?</p>
            <div className="rsvp-choice-row">
              <button
                type="button"
                className={`rsvp-choice ${groupType === "solo" ? "selected" : ""}`}
                onClick={() => setGroupType("solo")}
              >
                Solo
              </button>
              <button
                type="button"
                className={`rsvp-choice ${groupType === "group" ? "selected" : ""}`}
                onClick={() => setGroupType("group")}
              >
                Group
              </button>
            </div>
            <button
              className="modal-submit"
              disabled={!groupType}
              onClick={() => setStep("songs")}
            >
              CONTINUE
            </button>
            <button
              type="button"
              className="onboarding-back"
              onClick={() => setStep("status")}
            >
              Back
            </button>
          </>
        )}

        {step === "songs" && (
          <>
            <p className="rsvp-modal-question">Any song requests?</p>
            <p className="rsvp-modal-helper">Optional. Pick up to 5.</p>
            <div className="rsvp-songs-wrap">
              <TastePicker
                category="music"
                items={songs}
                onChange={setSongs}
                maxItems={5}
              />
            </div>
            {error && <p className="modal-error">{error}</p>}
            <button
              className="modal-submit"
              disabled={saving}
              onClick={submit}
            >
              {saving ? "SUBMITTING..." : "SUBMIT RSVP"}
            </button>
            <button
              type="button"
              className="onboarding-back"
              onClick={() => setStep("group")}
              disabled={saving}
            >
              Back
            </button>
          </>
        )}

        {step === "done" && (
          <div className="rsvp-done">
            <h2 className="rsvp-done-title">You&apos;re on the list</h2>
            <p className="rsvp-done-sub">See you at {eventTitle}.</p>
            <button
              type="button"
              className="modal-submit rsvp-done-btn"
              onClick={onClose}
            >
              DONE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function RsvpModal({
  open,
  onClose,
  eventSlug,
  eventTitle,
}: {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
  eventTitle: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <ModalContent
      eventSlug={eventSlug}
      eventTitle={eventTitle}
      onClose={onClose}
    />,
    document.body
  );
}
