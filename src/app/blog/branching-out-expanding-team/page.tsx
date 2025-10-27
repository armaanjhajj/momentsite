export const metadata = {
  title: "Branching Out: Building Moments Together",
  description:
    "We’re growing the team — creators, builders, organizers, and storytellers.",
};

export default function BranchingOut() {
  return (
    <main className="container py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold">Branching Out: Building Moments Together</h1>
        <div className="mt-2 text-sm text-white/60 flex items-center gap-2">
          <span className="font-medium">Moments Team</span>
          <span>•</span>
          <time dateTime="2025-09-21">September 21, 2025</time>
        </div>

        <img
          src="https://i.imgur.com/to1RzTY.png"
          alt="Expanding the Moments team"
          className="mt-6 w-full h-auto rounded-xl border border-white/10"
        />
        <div className="mt-2 text-xs text-white/50 italic">Figure 1. Branching out — growing the Moments community.</div>

        <hr className="mt-8 border-white/10" />

        <div className="prose prose-invert prose-p:leading-relaxed prose-headings:tracking-tight mt-8">
          <p>
            When we started Moments, it was just an idea between friends — a thought that maybe technology could do
            better at helping people connect in real life. Now, with our MVP in hand and a launch on the horizon, we’re
            ready to grow. Not just the app, but the community around it. And we want you on board.
          </p>

          <h2>Why We’re Expanding</h2>
          <p>
            One thing we’ve learned in building Moments is that no great project happens in isolation. Every line of
            code, every design mockup, every piece of content — it all takes a team. As we prepare to introduce Moments
            to the world, we know we can’t do this alone. That’s why we’re branching out.
          </p>
          <p>
            We’re opening doors for more people to get involved, contribute their talents, and shape what this platform
            becomes.
          </p>

          <h2>Who We’re Looking For</h2>
          <ul>
            <li><strong>Creators & Storytellers:</strong> Film, edit, design, and create content.</li>
            <li><strong>Writers & Marketers:</strong> Tell the Moments story across blogs and campaigns.</li>
            <li><strong>Builders & Developers:</strong> Help refine the app and website.</li>
            <li><strong>Community Organizers:</strong> Own campus outreach and activation.</li>
          </ul>
          <p>
            Even if you don’t see your role listed, if you’re passionate about connection, creativity, and being part
            of something from the ground up, there’s a place for you here.
          </p>

          <h2>Why Get Involved</h2>
          <ul>
            <li>Learn by doing on real projects with real impact.</li>
            <li>Be part of a student-led startup.</li>
            <li>Shape culture on campus and beyond.</li>
            <li>Join a team where your ideas matter and your contributions are visible.</li>
          </ul>
          <p>
            We’re building something ambitious, and the people who join now will always be part of the foundation.
          </p>

          <h2>Join Us</h2>
          <p>
            If you’ve ever wanted to be part of something bigger than yourself — something creative, technical, and
            cultural all at once — this is the time. Moments is branching out. We want as many people as possible on
            board, contributing, experimenting, and growing with us.
          </p>
          <p>
            Reach out. DM us. Stop by when you see us on campus. Bring your skills, your ideas, your friends. Because
            this isn’t just our project. It’s yours too. Let’s make Moments together.
          </p>
          <p className="mt-6">— <em>The Moments Team</em></p>
        </div>
      </article>
    </main>
  );
}


