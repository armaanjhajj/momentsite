export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="container pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">Launching October 2025</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Rewind missed connections. Meet the people around you.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl">
            Moments helps students turn chance encounters into real connections. See who’s nearby, bump to rewind a missed moment, and join your campus community.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button className="focus-accent rounded-full px-5 py-3 bg-white text-black border border-transparent hover:bg-[var(--accent)] hover:text-black transition">
              Download on the App Store
            </button>
          </div>
        </div>
      </section>

      {/* Three feature cards with copy only */}
      <section className="container pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur">
            <div className="text-sm uppercase tracking-[0.18em] text-white/60">Nearby</div>
            <div className="mt-3 rounded-xl border border-white/10 p-5 min-h-[220px] flex items-center text-white/80">
              See who’s nearby with shared interests. Open to connect, right now.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur">
            <div className="text-sm uppercase tracking-[0.18em] text-white/60">Events</div>
            <div className="mt-3 rounded-xl border border-white/10 p-5 min-h-[220px] flex items-center text-white/80">
              Host and join campus events in seconds — study sessions, pickup games, open mics.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur">
            <div className="text-sm uppercase tracking-[0.18em] text-white/60">Feed</div>
            <div className="mt-3 rounded-xl border border-white/10 p-5 min-h-[220px] flex items-center text-white/80">
              A playful campus feed for quick posts, memes, and reactions.
            </div>
          </div>
        </div>
      </section>

      {/* Removed bottom 4 feature cards per request */}

      {/* Simple video embed */}
      <section className="container pb-24">
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/hmibjZGhyX0?si=sBLmVKYIY9GX-p1G"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
}
