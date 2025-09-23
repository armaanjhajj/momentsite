import React from 'react';

export default function Download() {
  return (
    <div className="App">
      <main className="legal-content">
        <div className="legal-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h1>Download</h1>
          <p>Moments is launching soon. Get notified when it’s live on your campus.</p>
          <a href="/waitlist" className="back-home" style={{ display: 'inline-block', marginTop: 16 }}>Join Waitlist</a>
        </div>
      </main>
    </div>
  );
}


