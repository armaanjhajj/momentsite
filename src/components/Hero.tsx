'use client';

import dynamic from 'next/dynamic';
import Section from './Section';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const ThreeHero = dynamic(() => import('./ThreeHero'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Image 
        src="/fallback-hero.svg" 
        alt="Moments constellation" 
        width={800} 
        height={600}
        className="w-full h-full object-contain opacity-40"
      />
    </div>
  )
});

export default function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <Section className="pt-28 md:pt-36">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1]"
          >
            Real connection, in real time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed"
          >
            Moments helps college students discover authentic social opportunities and meet meaningfully in person—right now, where they are. We&apos;re ending campus loneliness through AI-powered proximity and spontaneous connection.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 bg-white text-black text-base font-medium hover:bg-white/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Join the Waitlist
            </Link>
            <a
              href="#learn"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 bg-white/10 text-white text-base font-medium hover:bg-white/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Learn more
            </a>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-[320px] md:h-[420px] rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        >
          {prefersReducedMotion ? (
            <Image 
              src="/fallback-hero.svg" 
              alt="Moments constellation network" 
              width={800} 
              height={600}
              className="w-full h-full object-contain opacity-40"
            />
          ) : (
            <ThreeHero />
          )}
        </motion.div>
      </div>
    </Section>
  );
}

