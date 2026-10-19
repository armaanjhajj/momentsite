import Link from "next/link";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for LYFESTYL, the on-device calorie tracker for iPhone.",
};

const CONTACT_EMAIL = "team@havemoments.com";

export default function LyfestylTerms() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/lyfestyl" className="legal-back">&larr; LYFESTYL</Link>
        <h1 className="legal-title">Terms of Use</h1>
        <p className="legal-updated">Effective October 19, 2026</p>
      </div>

      <section className="legal-section">
        <p className="legal-intro">
          These terms cover your use of LYFESTYL, the iPhone app made by One
          Moments LLC (&ldquo;we&rdquo;). By downloading or using the app you
          agree to them. If you don&apos;t agree, don&apos;t use the app. How
          the app handles your data is described in the{" "}
          <Link href="/lyfestyl/privacy" className="legal-link">
            LYFESTYL Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section className="legal-section">
        <h2>The app</h2>
        <p>
          LYFESTYL is free. We give you a personal, non-transferable license
          to use it on Apple devices you own or control, under these terms and
          the App Store&apos;s usage rules.
        </p>
        <p>
          Photo analysis needs an iPhone that supports Apple Intelligence.
          When it isn&apos;t available, you can still pick from foods
          you&apos;ve logged before or enter them yourself.
        </p>
      </section>

      <section className="legal-section">
        <h2>Not medical advice</h2>
        <p>
          Calories, macros and goals in LYFESTYL are estimates. They can be
          wrong, sometimes by a lot. The app is for general information and is
          not medical, dietary or nutritional advice, and it is not meant to
          diagnose, treat or manage any condition. Check food labels when it
          matters, and talk to a doctor or dietitian before making changes to
          your diet, especially if you have a medical condition, are pregnant,
          or have a history of disordered eating.
        </p>
      </section>

      <section className="legal-section">
        <h2>Your data</h2>
        <p>
          Your meals and settings live on your device and in your own iCloud
          account. We don&apos;t hold a copy, so we can&apos;t restore anything
          you lose. iCloud and Apple Health are Apple services and are covered
          by Apple&apos;s terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>Use it fairly</h2>
        <p>
          Don&apos;t use LYFESTYL in a way that breaks the law or the App
          Store&apos;s rules, or that interferes with the app working for
          anyone else.
        </p>
      </section>

      <section className="legal-section">
        <h2>Changes to the app</h2>
        <p>
          We may change, update or stop offering LYFESTYL, or any feature in
          it, at any time.
        </p>
      </section>

      <section className="legal-section">
        <h2>Disclaimer</h2>
        <p>
          LYFESTYL IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          ACCURACY AND NON-INFRINGEMENT. WE DON&apos;T WARRANT THAT THE APP
          WILL BE ERROR-FREE OR THAT ITS ESTIMATES WILL BE ACCURATE.
        </p>
      </section>

      <section className="legal-section">
        <h2>Limitation of liability</h2>
        <p>
          TO THE FULLEST EXTENT ALLOWED BY LAW, ONE MOMENTS LLC IS NOT LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE
          DAMAGES, OR FOR ANY LOSS OF DATA, HEALTH OUTCOMES OR DECISIONS MADE
          FROM THE APP&apos;S ESTIMATES. OUR TOTAL LIABILITY FOR ANY CLAIM
          ABOUT LYFESTYL IS LIMITED TO ONE HUNDRED US DOLLARS ($100).
        </p>
      </section>

      <section className="legal-section">
        <h2>Apple</h2>
        <p>
          These terms are between you and One Moments LLC, not Apple. Apple
          is not responsible for LYFESTYL or its content, has no obligation to
          provide support or maintenance for it, and is not responsible for
          any claims relating to it. Apple and its subsidiaries are
          third-party beneficiaries of these terms and may enforce them.
          Apple&apos;s{" "}
          <a
            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            className="legal-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Licensed Application End User License Agreement
          </a>{" "}
          also applies.
        </p>
      </section>

      <section className="legal-section">
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the State of New Jersey,
          without regard to conflict of law rules. Disputes go to the state or
          federal courts in New Jersey.
        </p>
      </section>

      <section className="legal-section">
        <h2>Changes to these terms</h2>
        <p>
          If these terms change, we&apos;ll post the new version here with a
          new effective date. Using the app after that means you accept them.
        </p>
      </section>

      <section className="legal-section">
        <h2>Contact</h2>
        <p className="legal-contact">
          One Moments LLC
          <br />
          New Brunswick, NJ
          <br />
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-link">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </div>
  );
}
