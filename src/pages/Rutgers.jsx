import React from 'react';

export default function Rutgers() {
  return (
    <div className="App">
      <main className="legal-content">
        <div className="legal-container" style={{ maxWidth: '900px' }}>
          <h1>Moments at Rutgers</h1>
          <p>All launch info, events, and campus-specific updates will live here.</p>
          <a href="/waitlist" className="back-home" style={{ display: 'inline-block', marginTop: 16 }}>Join Rutgers Waitlist</a>
        </div>
      </main>
    </div>
  );
}


