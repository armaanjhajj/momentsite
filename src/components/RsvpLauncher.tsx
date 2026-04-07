"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JoinModal } from "@/components/JoinModal";
import { RsvpModal } from "@/components/RsvpModal";

type Mode = "idle" | "join" | "rsvp";

const STORAGE_KEY = "pending-rsvp";

export function RsvpLauncher({
  eventSlug,
  eventTitle,
  className,
  children,
}: {
  eventSlug: string;
  eventTitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");

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

      // Check profile is complete
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

  async function handleClick() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Not logged in: mark intent, open join
      sessionStorage.setItem(STORAGE_KEY, eventSlug);
      setMode("join");
      return;
    }

    // Logged in: check if profile is complete
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

  return (
    <>
      <button type="button" className={className} onClick={handleClick}>
        {children}
      </button>

      <JoinModal
        open={mode === "join"}
        onClose={() => setMode("idle")}
      />

      <RsvpModal
        open={mode === "rsvp"}
        onClose={() => setMode("idle")}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
      />
    </>
  );
}
