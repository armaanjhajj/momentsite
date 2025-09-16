import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.scss';

function Waitlist() {
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

        <main className="legal-content">
          <div className="legal-container" style={{ maxWidth: '900px' }}>
            <h1>Join the Waitlist</h1>
            <p style={{ textAlign: 'center' }}>Be first to hear when Moments launches on your campus.</p>

            <section>
              <form className="launchlist-form" action="https://getlaunchlist.com/s/PS7heZ" method="POST" style={{ display: 'grid', gap: 12 }}>
                <input name="name" type="text" placeholder="Name" style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e5e5' }} />
                <input name="email" type="email" placeholder="Email (required)" required style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e5e5' }} />
                <button type="submit" className="manifesto-link" style={{ borderColor: '#000', color: '#000', alignSelf: 'start' }}>Sign Up</button>
              </form>
            </section>

            <section>
              <h2>Leaderboard</h2>
              <div style={{ height: '60vh', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                <iframe
                  scrolling="yes"
                  src="https://getlaunchlist.com/w/e/PS7heZ/leaderboard"
                  style={{ width: '100%', display: 'block', border: 'none', height: '100%' }}
                  title="Waitlist Leaderboard"
                />
              </div>
            </section>

            <div className="legal-footer">
              <Link to="/" className="back-home">← Back to Home</Link>
            </div>
          </div>
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

export default Waitlist;
