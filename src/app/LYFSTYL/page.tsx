import { ExhibitClose } from "@/components/ExhibitClose";
import { Footnote } from "@/components/Footnote";

export const metadata = {
  title: "LYFSTYL · Moments",
  description:
    "LYFSTYL is a native iOS health-centered journaling app that understands how you live, privately. Launching 2026 Q3.",
};

export default function Lyfstyl() {
  return (
    <div className="app-page">
      <ExhibitClose />

      <p className="app-eyebrow">Moments · iOS App</p>
      <h1 className="app-title">LYFSTYL</h1>
      <p className="app-tagline">Your life, understood.</p>

      <div className="app-body">
        <p>
          LYFSTYL is a{" "}
          <Footnote note="Built in Swift & Objective-C for an authentic Apple experience.">
            native
          </Footnote>{" "}
          iOS health-centered journaling app. Open it and just start typing, or
          tap to talk to log how your day went, how you felt, what you did, and
          even what you ate: should take seconds, not effort.
        </p>
        <p>
          Behind the scenes we use your phone&apos;s on-board{" "}
          <Footnote note="Uses Apple's Foundation Models, so all processing happens on your own phone with minimal data handoff.">
            NPU
          </Footnote>{" "}
          to intuitively break down every entry into <strong>nutrition</strong>,{" "}
          <strong>activity</strong>, <strong>sleep</strong>, and{" "}
          <strong>health</strong>, with real estimates and a simple rank. Over
          time it builds a clean and usable picture of how you&apos;re actually
          living.
        </p>
        <p>
          Your entries stay private and secure, kept safe so the only person
          who sees your life is you.
        </p>
      </div>

      <div className="app-launch">
        <span className="app-launch-dot" aria-hidden="true" />
        LAUNCHING · 2026 Q3
      </div>
    </div>
  );
}
