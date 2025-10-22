"use client";
import Script from "next/script";

export default function Waitlist() {
  return (
    <main className="container py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">Join the Moments Waitlist</h1>
        <p className="mt-4 text-white/80 text-lg">
          Moments is launching exclusively at Rutgers in October 2025 — live on the App Store (probably)before Halloween or first week of November (LATEST).
          Waitlist members get the earliest access, a personal referral code, and the chance to bring friends in first.
          We’ll open to the public shortly after. Join the waitlist and get excited.
        </p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <div className="launchlist-widget" data-key-id="PS7heZ" data-height="180px" />
        </div>
      </div>
      <Script src="https://getlaunchlist.com/js/widget.js" defer />
    </main>
  );
}


