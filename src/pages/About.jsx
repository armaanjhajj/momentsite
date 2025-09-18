import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import phoneFrame from '../assets/apple-iphone-16-pro-max-2024-medium.png';
import '../App.scss';

function About() {
  return (
    <>
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
          </Link>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/waitlist">Waitlist</Link>
          </nav>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', padding: '2rem 0 4rem' }}>
          <section style={{ paddingLeft: '1rem' }}>
            <h1 className="hero-title" style={{ lineHeight: 1.05, marginBottom: 16 }}>real connections, in real time</h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: 640, margin: 0 }}>
              Moments helps you meet the people around you you’re most likely to vibe with.
              It’s fast, in-person, and designed for campus life.
            </p>

            <ul style={{ marginTop: 20, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>See high-signal opportunities to meet nearby students</li>
              <li>Lock in a time and place instantly</li>
              <li>No feeds. No swipes. Just say “hey.”</li>
            </ul>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <Link to="/waitlist" className="manifesto-link" style={{ borderColor: '#000' }}>Join Waitlist</Link>
              <Link to="/jobs" className="manifesto-link" style={{ borderColor: '#000' }}>Jobs</Link>
            </div>
          </section>

          <section style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 420, maxWidth: '100%' }}>
              <img src={phoneFrame} alt="iPhone frame" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '76%' }}>
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
        </main>

        <footer className="site-footer">
          <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/waitlist">Waitlist</Link>
            <Link to="/manifesto">Manifesto</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/consent">Consent</Link>
            <Link to="/login">Team</Link>
            <a href="mailto:contact@havemoments.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default About;
