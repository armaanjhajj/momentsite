import Link from "next/link";

export const metadata = {
  title: "LYFSTYL · Moments",
  description:
    "LYFSTYL — a native iOS journaling app that quietly understands how you live. On-device AI, private by default. Launching 2026 Q3.",
};

const FEATURES = [
  "On-device AI",
  "Voice or text",
  "Nutrition · Activity · Sleep · Health",
  "Trends over time",
  "Private by default",
];

export default function Lyfstyl() {
  return (
    <div className="app-page">
      <Link href="/" className="app-back">
        &larr; BACK
      </Link>

      <p className="app-eyebrow">Moments · iOS App</p>
      <h1 className="app-title">LYFSTYL</h1>
      <p className="app-tagline">Your life, journaled and understood.</p>

      <div className="app-body">
        <p>
          LYFSTYL is a native iOS journaling app. Open it and just start typing
          — or tap once and talk. Logging a moment of your day should take
          seconds, not effort.
        </p>
        <p>
          Behind the scenes, an on-device AI quietly breaks every entry down
          into <strong>nutrition</strong>, <strong>activity</strong>,{" "}
          <strong>sleep</strong>, and <strong>health</strong> — with real
          estimates and a simple rank. Over time it builds a clean,
          Apple-Health-style picture of how you&apos;re actually living.
        </p>
        <p>
          The entire breakdown runs on your phone. No accounts to feed, no
          entries leaving your device. It&apos;s private by default.
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
