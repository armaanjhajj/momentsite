"use client";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface IndividualRSVP {
  id: string;
  chapterInviteCode: string;
  name: string;
  email: string;
  favoriteColor?: string;
  status: string;
  createdAt: string;
}

export default function MixerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [attendingCount, setAttendingCount] = useState(0);

  useEffect(() => {
    // Fetch RSVP count
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/mixer01/rsvp');
        if (response.ok) {
          const data: IndividualRSVP[] = await response.json();
          const count = data.filter(
            r => r.status === 'attending' || r.status === 'maybe'
          ).length;
          setAttendingCount(count);
        }
      } catch {
        // Silently fail
      }
    };

    fetchCount();
    
    // Poll every 10 seconds for updates
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Minimal header */}
      <div className="fixed inset-x-0 top-0 z-[100] backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-neutral-800">
        <header className="container flex items-center justify-between py-4 relative">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Moments" width={36} height={36} className="h-9 w-9 invert" />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-800/50 border border-neutral-800 text-sm text-white/60">
            {attendingCount}/80 attending
          </span>
        </header>
      </div>
      <div className="h-16" />
      {children}
    </>
  );
}
