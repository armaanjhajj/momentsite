'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { easeOutQuad } from '@/lib/utils';

interface CounterProps {
  target: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export default function Counter({ target, label, suffix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      setCount(Math.floor(target * easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm md:text-base text-white/60 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

