import Link from "next/link";

export default function TreePage() {
  return (
    <main>
      <section className="container pt-10 md:pt-16 pb-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="Moments" className="h-14 w-14 invert" />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-semibold">All pertinent links</h1>
          <p className="mt-2 text-white/70">Quick access to everything Moments.</p>

          <div className="mt-8 grid gap-4">
            {/* Hero Survey CTA */}
            <Link
              href="/survey"
              className="relative block rounded-2xl border border-neutral-800 bg-white text-black px-5 py-4 md:px-6 md:py-5 text-base md:text-lg font-medium hover:bg-white/90 transition-colors focus-accent"
            >
              <span className="relative z-10">Take the 2–3 min survey</span>
              <span className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-white/40 blur-2xl opacity-40" />
            </Link>

            {/* Main website */}
            <a
              href="https://havemoments.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur px-5 py-4 md:px-6 md:py-5 text-base md:text-lg hover:bg-white/10 transition-colors text-white/90"
            >
              havemoments.com
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/letsmakemoments"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur px-5 py-4 md:px-6 md:py-5 text-base md:text-lg hover:bg-white/10 transition-colors text-white/90"
            >
              Instagram (@letsmakemoments)
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@letsmakemoments"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur px-5 py-4 md:px-6 md:py-5 text-base md:text-lg hover:bg-white/10 transition-colors text-white/90"
            >
              TikTok (@letsmakemoments)
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/letsmakemoments"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur px-5 py-4 md:px-6 md:py-5 text-base md:text-lg hover:bg-white/10 transition-colors text-white/90"
            >
              LinkedIn
            </a>

            {/* App pages */}
            <Link
              href="/apply"
              className="block rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur px-5 py-4 md:px-6 md:py-5 text-base md:text-lg hover:bg-white/10 transition-colors text-white/90"
            >
              Apply
            </Link>

            <Link
              href="/waitlist"
              className="block rounded-2xl border border-neutral-800 bg-neutral-800/50 backdrop-blur px-5 py-4 md:px-6 md:py-5 text-base md:text-lg hover:bg-white/10 transition-colors text-white/90"
            >
              Join waitlist
            </Link>
          </div>

          {/* Subtle footer note for the page */}
          <div className="mt-10 text-xs text-white/60">Help us by taking the survey — it guides what we build next.</div>
        </div>
      </section>
    </main>
  );
}


