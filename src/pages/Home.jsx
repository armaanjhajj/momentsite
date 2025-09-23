import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';
import phoneFrame from '../assets/apple-iphone-16-pro-max-2024-medium.png';

function Home() {
  return (
    <div className="App" style={{ maxWidth: 'none', borderRadius: 0 }}>
      <main className="hero" style={{ padding: '3rem 0 4rem' }}>
        <section className="hero-heading">
          <div className="hero-title-wrap">
            <h1 className="hero-title">Real connections, on your campus.</h1>
          </div>
          <p className="rsvp-text" style={{ maxWidth: 560 }}>
            Moments matches you with nearby students you’re most likely to vibe with.
            No feeds. No swipes. Just say "hey."
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link to="/waitlist" className="manifesto-link">Join waitlist</Link>
            <Link to="/features" className="manifesto-link" style={{ background: '#fff', color: '#000' }}>See features</Link>
          </div>
        </section>

        <section className="hero-phone">
          <div className="phone-container">
            <img src={phoneFrame} alt="Phone frame" />
            <div className="phone-overlay-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#111', marginBottom: 8 }}>
                <span>9:27</span>
                <span>
                  <span style={{ marginRight: 8 }}>Wi‑Fi</span>
                  <span>100%</span>
                </span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 24, padding: '18px 16px', textAlign: 'left', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', color: '#111', marginBottom: 6 }}>alex</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>in your econ class</div>
                <div style={{ fontSize: 13, color: '#3f3f46', marginBottom: 12 }}>both listen to Ken Carson + love raving</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#111', border: '1px solid #111', borderRadius: 9999, padding: '6px 10px' }}>
                  <span>business building</span>
                  <span>•</span>
                  <span>5:45 PM</span>
                </div>
              </div>
              <div style={{ height: 6, width: 120, background: '#e5e5e5', borderRadius: 9999, margin: '18px auto 0' }} />
            </div>
          </div>
        </section>

        <section className="hero-details">
          <ul className="micro-bullets" style={{ color: '#000' }}>
            <li>Designed for fast, in-person connections</li>
            <li>High-signal matches based on shared context</li>
            <li>Campus-first, privacy-forward</li>
          </ul>
          <div style={{ marginTop: 16 }}>
            <Link to="/manifesto" className="manifesto-link">Read the manifesto</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
