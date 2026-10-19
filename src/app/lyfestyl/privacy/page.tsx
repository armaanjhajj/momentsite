import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for LYFESTYL, the on-device calorie tracker for iPhone.",
};

const CONTACT_EMAIL = "team@havemoments.com";

export default function LyfestylPrivacy() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/lyfestyl" className="legal-back">&larr; LYFESTYL</Link>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Effective October 19, 2026</p>
      </div>

      <section className="legal-section">
        <p className="legal-intro">
          LYFESTYL is a calorie tracker for iPhone made by One Moments LLC
          (&ldquo;we&rdquo;). It is built so that your data stays with you. We
          run no servers for the app and receive nothing you put into it. This
          policy explains what the app handles and where it goes.
        </p>
      </section>

      <section className="legal-section">
        <h2>The short version</h2>
        <ul>
          <li>Everything runs on your iPhone.</li>
          <li>Food photos are never saved.</li>
          <li>No account, no analytics, no ads, no tracking, no third-party SDKs.</li>
          <li>Your meals sync through your own iCloud. We can&apos;t see them.</li>
          <li>Apple Health is optional.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Photos</h2>
        <p>
          When you take a photo of a meal, or pick one from your photo library,
          LYFESTYL reads it on your iPhone with Apple&apos;s on-device
          Foundation Models and Vision text recognition (for nutrition labels).
          The image is held in memory until you log the meal or dismiss it.
          It is never written to storage, never added to your photo library,
          and never sent anywhere.
        </p>
        <p>
          The one image the app keeps is a profile photo, if you choose one.
          It is shrunk to 256 pixels and synced through your iCloud.
        </p>
      </section>

      <section className="legal-section">
        <h2>What the app stores</h2>
        <ul>
          <li>
            <strong>Meals.</strong> Food names, portions, calories, protein,
            carbs, fat, and when you logged them.
          </li>
          <li>
            <strong>Goals and body profile.</strong> Your calorie and macro
            goals, and the sex, age, height, weight, activity level and aim
            you enter to set them.
          </li>
          <li>
            <strong>Profile.</strong> Your name and optional profile photo.
          </li>
        </ul>
        <p>
          This is kept on your iPhone and in your iCloud account. Nothing is
          sent to us.
        </p>
      </section>

      <section className="legal-section">
        <h2>iCloud</h2>
        <p>
          Meals sync between your devices through your iCloud private database
          (CloudKit). Goals, body profile, name and profile photo sync through
          iCloud key-value storage. Both belong to your Apple Account, and we
          have no access to either. If iCloud is off, everything stays on your
          iPhone. Apple&apos;s handling of iCloud data is covered by
          Apple&apos;s privacy policy.
        </p>
      </section>

      <section className="legal-section">
        <h2>Apple Health</h2>
        <p>Connecting Apple Health is optional. If you allow it, LYFESTYL:</p>
        <ul>
          <li>
            Writes the calories, protein, carbs and fat of each meal you log,
            and removes them when you delete that meal.
          </li>
          <li>
            Reads your height, weight, date of birth and sex, only to suggest
            goals.
          </li>
        </ul>
        <p>
          Health data is never used for advertising or marketing, never sold,
          and never shared with anyone. It doesn&apos;t leave your iPhone
          except through Apple&apos;s own Health sync. You can turn access off
          at any time in Settings.
        </p>
      </section>

      <section className="legal-section">
        <h2>What we don&apos;t collect</h2>
        <p>
          We don&apos;t collect, store, sell or share any personal data from
          LYFESTYL. There is no account to create, and no analytics, ads,
          tracking or third-party code in the app. If you choose to share
          analytics with app developers in your iPhone&apos;s settings, Apple
          may send us anonymous crash reports. Apple controls that, and you
          can turn it off.
        </p>
      </section>

      <section className="legal-section">
        <h2>Export and delete</h2>
        <ul>
          <li>Export your meals as a CSV file from the app&apos;s settings.</li>
          <li>
            Delete all meals from the app&apos;s settings. This also removes
            the entries LYFESTYL wrote to Apple Health.
          </li>
          <li>
            To remove everything, delete the app and remove LYFESTYL&apos;s
            data from your iCloud storage settings.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Children</h2>
        <p>
          LYFESTYL is not directed at children under 13, and we don&apos;t
          knowingly collect data from anyone.
        </p>
      </section>

      <section className="legal-section">
        <h2>Changes</h2>
        <p>
          If this policy changes, we&apos;ll post the new version here with a
          new effective date.
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
