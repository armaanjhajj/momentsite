"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JoinModal } from "@/components/JoinModal";
import { RsvpModal } from "@/components/RsvpModal";
import { GoingListModal } from "@/components/GoingListModal";

type Mode = "idle" | "join" | "rsvp" | "going";

const STORAGE_KEY = "pending-rsvp";

export function RsvpLauncher({
  eventSlug,
  eventTitle,
}: {
  eventSlug: string;
  eventTitle: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [hasRsvpd, setHasRsvpd] = useState<boolean | null>(null);

  const checkRsvp = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setHasRsvpd(false);
      return;
    }
    const { data } = await supabase
      .from("event_rsvps")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("event_slug", eventSlug)
      .maybeSingle();
    setHasRsvpd(!!data);
  }, [eventSlug]);

  useEffect(() => {
    checkRsvp();
  }, [checkRsvp]);

  const openRsvp = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMode("rsvp");
  }, []);

  // On mount: if we have a pending RSVP flag and a session + complete profile,
  // auto-open the RSVP modal
  useEffect(() => {
    async function checkPending() {
      const pending = sessionStorage.getItem(STORAGE_KEY);
      if (pending !== eventSlug) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("name, handle, photo_url")
        .eq("id", session.user.id)
        .maybeSingle();

      if (
        profile &&
        profile.name !== "New User" &&
        !profile.handle.startsWith("user_") &&
        profile.photo_url
      ) {
        openRsvp();
      }
    }
    checkPending();
  }, [eventSlug, openRsvp]);

  async function handleRsvpClick() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      sessionStorage.setItem(STORAGE_KEY, eventSlug);
      setMode("join");
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("name, handle, photo_url")
      .eq("id", session.user.id)
      .maybeSingle();

    const profileComplete =
      profile &&
      profile.name !== "New User" &&
      !profile.handle.startsWith("user_") &&
      profile.photo_url;

    if (!profileComplete) {
      sessionStorage.setItem(STORAGE_KEY, eventSlug);
      router.push("/onboarding");
      return;
    }

    openRsvp();
  }

  function handleRsvpSubmitted() {
    setHasRsvpd(true);
  }

  // Still loading initial state — render a placeholder to prevent flicker
  if (hasRsvpd === null) {
    return (
      <div className="rsvp-launcher-row">
        <button type="button" className="rsvp-btn" disabled>
          RSVP
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="rsvp-launcher-row">
        {hasRsvpd ? (
          <>
            <div className="rsvp-confirmed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              You&apos;re going
            </div>
            <button
              type="button"
              className="rsvp-secondary-btn"
              onClick={() => setMode("going")}
            >
              See who&apos;s going
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="rsvp-btn"
              onClick={handleRsvpClick}
            >
              RSVP
            </button>
            <button
              type="button"
              className="rsvp-secondary-btn"
              onClick={() => setMode("going")}
            >
              See who&apos;s going
            </button>
          </>
        )}
      </div>

      <JoinModal
        open={mode === "join"}
        onClose={() => {
          setMode("idle");
          checkRsvp();
        }}
      />

      <RsvpModal
        open={mode === "rsvp"}
        onClose={() => setMode("idle")}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        onSubmitted={handleRsvpSubmitted}
      />

      <GoingListModal
        open={mode === "going"}
        onClose={() => setMode("idle")}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
      />
    </>
  );
}
