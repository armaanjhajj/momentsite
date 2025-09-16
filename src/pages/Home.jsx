import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';
import heroVideo from '../assets/video.mp4';
import logo from '../assets/logo.png';

function Home() {
  return (
    <>
      <div className="App" style={{ maxWidth: 'none', borderRadius: 0 }}>
        <header className="site-header" style={{ margin: '0.75rem 0' }}>
        <Link to="/" className="brand">
            <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
          </Link>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
          </nav>
        </header>

        <main style={{ position: 'relative', width: '100%', height: 'calc(100vh - 160px)', background: '#000' }}>
          <video
            src={heroVideo}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }}
            playsInline
            autoPlay
            muted
            loop
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 className="hero-title" style={{ color: '#fff', textAlign: 'center' }}>real connections, in real time</h1>
          </div>
        </main>

        <section style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', gap: 12 }}>
            <Link to="/about" className="manifesto-link" style={{ borderColor: '#000', color: '#000' }}>About</Link>
            <Link to="/jobs" className="manifesto-link" style={{ borderColor: '#000', color: '#000' }}>Jobs</Link>
          </div>
        </section>

        <footer className="site-footer" style={{ background: 'rgba(255,255,255,0.7)' }}>
        <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
        <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
          <Link to="/manifesto">Manifesto</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          <Link to="/consent">Consent</Link>
            <Link to="/login">Team</Link>
          <a href="mailto:makemomentsapp@gmail.com">Contact</a>
        </nav>
      </footer>
      </div>
    </>
  );
}

export default Home;
