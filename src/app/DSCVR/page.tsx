import Link from "next/link";

export const metadata = {
  title: "DSCVR · Moments",
  description:
    "DSCVR — a precursor to the Moments Social Network, reinventing how people find, meet, and make friends online. Launching 2026 Q3.",
};

const FEATURES = [
  "Quarterly posting methods",
  "Living social graph",
  "Mutual tracking",
  "Semantic edge weighting",
];

export default function Dscvr() {
  return (
    <div className="app-page">
      <Link href="/" className="app-back">
        &larr; BACK
      </Link>

      <p className="app-eyebrow">Moments · Social</p>
      <h1 className="app-title">DSCVR</h1>
      <p className="app-tagline">A new way to find your people.</p>

      <div className="app-body">
        <p>
          DSCVR is a precursor to the Moments Social Network — a living
          experiment in social discovery. We&apos;re rethinking how people
          find, meet, and actually make friends with the technology we have
          today.
        </p>
        <p>
          Instead of one feed and one way to post, DSCVR ships{" "}
          <strong>new, experimental ways to be discovered every quarter</strong>
          : fresh posting methods, a living social graph, mutual tracking
          between people, and semantic edge weighting that connects profile
          nodes by what they actually mean — not just who follows whom.
        </p>
        <p>
          It&apos;s the groundwork for a social network built around
          connection, where the way you find someone is as interesting as
          finding them.
        </p>
      </div>

      <ul className="app-features">
        {FEATURES.map((f) => (
          <li key={f} className="app-feature">
            {f}
          </li>
        ))}
      </ul>

      <div className="app-launch">
        <span className="app-launch-dot" aria-hidden="true" />
        LAUNCHING — 2026 Q3
      </div>
    </div>
  );
}
