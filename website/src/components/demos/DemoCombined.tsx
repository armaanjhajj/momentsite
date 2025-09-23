"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoCombined() {
  return (
    <div className="p-3">
      <div className="relative space-y-3 max-w-[380px] mx-auto">
        <NearbyCard />
        <EventsCard />
        <FeedCard />
      </div>
    </div>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-white">
      <div className="text-xs uppercase tracking-wide text-white/60 mb-2">{title}</div>
      {children}
    </div>
  );
}

function NearbyCard() {
  const [pulse, setPulse] = React.useState(true);
  React.useEffect(() => {
    const i = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(i);
  }, []);
  return (
    <Shell title="Nearby connections">
      <div className="relative h-[140px]">
        <motion.div className="absolute left-4 bottom-4 h-3 w-3 rounded-full bg-[var(--accent)]" animate={{ scale: pulse ? 1.4 : 1, opacity: pulse ? 0.4 : 0.9 }} transition={{ duration: 0.6 }} />
        <div className="absolute inset-x-0 top-0 px-2">
          <div className="rounded-xl bg-white text-black p-3 shadow">
            <div className="text-[13px] font-semibold">Alex • 120 ft</div>
            <div className="text-[12px] text-black/70">Shared: Ken Carson, Raves</div>
            <button className="mt-2 rounded-full px-3 py-1.5 text-sm bg-black text-white border border-transparent hover:bg-transparent hover:text-white hover:border-[var(--accent)] transition">Connect</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function EventsCard() {
  const [going, setGoing] = React.useState(false);
  const [count, setCount] = React.useState(2);
  return (
    <Shell title="Event">
      <div className="rounded-xl border border-white/10 p-3">
        <div className="font-semibold">Study session @ Library</div>
        <div className="text-white/70 text-sm">Today • Business Building</div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="h-6 w-6 rounded-full bg-white/80 border border-black" />
            ))}
          </div>
          <div className="text-white/70 text-sm">{count} going</div>
        </div>
        <button className={`mt-3 rounded-full px-3 py-1.5 text-sm transition ${going ? 'bg-transparent border border-[var(--accent)]' : 'bg-white text-black border border-transparent'}`} onClick={() => { setGoing((g)=>!g); setCount((c)=> going? Math.max(0,c-1): c+1);}}>
          {going ? 'Cancel RSVP' : 'RSVP'}
        </button>
      </div>
    </Shell>
  );
}

function FeedCard() {
  const posts = [
    'Free pizza at the student center rn 🍕',
    '7pm study group in BUS 220?',
    'Open mic tonight — bring friends 🎤',
  ];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % posts.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <Shell title="Community feed">
      <div className="rounded-xl border border-white/10 p-3 min-h-[80px]">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-white/90">
            {posts[i]}
          </motion.div>
        </AnimatePresence>
      </div>
    </Shell>
  );
}


