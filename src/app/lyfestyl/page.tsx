import Link from "next/link";
import { LyfestylWordmark } from "@/components/LyfestylWordmark";

const FEATURES = [
  "Snap a meal, get calories and macros for each food.",
  "Reads the label on packaged food.",
  "Fix anything with a slider, then log.",
  "Search, recents, or type it in.",
  "Today, the last 7 days, and your history.",
  "Syncs with iCloud. Apple Health if you want it.",
];

const SHOTS = [
  { src: "/lyfestyl/01-onboarding.png", alt: "LYFESTYL welcome screen" },
  { src: "/lyfestyl/02-review.png", alt: "A protein shake itemized at 150 calories with protein, carbs and fat" },
  { src: "/lyfestyl/03-dashboard.png", alt: "Dashboard with today's calories and macros" },
];

export default function Lyfestyl() {
  return (
    <div className="app-page lyfestyl-page">
      <img
        src="/lyfestyl/app-icon.png"
        alt=""
        width={96}
        height={96}
        className="lyfestyl-icon"
      />

      <p className="app-eyebrow">iPhone · Free</p>
      <h1 className="app-title lyfestyl-title">
        <LyfestylWordmark />
      </h1>
      <p className="app-tagline">Calorie tracking from a photo.</p>

      <ul className="lyfestyl-features">
        {FEATURES.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="lyfestyl-private">
        <h2 className="lyfestyl-h2">Private by design</h2>
        <p>
          Everything runs on your iPhone. Photos are never saved. No account,
          no ads, no tracking.
        </p>
      </div>

      <div className="lyfestyl-shots">
        {SHOTS.map((s) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={552}
            height={1200}
            loading="lazy"
            className="lyfestyl-shot"
          />
        ))}
      </div>

      {/* TODO: swap for the App Store link once LYFESTYL is live. */}
      <span className="lyfestyl-cta" aria-disabled="true">
        Coming to the App Store
      </span>
      <p className="lyfestyl-req">Needs an iPhone with Apple Intelligence.</p>

      <nav className="lyfestyl-legal" aria-label="LYFESTYL legal">
        <Link href="/lyfestyl/privacy">Privacy</Link>
        <Link href="/lyfestyl/terms">Terms</Link>
      </nav>

      <p className="lyfestyl-credit">
        Product photo in screenshots from Open Food Facts, CC BY-SA.
      </p>
    </div>
  );
}
