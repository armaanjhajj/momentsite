"use client";
// DeviceFrame.tsx
import React from 'react';
import { motion } from 'framer-motion';

export type DeviceFrameVariant = 'iphone-16-pro';

interface DeviceFrameProps {
  variant?: DeviceFrameVariant;
  children: React.ReactNode;
}

export function DeviceFrame({ variant = 'iphone-16-pro', children }: DeviceFrameProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 rounded-[44px] shadow-[0_30px_80px_rgba(0,0,0,0.6)]" />
      <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[360px] rounded-[44px] bg-black overflow-hidden border border-white/10">
        <div className="absolute inset-0 rounded-[44px] ring-1 ring-white/10" />
        <div className="absolute left-1/2 top-3 -translate-x-1/2 h-6 w-32 rounded-full bg-black/90 border border-white/10 shadow-[inset_0_0_8px_rgba(255,255,255,0.06)]" />
        <div className="absolute top-2 left-0 right-0 px-4 flex items-center justify-between text-[11px] text-white/80">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span>▰▰▰</span>
            <span>Wi‑Fi</span>
            <span>100%</span>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 top-8 bottom-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: 'touch' }}
          initial={{ opacity: 0.8, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="p-3">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
