import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · Moments",
  description: "Privacy Policy for 1moments.com and One Moments LLC",
};

const CONTACT_EMAIL = "team@havemoments.com";

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/" className="legal-back">&larr; BACK</Link>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Effective October 19, 2026</p>
      </div>

      <section className="legal-section">
        <p className="legal-intro">
          This policy covers 1moments.com and its pages, run by One Moments
          LLC (&ldquo;Moments,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). It
          explains what we collect, why, and what you can do about it.
        </p>
        <p>
          Our apps have their own policies. For LYFESTYL, see the{" "}
          <Link href="/lyfestyl/privacy" className="legal-link">
            LYFESTYL Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section className="legal-section">
        <h2>What we collect</h2>
        <h3>What you give us</h3>
        <ul>
          <li>
            <strong>Waitlist.</strong> Your email address.
          </li>
          <li>
            <strong>Contact form.</strong> Your name, email or phone number,
            and your message.
          </li>
          <li>
            <strong>Survey.</strong> Your answers, and your email if you add
            it.
          </li>
          <li>
            <strong>SCENT.</strong> The text you type to describe a smell. If
            you share a memory to the board, that memory and its scent profile
            are posted publicly, without your name.
          </li>
          <li>
            <strong>Email.</strong> Anything you send us directly.
          </li>
        </ul>

        <h3>What we collect automatically</h3>
        <ul>
          <li>
            <strong>Analytics.</strong> Vercel Web Analytics and Speed
            Insights record anonymous page views, referrers, device and
            browser type, country, and page performance. They don&apos;t use
            cookies.
          </li>
          <li>
            <strong>Logs.</strong> Our host keeps standard server logs, such
            as IP address, browser and time of request. We use IP addresses
            briefly to stop spam on SCENT and don&apos;t store them.
          </li>
          <li>
            <strong>Local storage.</strong> Your browser remembers that you
            joined the waitlist so we don&apos;t ask again.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>How we use it</h2>
        <ul>
          <li>To reply to you and run the waitlist.</li>
          <li>To run SCENT and show the board.</li>
          <li>To understand how the site is used and make it better.</li>
          <li>To keep the site secure and stop abuse.</li>
          <li>To meet legal obligations.</li>
        </ul>
        <p>
          We don&apos;t sell your information, and we don&apos;t show ads.
        </p>
      </section>

      <section className="legal-section">
        <h2>Who we share it with</h2>
        <p>
          Only the services that run the site, each under its own privacy
          terms:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong>: hosting and analytics.
          </li>
          <li>
            <strong>Supabase</strong>: our database.
          </li>
          <li>
            <strong>Anthropic</strong> and <strong>Cohere</strong>: the text
            you type into SCENT is sent to them to analyze. Results are cached
            in our database so the same phrase answers faster.
          </li>
        </ul>
        <p>
          We may also disclose information if the law requires it, to protect
          our rights or someone&apos;s safety, or as part of a merger or sale
          of the company.
        </p>
      </section>

      <section className="legal-section">
        <h2>How long we keep it</h2>
        <p>
          We keep waitlist, contact and survey entries for as long as we need
          them to reply and to run Moments, then delete them. Posts on the
          SCENT board stay up until they are removed. Ask us and we&apos;ll
          delete yours.
        </p>
      </section>

      <section className="legal-section">
        <h2>Your choices</h2>
        <p>
          You can ask us to show you, correct, or delete what we hold about
          you, or to stop using it. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-link">
            {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll respond within 30 days. Depending on where you live,
          such as California or the EU, you may have further rights under
          local law, and we&apos;ll honor them.
        </p>
      </section>

      <section className="legal-section">
        <h2>Security</h2>
        <p>
          The site runs over HTTPS and our database is locked down with
          access rules. No system is perfectly secure, so please don&apos;t
          send us anything sensitive through the site.
        </p>
      </section>

      <section className="legal-section">
        <h2>Children</h2>
        <p>
          The site is not meant for children under 13, and we don&apos;t
          knowingly collect their information. If you think a child has sent
          us something, contact us and we&apos;ll delete it.
        </p>
      </section>

      <section className="legal-section">
        <h2>Where data is handled</h2>
        <p>
          We are based in the United States, and our providers may process
          data in the US and other countries.
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
