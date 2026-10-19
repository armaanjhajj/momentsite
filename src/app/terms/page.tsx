import Link from "next/link";

export const metadata = {
  title: "Terms of Use · Moments",
  description: "Terms of Use for 1moments.com and One Moments LLC",
};

const CONTACT_EMAIL = "team@havemoments.com";

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/" className="legal-back">&larr; BACK</Link>
        <h1 className="legal-title">Terms of Use</h1>
        <p className="legal-updated">Effective October 19, 2026</p>
      </div>

      <section className="legal-section">
        <p className="legal-intro">
          These terms cover your use of 1moments.com and its pages, run by One
          Moments LLC (&ldquo;Moments,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;). By using the site you agree to them and to our{" "}
          <Link href="/privacy" className="legal-link">
            Privacy Policy
          </Link>
          . If you don&apos;t agree, please don&apos;t use the site.
        </p>
        <p>
          Our apps have their own terms. For LYFESTYL, see the{" "}
          <Link href="/lyfestyl/terms" className="legal-link">
            LYFESTYL Terms of Use
          </Link>
          .
        </p>
      </section>

      <section className="legal-section">
        <h2>Using the site</h2>
        <p>
          You must be at least 13 to use the site. If you are under 18, you
          need a parent or guardian&apos;s permission. Don&apos;t:
        </p>
        <ul>
          <li>Break the law, or post anything unlawful, hateful, harassing or explicit.</li>
          <li>Post someone else&apos;s personal information.</li>
          <li>Spam our forms or the SCENT board.</li>
          <li>Scrape the site or use it to train AI models without our written permission.</li>
          <li>Try to break, overload or get around the site&apos;s security.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>What you post</h2>
        <p>
          You own what you send us, including memories you share to the SCENT
          board. By posting, you give us a free, worldwide license to store,
          display and share it on the site and in our work. Board posts are
          public. We may remove anything at any time.
        </p>
      </section>

      <section className="legal-section">
        <h2>AI features</h2>
        <p>
          SCENT uses AI models to interpret what you type. Its results are
          experimental and can be wrong. They aren&apos;t advice of any kind,
          and you shouldn&apos;t rely on them for safety, medical or allergy
          decisions.
        </p>
      </section>

      <section className="legal-section">
        <h2>Events</h2>
        <p>
          Event pages are for information. If you attend a Moments event, you
          do so at your own risk and agree to follow the venue&apos;s rules and
          the law. Plans can change or be cancelled.
        </p>
      </section>

      <section className="legal-section">
        <h2>Our work</h2>
        <p>
          The site&apos;s design, code, writing, photos, logos and the Moments
          name belong to One Moments LLC or the people who licensed them to
          us. Don&apos;t copy or reuse them without permission.
        </p>
      </section>

      <section className="legal-section">
        <h2>Other sites</h2>
        <p>
          We link to other sites and services. We aren&apos;t responsible for
          them, and their own terms apply.
        </p>
      </section>

      <section className="legal-section">
        <h2>Disclaimer</h2>
        <p>
          THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
          AND NON-INFRINGEMENT. WE DON&apos;T WARRANT THAT THE SITE WILL BE
          AVAILABLE, SECURE OR ERROR-FREE.
        </p>
      </section>

      <section className="legal-section">
        <h2>Limitation of liability</h2>
        <p>
          TO THE FULLEST EXTENT ALLOWED BY LAW, ONE MOMENTS LLC IS NOT LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE
          DAMAGES, OR FOR ANY LOSS OF DATA OR PROFITS, ARISING FROM THE SITE,
          ITS CONTENT, OR ANY EVENT. OUR TOTAL LIABILITY FOR ANY CLAIM IS
          LIMITED TO ONE HUNDRED US DOLLARS ($100).
        </p>
      </section>

      <section className="legal-section">
        <h2>Indemnity</h2>
        <p>
          If your use of the site or what you post leads to a claim against
          us, you agree to cover our reasonable costs, including legal fees.
        </p>
      </section>

      <section className="legal-section">
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the State of New Jersey,
          without regard to conflict of law rules. Disputes go to the state or
          federal courts in New Jersey. Before filing anything, contact us and
          give us 30 days to try to sort it out.
        </p>
      </section>

      <section className="legal-section">
        <h2>Changes</h2>
        <p>
          If these terms change, we&apos;ll post the new version here with a
          new effective date. Using the site after that means you accept them.
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
