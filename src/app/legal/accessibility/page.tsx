export default function Accessibility() {
  return (
    <main className="container py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-semibold">Accessibility Statement</h1>
        <p className="mt-2 text-white/70 italic">Our commitment to inclusive, usable experiences.</p>
        <div className="mt-2 text-sm text-white/60"><strong>Last Updated:</strong> September 23, 2025</div>
      </header>

      <hr className="mt-6 border-white/10" />

      <article className="prose prose-invert max-w-3xl mt-8 prose-headings:tracking-tight prose-h2:text-2xl md:prose-h2:text-3xl prose-p:leading-relaxed">

      <p>
        At Moments, our mission is to help people connect in real life. That means making sure everyone,
        regardless of ability, can access and enjoy our Services.
      </p>
      <p>
        We are committed to creating an inclusive app and website experience that works for as many people
        as possible.
      </p>

      <h2>1. Our Commitment</h2>
      <ul>
        <li>We design and build Moments with accessibility in mind from the start.</li>
        <li>We strive to follow WCAG 2.1 Level AA guidelines.</li>
        <li>
          We regularly test with assistive technologies (screen readers, voice control, keyboard navigation)
          to identify and fix barriers.
        </li>
        <li>We make accessibility a shared responsibility across our teams.</li>
      </ul>

      <h2>2. Features That Support Accessibility</h2>
      <ul>
        <li><strong>Screen Reader Support:</strong> App and website elements are labeled for clarity.</li>
        <li><strong>Keyboard Navigation:</strong> Core functions are operable without a mouse or touchscreen.</li>
        <li><strong>Color Contrast:</strong> We use palettes that meet contrast standards.</li>
        <li><strong>Text Scaling:</strong> We respect device-level font size and display settings.</li>
        <li><strong>Alternative Input:</strong> Core actions are accessible via multiple input methods.</li>
        <li>
          <strong>Captions & Text Alternatives:</strong> We provide text alternatives where possible for
          non-text content.
        </li>
      </ul>

      <h2>3. Ongoing Efforts</h2>
      <ul>
        <li>Audit Moments for accessibility gaps.</li>
        <li>Train our team on inclusive design and development.</li>
        <li>Incorporate user feedback into improvements.</li>
      </ul>

      <h2>4. Feedback and Support</h2>
      <p>If you experience any accessibility barriers, please let us know:</p>
      <p>
        Moments Accessibility Team<br />
        New Brunswick, NJ<br />
        Email: <a href="mailto:accessibility@havemoments.com">accessibility@havemoments.com</a>
      </p>
      <p>We aim to respond to accessibility-related inquiries within 7 business days.</p>

      <h2>5. Future Goals</h2>
      <ul>
        <li>Expand compatibility testing with more assistive technologies.</li>
        <li>Provide detailed accessibility documentation.</li>
        <li>Add in-app accessibility settings (e.g., motion reduction, high-contrast mode).</li>
      </ul>

      <p>© 2025 Moments. All Rights Reserved.</p>
      </article>
    </main>
  );
}

