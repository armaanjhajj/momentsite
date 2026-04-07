import Link from "next/link";

export const metadata = {
  title: "Terms of Service · Moments",
  description: "Terms of Service for One Moments LLC",
};

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/" className="legal-back">&larr; BACK</Link>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: April 7, 2026</p>
      </div>

      <section className="legal-section">
        <p className="legal-intro">
          Welcome to Moments. These Terms of Service (&ldquo;Terms&rdquo;) govern your
          access to and use of the websites, applications, and services
          (collectively, the &ldquo;Service&rdquo;) operated by One Moments LLC
          (&ldquo;Moments,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), including but not limited to{" "}
          <strong>havemoments.com</strong> and any associated subdomains,
          events, and features.
        </p>
        <p>
          By creating an account, accessing, or using the Service, you agree to
          be bound by these Terms and our{" "}
          <Link href="/privacy" className="legal-link">
            Privacy Policy
          </Link>
          . If you do not agree to these Terms, do not access or use the
          Service.
        </p>
      </section>

      <section className="legal-section">
        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years old to use the Service. If you are
          under the age of 18, you represent that you have your parent or
          guardian&apos;s permission to use the Service. By using the Service,
          you represent and warrant that you meet all eligibility requirements
          outlined in these Terms.
        </p>
        <p>
          The Service is currently designed for college-age users in the
          United States. Users outside this demographic may access the Service
          at their own discretion, subject to these Terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Account Registration</h2>
        <p>
          To access most features of the Service, you must create an account
          using a valid mobile phone number. You agree to provide accurate,
          current, and complete information during registration and to update
          such information as needed.
        </p>
        <ul>
          <li>
            You are responsible for safeguarding your account credentials and
            for all activity that occurs under your account.
          </li>
          <li>
            You agree to notify us immediately of any unauthorized use of
            your account.
          </li>
          <li>
            You may not use another person&apos;s account, impersonate any
            person, or create an account using false information.
          </li>
          <li>
            One account per person. Multiple accounts, bot accounts, or
            automated account creation are prohibited.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Phone Verification and Messaging</h2>
        <p>
          We use SMS-based one-time passwords (OTPs) to verify your identity
          during sign-up and login. By providing your phone number, you
          consent to receive verification text messages from us or our service
          providers (including Twilio). Standard message and data rates may
          apply. Message frequency varies. We do not send marketing SMS unless
          you explicitly opt in.
        </p>
        <p>
          You may opt out of non-essential SMS communications at any time;
          however, verification messages are required for account security and
          cannot be opted out of while maintaining an active account.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. User Content</h2>
        <p>
          The Service allows you to submit content including but not limited
          to your name, handle, profile photo, bio, academic information,
          personality responses, favorite music, film, and literature, RSVPs,
          and song requests (&ldquo;User Content&rdquo;).
        </p>
        <p>
          <strong>You retain ownership</strong> of your User Content. By
          submitting User Content, you grant Moments a worldwide, non-exclusive,
          royalty-free, sublicensable, and transferable license to host,
          store, reproduce, modify, adapt, publish, transmit, display, and
          distribute such content solely in connection with operating,
          providing, and improving the Service.
        </p>
        <p>
          You represent and warrant that:
        </p>
        <ul>
          <li>You own or have the necessary rights to all User Content you submit.</li>
          <li>
            Your User Content does not violate any third-party rights,
            including intellectual property, privacy, or publicity rights.
          </li>
          <li>
            Your User Content complies with these Terms and all applicable
            laws.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Impulse Engine</h2>
        <p>
          The Impulse Engine is a feature of the Service that uses artificial
          intelligence (currently powered by OpenAI and Anthropic models) to
          analyze your self-provided responses about personality, interests,
          and intents in order to generate personality summaries, compatibility
          signals, and other derived insights.
        </p>
        <p>
          By using the Impulse Engine, you acknowledge and agree that:
        </p>
        <ul>
          <li>
            The insights generated are <strong>approximations</strong> based on
            limited information and should not be treated as professional
            psychological, medical, or relationship advice.
          </li>
          <li>
            Your responses are sent to third-party AI providers for processing.
            We do not control their data handling practices beyond the
            contractual terms of their respective APIs.
          </li>
          <li>
            We store vector embeddings derived from your responses to power
            similarity matching. You can delete these at any time by deleting
            your account.
          </li>
          <li>
            Impulse outputs (MBTI estimates, team colors, synopses, radar
            stats) are visible to other users who view your profile.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Public Profiles</h2>
        <p>
          Your profile, including your name, handle, profile photo, bio,
          taste selections (music, film, literature), and Impulse insights
          (if generated), is <strong>publicly visible</strong> at
          havemoments.com/@your-handle. Do not include information on your
          profile that you are not comfortable making public.
        </p>
        <p>
          Your phone number, birthday, pronouns (if set to private), and
          relationship status are <strong>not</strong> displayed publicly on
          your profile.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Events and RSVPs</h2>
        <p>
          Moments hosts and displays information about in-person and online
          events. By RSVPing to an event:
        </p>
        <ul>
          <li>
            You acknowledge that RSVP information (your name, handle, photo,
            status, solo/group indicator) may be visible to other users
            viewing the event page.
          </li>
          <li>
            You agree to comply with any venue rules, event-specific terms,
            and applicable laws while attending.
          </li>
          <li>
            You assume all risks of attending in-person events. Moments is
            not responsible for injury, loss, or damage arising from
            attendance at any event.
          </li>
          <li>
            RSVPs are not guarantees of entry. Venues, sponsors, and event
            organizers may have capacity limits or additional requirements.
          </li>
          <li>
            Song requests submitted via RSVP are shared with event organizers
            and may be visible to other attendees.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>8. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Post or share content that is unlawful, harmful, threatening,
            abusive, harassing, defamatory, obscene, hateful, or invasive of
            another&apos;s privacy.
          </li>
          <li>
            Upload content depicting nudity, sexual content, violence, or
            illegal activity.
          </li>
          <li>
            Impersonate any person or entity, or misrepresent your affiliation
            with any person or entity.
          </li>
          <li>
            Use the Service to spam, solicit, or harass other users.
          </li>
          <li>
            Scrape, crawl, or harvest any data from the Service without our
            express written consent.
          </li>
          <li>
            Reverse engineer, decompile, or attempt to extract source code
            from the Service.
          </li>
          <li>
            Interfere with or disrupt the Service, servers, or networks.
          </li>
          <li>
            Use the Service for any commercial purpose without our express
            written consent.
          </li>
          <li>
            Use the Service to train any third-party machine learning or AI
            model.
          </li>
          <li>
            Upload a profile photo that does not contain your own face or
            that is not a genuine representation of you. We use automated
            face detection to enforce this, but we reserve the right to remove
            any photo that does not comply.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>9. Content Moderation</h2>
        <p>
          We reserve the right, but not the obligation, to review, monitor,
          edit, or remove any User Content at our sole discretion, including
          content that we believe violates these Terms, is objectionable, or
          is otherwise harmful to the Service or its users.
        </p>
        <p>
          We may suspend or terminate accounts that repeatedly or egregiously
          violate these Terms, without prior notice.
        </p>
      </section>

      <section className="legal-section">
        <h2>10. Third-Party Services</h2>
        <p>
          The Service integrates with and relies on third-party services
          including but not limited to:
        </p>
        <ul>
          <li><strong>Supabase</strong> for authentication, database, and storage.</li>
          <li><strong>Twilio</strong> for SMS delivery.</li>
          <li><strong>OpenAI</strong> for embeddings and personality insights.</li>
          <li><strong>Anthropic</strong> for AI-powered features.</li>
          <li><strong>Deezer</strong> for music search.</li>
          <li><strong>OMDb</strong> for film and TV search.</li>
          <li><strong>Open Library</strong> for book search.</li>
          <li><strong>Vercel</strong> for hosting and deployment.</li>
        </ul>
        <p>
          Your use of these services is also governed by their respective
          terms of service and privacy policies. We are not responsible for
          the content or practices of third-party services.
        </p>
      </section>

      <section className="legal-section">
        <h2>11. Intellectual Property</h2>
        <p>
          The Service, including its code, design, logos, trademarks, and all
          content (excluding User Content) are owned by or licensed to One
          Moments LLC and are protected by copyright, trademark, and other
          intellectual property laws.
        </p>
        <p>
          You may not copy, modify, distribute, sell, or lease any part of the
          Service without our written permission. The name &ldquo;Moments,&rdquo;
          the Moments logo, and related marks are trademarks of One Moments
          LLC.
        </p>
      </section>

      <section className="legal-section">
        <h2>12. Termination</h2>
        <p>
          You may delete your account at any time via the profile settings.
          Upon deletion:
        </p>
        <ul>
          <li>
            Your user profile, taste selections, Impulse data, RSVPs, and
            associated embeddings will be permanently removed from our
            production database.
          </li>
          <li>
            Backup copies may persist for a limited period (typically no more
            than 30 days) as part of standard disaster recovery practices.
          </li>
          <li>
            Anonymized aggregate data derived from your usage may be retained
            for analytics purposes.
          </li>
        </ul>
        <p>
          We may suspend or terminate your account at any time, with or
          without notice, for any reason including but not limited to
          violations of these Terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>13. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
          WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
          BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
        </p>
        <p>
          WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
          ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR
          SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </p>
        <p>
          WE MAKE NO REPRESENTATIONS OR WARRANTIES ABOUT THE ACCURACY,
          COMPLETENESS, OR RELIABILITY OF IMPULSE INSIGHTS, AI-GENERATED
          CONTENT, OR USER-GENERATED CONTENT.
        </p>
      </section>

      <section className="legal-section">
        <h2>14. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
          ONE MOMENTS LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS,
          DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul>
          <li>Your access to, use of, or inability to access or use the Service.</li>
          <li>Any conduct or content of any third party or user on the Service.</li>
          <li>Any content obtained from the Service.</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
          <li>Attendance at any event listed on or RSVP&apos;d through the Service.</li>
        </ul>
        <p>
          IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED ONE HUNDRED US
          DOLLARS ($100.00) OR THE AMOUNT YOU HAVE PAID US IN THE TWELVE
          MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.
        </p>
      </section>

      <section className="legal-section">
        <h2>15. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless One Moments LLC
          and its affiliates, officers, directors, employees, and agents from
          and against any claims, liabilities, damages, losses, costs, or
          expenses (including reasonable attorneys&apos; fees) arising from or
          related to: (a) your use of the Service; (b) your violation of
          these Terms; (c) your User Content; or (d) your violation of any
          third-party rights.
        </p>
      </section>

      <section className="legal-section">
        <h2>16. Governing Law and Dispute Resolution</h2>
        <p>
          These Terms shall be governed by and construed in accordance with
          the laws of the State of New Jersey, without regard to its conflict
          of law principles. You agree that any legal action or proceeding
          arising out of or relating to these Terms shall be brought
          exclusively in the state or federal courts located in New Jersey,
          and you consent to the jurisdiction of such courts.
        </p>
        <p>
          <strong>Informal resolution.</strong> Before filing any formal
          dispute, you agree to first contact us at the address below and
          attempt to resolve the matter informally for at least 30 days.
        </p>
      </section>

      <section className="legal-section">
        <h2>17. Changes to These Terms</h2>
        <p>
          We may modify these Terms at any time by posting the updated Terms
          on this page and updating the &ldquo;Last updated&rdquo; date. Your
          continued use of the Service after such changes constitutes your
          acceptance of the new Terms. For material changes, we will make
          reasonable efforts to notify users via the Service or the contact
          information on file.
        </p>
      </section>

      <section className="legal-section">
        <h2>18. Miscellaneous</h2>
        <p>
          <strong>Entire Agreement.</strong> These Terms, together with our
          Privacy Policy, constitute the entire agreement between you and One
          Moments LLC regarding the Service and supersede any prior
          agreements.
        </p>
        <p>
          <strong>Severability.</strong> If any provision of these Terms is
          held to be invalid or unenforceable, the remaining provisions shall
          continue in full force and effect.
        </p>
        <p>
          <strong>Waiver.</strong> Our failure to enforce any right or
          provision of these Terms will not be considered a waiver of that
          right or provision.
        </p>
        <p>
          <strong>Assignment.</strong> You may not assign or transfer these
          Terms. We may assign our rights and obligations under these Terms
          without restriction.
        </p>
      </section>

      <section className="legal-section">
        <h2>19. Contact</h2>
        <p>
          Questions about these Terms can be directed to:
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
