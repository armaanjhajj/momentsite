import React from 'react';

export default function FAQ() {
  return (
    <div className="App">
      <main className="legal-content">
        <div className="legal-container" style={{ maxWidth: '900px' }}>
          <h1>FAQ</h1>
          <section>
            <h2>What is Moments?</h2>
            <p>Moments helps students turn missed connections into real meet-ups on campus.</p>
          </section>
          <section>
            <h2>Is it safe?</h2>
            <p>Yes. We use privacy-first defaults, minimal data, and let you control visibility.</p>
          </section>
          <section>
            <h2>When is it launching?</h2>
            <p>Join the waitlist to get notified as we roll out across campuses.</p>
          </section>
        </div>
      </main>
    </div>
  );
}


