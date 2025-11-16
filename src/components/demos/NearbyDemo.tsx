"use client";
// NearbyDemo.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_MATCHES = [
  { id: 1, name: 'Alex', interests: ['Ken Carson', 'Raves'], distance: '120 ft' },
  { id: 2, name: 'Maya', interests: ['Econ 301', 'Coffee'], distance: '240 ft' },
];

export function NearbyDemo() {
  const [visible, setVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true);
      setIndex((i) => (i + 1) % MOCK_MATCHES.length);
      const timeout = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timeout);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = MOCK_MATCHES[index];

  return (
    <div className="relative h-[360px] bg-[#0f1216] rounded-2xl border border-neutral-800 p-3">
      <motion.div
        className="absolute left-6 bottom-6 h-3 w-3 rounded-full bg-[var(--accent)]"
        animate={{ scale: [1, 1.6, 1] , opacity: [0.9, 0.2, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence>
        {visible && !connected && (
          <motion.div
            key={current.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="absolute inset-x-3 top-3 rounded-xl bg-black/60 border border-neutral-800 p-4 text-white"
          >
            <div className="text-xs uppercase tracking-wide text-white/60 mb-1">Nearby connection</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{current.name} • {current.distance}</div>
                <div className="text-white/70 text-sm">Shared: {current.interests.join(', ')}</div>
              </div>
              <button
                className="rounded-full px-3 py-2 bg-white text-black text-sm border border-transparent hover:bg-transparent hover:text-white hover:border-[var(--accent)] transition"
                onClick={() => {
                  setConnected(true);
                  setTimeout(() => setConnected(false), 1600);
                }}
              >
                Connect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {connected && (
          <motion.div
            key="confetti"
            className="absolute inset-0 flex items-center justify-center text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-sm bg-black/60 border border-neutral-800 rounded-full px-3 py-1">Connected 🎉</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
