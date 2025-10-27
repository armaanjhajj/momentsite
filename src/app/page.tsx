import TypeWriter from '../components/TypeWriter';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className="container pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">Launching October 2025</p>
          <TypeWriter />
          <p className="mt-5 text-sm md:text-lg text-white/80 max-w-2xl">
            We&apos;re building a social app that rewinds missed connections in real time and gets people meeting spontaneously. Discover and join public events on campus. Get bumped by people around you and meet them on the spot. Post funny updates for all your friends to see or share it with the world.
          </p>
          <div className="mt-8">
            <Link 
              href="/waitlist" 
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-white text-black text-sm md:text-base font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              Find Your Moment
            </Link>
          </div>
        </div>
      </section>

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
