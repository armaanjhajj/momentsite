export const metadata = {
  title: "Moments — QR Landing",
  description: "Real connections, built for campus. Launching Fall 2025.",
};

export default function QR1Page() {
  return (
    <main>
      <section className="container pt-10 pb-16 md:pt-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-semibold">Find Your Moment</h1>
          <p className="mt-3 text-white/80 md:text-lg">
            Moments rewinds missed connections in real time and gets people meeting spontaneously.
            Discover campus events, bump into people nearby, and share what you&apos;re up to — all in one place.
            Launching Fall 2025 at Rutgers.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com/letsmakemoments"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full px-4 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@letsmakemoments"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full px-4 py-2 border border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              TikTok
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-24">
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/hmibjZGhyX0?si=sBLmVKYIY9GX-p1G"
              title="Moments overview video"
              frameBorder={0}
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


