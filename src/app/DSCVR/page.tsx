import { ExhibitClose } from "@/components/ExhibitClose";
import { Footnote } from "@/components/Footnote";

export const metadata = {
  title: "DSCVR · Moments",
  description:
    "DSCVR is a precursor to the Moments social network and a living experiment in social discovery. Launching 2026 Q3.",
};

export default function Dscvr() {
  return (
    <div className="app-page">
      <ExhibitClose />

      <p className="app-eyebrow">Moments · Social</p>
      <h1 className="app-title">DSCVR</h1>
      <p className="app-tagline">Social Discovery, Innovated.</p>

      <div className="app-body">
        <p>
          DSCVR is a precursor to{" "}
          <Footnote note="Moments is our brand's flagship platform, launching tentatively Q4 2026">
            Moments
          </Footnote>{" "}
          and a living experiment in social discovery. We&apos;re rethinking how
          people find, meet, and actually make friends with cool ways to express
          yourself and be DSCVRD.
        </p>
        <p>
          Instead of one feed and one way to post, DSCVR ships{" "}
          <strong>new, experimental ways to be discovered every quarter</strong>.
        </p>
        <p>
          It&apos;s the groundwork for a social network built around connection,
          where the way you find someone is as interesting as finding them.
        </p>
      </div>

      <div className="app-launch">
        <span className="app-launch-dot" aria-hidden="true" />
        LAUNCHING · 2026 Q3
      </div>
    </div>
  );
}
