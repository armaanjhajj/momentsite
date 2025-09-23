import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Introducing, Moments — launching this fall at Rutgers",
  description:
    "Redefining social connection on campus. Moments helps students turn fleeting encounters into real connections.",
};

export default function IntroducingMoments() {
  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm text-white/70 hover:text-white">← Back to blog</Link>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold">Introducing, Moments</h1>
        <p className="mt-2 text-white/70">Launching this fall, at Rutgers</p>

        <div className="mt-4 text-sm text-white/60">August 31, 2025 • Moments</div>

        <div className="mt-6">
          <Image
            src="https://i.imgur.com/VmYjp6Q.png"
            alt="Introducing Moments thumbnail"
            width={1200}
            height={630}
            className="w-full h-auto rounded-xl border border-white/10"
            priority
          />
        </div>

        <article className="prose prose-invert prose-p:leading-relaxed prose-headings:tracking-tight mt-8">
          <p>
            In a world where we are more digitally connected than ever, genuine in‑person
            interaction has become increasingly rare. Social feeds are crowded, conversations are
            fragmented, and despite thousands of “friends” or “followers,” loneliness remains one
            of today’s biggest challenges — especially on college campuses.
          </p>
          <p>Moments was built to change that.</p>
          <p>
            We’re creating a platform designed to make real‑life connections happen in real time.
            Unlike traditional social apps that rely on endless swipes, curated profiles, and
            algorithmic feeds, Moments focuses on proximity, compatibility, and timing to connect
            you with the right people — right now.
          </p>
          <p>
            Whether it’s meeting someone to grab coffee, joining a spontaneous game, or striking up
            a conversation with a stranger nearby, Moments turns fleeting encounters into lasting
            stories.
          </p>
          <p>
            We believe the best friendships, the best ideas, and the best nights out don’t start
            with a DM — they start with “hey.”
          </p>
          <p>
            Launching Fall 2025 at Rutgers University, Moments is built by students, for students.
            This is more than an app — it’s a movement to bring people back to the present, foster
            belonging, and strengthen communities one interaction at a time.
          </p>
          <p>
            If you want to learn more, follow along here and join us as we build the future of
            real‑world connection.
          </p>
          <hr />
          <p className="text-white/70">Meet the Team: Armaan Jhajj · Simeon Thomas · Shivani Kinare · Anish Phatak</p>
        </article>
      </div>
    </main>
  );
}


