"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Attendee = {
  id: string;
  status: string;
  group_type: string;
  user: {
    id: string;
    name: string;
    handle: string;
    photo_url: string | null;
  };
};

function ModalContent({
  eventSlug,
  eventTitle,
  onClose,
}: {
  eventSlug: string;
  eventTitle: string;
  onClose: () => void;
}) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("event_rsvps")
        .select("id, status, group_type, user:users!event_rsvps_user_id_fkey(id, name, handle, photo_url)")
        .eq("event_slug", eventSlug)
        .order("created_at", { ascending: true });
      setAttendees((data as unknown as Attendee[]) || []);
      setLoading(false);
    }
    load();
  }, [eventSlug]);

  const going = attendees.filter((a) => a.status === "going");
  const maybe = attendees.filter((a) => a.status === "maybe");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal going-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <span className="rsvp-modal-kicker">WHO&apos;S GOING</span>
        <h2 className="modal-title">{eventTitle}</h2>

        {loading && <p className="going-empty">Loading...</p>}

        {!loading && attendees.length === 0 && (
          <p className="going-empty">Be the first to RSVP.</p>
        )}

        {!loading && going.length > 0 && (
          <div className="going-section">
            <span className="going-section-label">GOING · {going.length}</span>
            <div className="going-grid">
              {going.map((a) => (
                <AttendeeCard key={a.id} attendee={a} onClose={onClose} />
              ))}
            </div>
          </div>
        )}

        {!loading && maybe.length > 0 && (
          <div className="going-section">
            <span className="going-section-label">MAYBE · {maybe.length}</span>
            <div className="going-grid">
              {maybe.map((a) => (
                <AttendeeCard key={a.id} attendee={a} onClose={onClose} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AttendeeCard({
  attendee,
  onClose,
}: {
  attendee: Attendee;
  onClose: () => void;
}) {
  const initial = attendee.user.name.charAt(0).toUpperCase();
  return (
    <Link
      href={`/${attendee.user.handle}`}
      className="attendee-card"
      onClick={onClose}
    >
      <div className="attendee-avatar">
        {attendee.user.photo_url ? (
          <img src={attendee.user.photo_url} alt={attendee.user.name} />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <span className="attendee-name">{attendee.user.name}</span>
      <span className="attendee-handle">@{attendee.user.handle}</span>
    </Link>
  );
}

export function GoingListModal({
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
