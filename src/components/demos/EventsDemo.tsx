"use client";
// EventsDemo.tsx
import React from 'react';
import { motion } from 'framer-motion';

export function EventsDemo() {
  const [created, setCreated] = React.useState(false);
  const [rsvps, setRsvps] = React.useState(2);
  const [going, setGoing] = React.useState(false);

  return (
    <div className="relative h-[360px] bg-[#0f1216] rounded-2xl border border-white/10 p-3 text-white">
      {!created ? (
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-white/60 mb-1">Create event</div>
          <input className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm" placeholder="Study session @ Library" />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm" placeholder="Today 5:45 PM" />
            <input className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm" placeholder="Business Building" />
          </div>
          <button className="rounded-full px-3 py-2 bg-white text-black text-sm border border-transparent hover:bg-transparent hover:text-white hover:border-[var(--accent)] transition" onClick={() => setCreated(true)}>Preview</button>
        </div>
      ) : (
        <div>
          <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Event</div>
          <div className="rounded-xl bg-black/60 border border-white/10 p-4">
            <div className="font-semibold">Study session @ Library</div>
            <div className="text-white/70 text-sm">Today • Business Building</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(rsvps)].map((_, i) => (
                  <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-6 w-6 rounded-full bg-white/80 border border-black" />
                ))}
              </div>
              <div className="text-white/70 text-sm">{rsvps} going</div>
            </div>
            <button
              className={`mt-3 rounded-full px-3 py-2 text-sm transition ${going ? 'bg-transparent border border-[var(--accent)] text-white' : 'bg-white text-black border border-transparent'}`}
              onClick={() => {
                setGoing((g) => !g);
                setRsvps((n) => (going ? Math.max(0, n - 1) : n + 1));
              }}
            >
              {going ? 'Cancel RSVP' : 'RSVP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
