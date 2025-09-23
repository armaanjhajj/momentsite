"use client";
// FeedDemo.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POSTS = [
  { id: 1, text: 'Free pizza at the student center rn 🍕', reactions: 3 },
  { id: 2, text: 'Who’s down for a 7pm study group in BUS 220?', reactions: 5 },
  { id: 3, text: 'Open mic tonight — bring your friends 🎤', reactions: 2 },
];

export function FeedDemo() {
  const [index, setIndex] = React.useState(0);
  const [reactions, setReactions] = React.useState(POSTS.map(p => p.reactions));

  React.useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % POSTS.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const current = POSTS[index];

  return (
    <div className="relative h-[360px] bg-[#0f1216] rounded-2xl border border-white/10 p-3 text-white">
      <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Community feed</div>
      <div className="relative h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-black/60 border border-white/10 p-4"
          >
            <div className="text-white/90">{current.text}</div>
            <button
              className="mt-3 rounded-full px-3 py-1.5 bg-white text-black text-sm border border-transparent hover:bg-transparent hover:text-white hover:border-[var(--accent)] transition"
              onClick={() => setReactions((arr) => arr.map((n, i) => (POSTS[i].id === current.id ? n + 1 : n)))}
            >
              ❤️ {reactions[index]}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
