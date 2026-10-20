import Link from "next/link";

export const metadata = {
  title: "Support",
  description: "Help and contact for LYFESTYL, the on-device calorie tracker for iPhone.",
};

const CONTACT_EMAIL = "team@havemoments.com";

export default function LyfestylSupport() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/lyfestyl" className="legal-back">&larr; LYFESTYL</Link>
        <h1 className="legal-title">Support</h1>
      </div>

      <section className="legal-section">
        <h2>Photos don&apos;t work</h2>
        <p>
          Logging from a photo needs an iPhone with Apple Intelligence turned on
          in Settings. While it downloads, or on other iPhones, search and
          manual entry still work.
        </p>
      </section>

      <section className="legal-section">
        <h2>A number looks wrong</h2>
        <p>
          Tap the food before logging and slide or type the right value. Point
          the camera at a nutrition label for exact numbers.
        </p>
      </section>

      <section className="legal-section">
        <h2>Meals aren&apos;t syncing</h2>
        <p>
          Make sure you&apos;re signed in to iCloud on each iPhone and that
          iCloud Drive is on. Sync can take a minute.
        </p>
      </section>

      <section className="legal-section">
        <h2>Apple Health</h2>
        <p>
          Turn it on in the app under Account. To change what LYFESTYL can
          read or write, open the Health app and tap your profile picture.
        </p>
      </section>

      <section className="legal-section">
        <h2>Contact</h2>
        <p className="legal-contact">
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-link">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </div>
  );
}
