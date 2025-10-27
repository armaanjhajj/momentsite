export const metadata = {
  title: "Finished our MVP (ready for our 10/25 launch)",
  description:
    "From idea to MVP: building a product that helps people reconnect in real life.",
};

export default function MvpReady() {
  return (
    <main className="container py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold">Finished our MVP (ready for our 10/25 launch)</h1>
        <div className="mt-2 text-sm text-white/60 flex items-center gap-2">
          <span className="font-medium">Moments Team</span>
          <span>•</span>
          <time dateTime="2025-09-23">September 23, 2025</time>
        </div>

        <img
          src="https://i.imgur.com/5i7oyGS.png"
          alt="MVP thumbnail"
          className="mt-6 w-full h-auto rounded-xl border border-white/10"
        />
        <div className="mt-2 text-xs text-white/50 italic">Figure 1. Moments MVP milestone.</div>

        <hr className="mt-8 border-white/10" />

        <div className="prose prose-invert prose-p:leading-relaxed prose-headings:tracking-tight mt-8">
          <p><strong>Building Moments: From Idea to MVP</strong></p>
          <p>
            For months, our team has been living and breathing a single vision: make it easier for people to
            connect in real life, and give them a second chance when they miss that spark. Today, we’ve reached a
            milestone that feels both surreal and electric — the Moments MVP is finally ready.
          </p>

          <h2>From Scribbles to Screens</h2>
          <p>
            Moments started the way a lot of ideas do: late-night conversations with friends about how much harder it
            feels to meet people these days. Social media makes us hyper-connected online, but it rarely helps us connect
            offline. We wanted to flip that.
          </p>
          <p>
            The first sketches were messy. Whiteboards full of arrows, notes about “missed connections,” questions about
            what features mattered most. We debated everything from UI colors to whether location data should be exact or
            general (we chose general — safety first). Every detail became a tradeoff between simplicity and possibility.
          </p>

          <h2>Building the Core</h2>
          <p>
            We knew we couldn’t build everything at once, so we focused the MVP around two pillars:
          </p>
          <ul>
            <li><strong>Moments Feed</strong> – a low-stakes space where friends can share quick updates, stories, and IRL experiences. Not a follower game, just real people in your circle.</li>
            <li><strong>Bumps</strong> – a way to rewind those chance encounters. See someone on your feed you didn’t connect with? Bump them. It’s not a like, not a follow, just a nudge to reconnect later.</li>
          </ul>
          <p>
            Around those, we built the basics: account creation, profiles, privacy settings, and enough polish that it
            feels smooth but not bloated.
          </p>

          <h2>The Grind Behind the Glass</h2>
          <p>
            What people see is a clean app interface. What we see are weeks of debugging, countless Firebase crashes,
            endless GitHub commits, and design files that changed a hundred times. There were nights the backend refused
            to cooperate. Days when CSS felt like our enemy. And moments where we seriously questioned if this could ever
            work at the scale we imagined. But each hurdle taught us more about the tech stack, the product, and
            ourselves.
          </p>

          <h2>Why This MVP Matters</h2>
          <p>
            The MVP isn’t the end — it’s the beginning. It’s proof that the idea works outside our heads. It’s something
            real we can test, refine, and put in the hands of people to see if it makes their
            lives a little more connected.
          </p>
          <p>
            Most importantly, the MVP keeps us honest. It forces us to focus on what matters, to listen to users, and to
            evolve quickly.
          </p>

          <h2>What’s Next</h2>
          <ul>
            <li><strong>Campus Launch Prep</strong> – building buzz, stunts, and campaigns on campus.</li>
            <li><strong>Feedback Loops</strong> – learning how real people actually use the app.</li>
            <li><strong>Iterating</strong> – taking every bug report, suggestion, and “what if” seriously.</li>
          </ul>
          <p>
            The MVP is the first step in a much bigger journey. And if you’re reading this, you’re already part of it.
            Here’s to more real connections, more rewound sparks, and more Moments.
          </p>

          <p className="mt-6">— <em>The Moments Team</em></p>
        </div>
      </article>
    </main>
  );
}
