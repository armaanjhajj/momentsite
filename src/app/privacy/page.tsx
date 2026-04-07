import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · Moments",
  description: "Privacy Policy for One Moments LLC",
};

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/" className="legal-back">&larr; BACK</Link>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: April 7, 2026</p>
      </div>

      <section className="legal-section">
        <p className="legal-intro">
          This Privacy Policy describes how One Moments LLC (&ldquo;Moments,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, discloses, and
          protects your personal information when you use the Moments website,
          applications, and related services (the &ldquo;Service&rdquo;).
        </p>
        <p>
          By using the Service, you consent to the data practices described in
          this policy. If you do not agree with our practices, please do not
          use the Service.
        </p>
      </section>

      <section className="legal-section">
        <h2>1. Information We Collect</h2>

        <h3>Information You Provide</h3>
        <ul>
          <li>
            <strong>Phone number.</strong> Required for account creation and
            login via SMS one-time password (OTP) verification.
          </li>
          <li>
            <strong>Profile information.</strong> Name, handle (username),
            profile photo, bio, and birthday. This is collected during
            onboarding.
          </li>
          <li>
            <strong>Taste selections.</strong> Your favorite songs, albums,
            movies, TV shows, and books, including cover art, titles, and
            metadata retrieved from third-party APIs.
          </li>
          <li>
            <strong>Impulse responses.</strong> Your graduation year, major,
            personality vibes, interests, intents, pronouns, relationship
            status, and any free-text responses provided through the Impulse
            Engine onboarding flow.
          </li>
          <li>
            <strong>Event interactions.</strong> RSVPs, going/maybe status,
            solo/group indicator, and song requests.
          </li>
          <li>
            <strong>Communication.</strong> Any information you submit when
            contacting us via email, forms, or direct messages.
          </li>
        </ul>

        <h3>Information Collected Automatically</h3>
        <ul>
          <li>
            <strong>Authentication session tokens.</strong> Stored in your
            browser&apos;s local storage to keep you signed in.
          </li>
          <li>
            <strong>Log data.</strong> IP address, browser type, operating
            system, referring pages, pages visited, timestamps, and similar
            diagnostic data.
          </li>
          <li>
            <strong>Device information.</strong> Screen size, device type,
            and user agent.
          </li>
        </ul>

        <h3>Information We Derive</h3>
        <ul>
          <li>
            <strong>Vector embeddings.</strong> We use OpenAI&apos;s
            text-embedding-3-small model to generate a numerical vector
            representation of your profile for similarity search. This
            embedding is derived from your self-provided taste and Impulse
            data. It is stored on our servers and used only to power matching
            features.
          </li>
          <li>
            <strong>Impulse insights.</strong> An AI-generated personality
            synopsis, MBTI estimate, team color, and radar chart statistics
            derived from your Impulse responses.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, operate, maintain, and improve the Service.</li>
          <li>Authenticate users and secure accounts.</li>
          <li>Display your public profile to other users.</li>
          <li>
            Power the Impulse Engine&apos;s matching and recommendation
            features.
          </li>
          <li>
            Send transactional SMS for login and account security (via Twilio).
          </li>
          <li>Manage event RSVPs and attendee lists.</li>
          <li>
            Detect, prevent, and investigate fraudulent, abusive, or illegal
            activity.
          </li>
          <li>Enforce our Terms of Service.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Legal Bases (GDPR)</h2>
        <p>
          For users in the European Economic Area, we process personal data
          under the following legal bases:
        </p>
        <ul>
          <li>
            <strong>Contract.</strong> Processing necessary to provide the
            Service you&apos;ve requested (account creation, RSVP handling,
            profile hosting).
          </li>
          <li>
            <strong>Legitimate interests.</strong> Improving the Service,
            preventing fraud, and ensuring security.
          </li>
          <li>
            <strong>Consent.</strong> Optional features such as Impulse setup,
            marketing communications, or location-based features.
          </li>
          <li>
            <strong>Legal obligation.</strong> When required to comply with
            applicable law.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. How We Share Your Information</h2>
        <p>
          We do <strong>not</strong> sell your personal information. We share
          information only in the following circumstances:
        </p>

        <h3>Publicly Visible by Design</h3>
        <ul>
          <li>
            Your profile (name, handle, photo, bio, school, taste items, and
            Impulse insights if generated) is publicly visible at
            havemoments.com/@your-handle.
          </li>
          <li>
            RSVP status (going/maybe), your name, handle, and photo are
            visible to anyone viewing an event you&apos;ve RSVP&apos;d to.
          </li>
        </ul>

        <h3>Service Providers</h3>
        <p>
          We share data with third-party service providers that help us
          operate the Service. Each is bound by their own privacy policies
          and data processing agreements.
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — database, authentication, file storage.
          </li>
          <li>
            <strong>Twilio</strong> — SMS delivery for OTP verification.
          </li>
          <li>
            <strong>OpenAI</strong> — vector embeddings and Impulse insight
            generation. Data sent to OpenAI is subject to their API data
            handling policies. OpenAI has committed to not training on API
            data by default.
          </li>
          <li>
            <strong>Anthropic</strong> — AI-powered features within the
            Impulse Engine.
          </li>
          <li>
            <strong>Vercel</strong> — hosting, deployment, and serverless
            functions.
          </li>
          <li>
            <strong>Deezer, OMDb, Open Library</strong> — third-party APIs
            for music, film/TV, and book search. We pass your search queries
            to these APIs to return results.
          </li>
        </ul>

        <h3>Legal Requirements</h3>
        <p>
          We may disclose your information if required to do so by law or in
          response to valid requests by public authorities (e.g., a court or
          government agency), or to protect our rights, property, or safety
          or that of others.
        </p>

        <h3>Business Transfers</h3>
        <p>
          If we are involved in a merger, acquisition, or asset sale, your
          information may be transferred as part of that transaction. We
          will notify you via prominent notice on the Service before your
          information becomes subject to a different privacy policy.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is
          active and as long as needed to provide the Service. After account
          deletion:
        </p>
        <ul>
          <li>
            Profile data, taste selections, Impulse data, embeddings, and
            RSVPs are deleted from our production database.
          </li>
          <li>
            Backup copies may persist for up to 30 days as part of standard
            disaster recovery practices.
          </li>
          <li>
            Anonymized aggregate data may be retained indefinitely for
            analytics and service improvement.
          </li>
          <li>
            Certain records may be retained longer if required by law
            (e.g., financial records, fraud prevention logs).
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Your Rights and Choices</h2>
        <p>
          Depending on your jurisdiction, you may have the following rights:
        </p>
        <ul>
          <li>
            <strong>Access.</strong> Request a copy of the personal
            information we hold about you.
          </li>
          <li>
            <strong>Correction.</strong> Update or correct inaccurate data
            via the profile edit screen or by contacting us.
          </li>
          <li>
            <strong>Deletion.</strong> Delete your account and associated
            personal data via the profile settings, or by contacting us.
          </li>
          <li>
            <strong>Portability.</strong> Request your data in a structured,
            machine-readable format.
          </li>
          <li>
            <strong>Objection.</strong> Object to certain types of processing,
            such as for direct marketing.
          </li>
          <li>
            <strong>Withdrawal of consent.</strong> Withdraw consent at any
            time for processing that relies on consent.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:team@havemoments.com" className="legal-link">
            team@havemoments.com
          </a>
          . We will respond within 30 days.
        </p>
        <p>
          <strong>California residents:</strong> You have the right to
          request information about the categories of personal information we
          collect, the purposes for which we use it, and the categories of
          third parties with whom we share it. You also have the right to
          opt out of the sale of personal information, though we do not sell
          personal information.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Security</h2>
        <p>
          We implement industry-standard technical and organizational
          measures to protect your information, including:
        </p>
        <ul>
          <li>HTTPS encryption for data in transit.</li>
          <li>
            Row-level security policies on our database to restrict access to
            your data.
          </li>
          <li>
            Authentication sessions stored using secure browser storage
            mechanisms.
          </li>
          <li>
            Third-party providers (Supabase, Vercel) with SOC 2 compliance.
          </li>
          <li>
            Regular security reviews and updates.
          </li>
        </ul>
        <p>
          However, no method of transmission over the internet or electronic
          storage is 100% secure. We cannot guarantee absolute security. You
          are responsible for keeping your account credentials confidential.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Children&apos;s Privacy</h2>
        <p>
          The Service is not intended for children under 13. We do not
          knowingly collect personal information from children under 13. If
          we become aware that we have collected personal information from a
          child under 13 without verified parental consent, we will take
          steps to delete that information.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. International Data Transfers</h2>
        <p>
          Moments is based in the United States. If you are accessing the
          Service from outside the US, your information will be transferred
          to and processed in the US and other countries where our service
          providers operate. By using the Service, you consent to the
          transfer of your information to these countries, which may have
          data protection laws different from those in your country.
        </p>
      </section>

      <section className="legal-section">
        <h2>10. Cookies and Tracking</h2>
        <p>
          The Service uses local storage and session storage (similar to
          cookies) to:
        </p>
        <ul>
          <li>Keep you signed in between visits.</li>
          <li>Remember your preferences during multi-step flows (such as the RSVP flow).</li>
          <li>Cache data for performance.</li>
        </ul>
        <p>
          We do not currently use third-party advertising or analytics
          cookies. If this changes, we will update this policy and notify
          users accordingly.
        </p>
      </section>

      <section className="legal-section">
        <h2>11. AI and Automated Processing</h2>
        <p>
          The Service uses AI in the following ways:
        </p>
        <ul>
          <li>
            <strong>Face detection.</strong> When you upload a profile photo,
            we run client-side face detection (using an on-device machine
            learning model via face-api.js) to verify that the image
            contains a face. No image data leaves your device during this
            process.
          </li>
          <li>
            <strong>Impulse insights.</strong> Your Impulse onboarding
            responses are sent to OpenAI&apos;s GPT-4o-mini model to generate
            a personality synopsis, MBTI estimate, team color, and radar
            stats.
          </li>
          <li>
            <strong>Vector embeddings.</strong> Your profile data is converted
            into a numerical vector by OpenAI&apos;s text-embedding-3-small
            model for similarity matching.
          </li>
        </ul>
        <p>
          Impulse insights are approximations and should not be treated as
          professional psychological assessments. You may opt out of Impulse
          by skipping the setup flow or by deleting the data from your
          account.
        </p>
      </section>

      <section className="legal-section">
        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The updated
          version will be indicated by a revised &ldquo;Last updated&rdquo;
          date at the top. For material changes, we will make reasonable
          efforts to notify you via the Service or the contact information on
          file.
        </p>
        <p>
          We encourage you to review this Privacy Policy periodically.
          Continued use of the Service after changes constitutes your
          acceptance of the updated policy.
        </p>
      </section>

      <section className="legal-section">
        <h2>13. Contact Us</h2>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or our data practices, contact us at:
        </p>
        <p className="legal-contact">
          One Moments LLC
          <br />
          New Brunswick, NJ
          <br />
          <a href="mailto:team@havemoments.com" className="legal-link">
            team@havemoments.com
          </a>
        </p>
      </section>
    </div>
  );
}
