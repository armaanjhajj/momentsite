"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "survey_popup_dismissed_v1";

export default function SurveyPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <button
        aria-label="Close survey dialog"
        onClick={dismiss}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.18em] text-white/60">Quick survey</div>
            <h3 className="mt-1 text-lg md:text-xl font-medium">Help shape Moments at your campus</h3>
            <p className="mt-2 text-sm text-white/80">
              Take 6–7 minutes to share how you make friends and where you get stuck. Your input directly informs what we build next.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <Link
            href="/survey"
            className="inline-flex flex-1 items-center justify-center px-4 py-2 md:px-5 md:py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors focus-accent"
            onClick={dismiss}
          >
            Take the survey
          </Link>
          <button
            onClick={dismiss}
            className="px-4 py-2 text-sm text-white/80 hover:text-white rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}


