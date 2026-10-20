import Link from "next/link";
import { LyfestylWordmark } from "@/components/LyfestylWordmark";

const FAQ = [
  {
    q: "How does it work?",
    a: "Take a photo of your food. You get calories and macros for each item.",
  },
  {
    q: "What about packaged food?",
    a: "Point it at the label and it reads it.",
  },
  {
    q: "What if it gets something wrong?",
    a: "Adjust it with a slider before logging.",
  },
  {
    q: "Can I log without a photo?",
    a: "Yes. Search, pick from recents, or type it in.",
  },
  {
    q: "Where do I see my history?",
    a: "Today, the last 7 days and everything before that.",
  },
  {
    q: "Does it sync?",
    a: "Yes, with iCloud. Apple Health too if you turn it on.",
  },
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
      <p className="app-tagline">Snap a photo, get calorie estimates.</p>

      <div className="lyfestyl-features lyfestyl-faq">
        {FAQ.map(({ q, a }) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>

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

      <nav className="lyfestyl-legal" aria-label="LYFESTYL legal">
        <Link href="/lyfestyl/privacy">Privacy</Link>
        <Link href="/lyfestyl/terms">Terms</Link>
        <Link href="/lyfestyl/support">Support</Link>
      </nav>

      <p className="lyfestyl-credit">
        Product photo in screenshots from Open Food Facts, CC BY-SA.
      </p>
    </div>
  );
}
