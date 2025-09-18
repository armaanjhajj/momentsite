import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.scss';

function QR1() {
  return (
    <>
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
          </Link>
        </header>

        <main className="qr1-content">
          <div className="qr1-container">
            <div className="video-container">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/hmibjZGhyX0?si=cw95PPau7gKlbRuP" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="cta-section">
              <Link to="/waitlist" className="join-waitlist-btn">
                Join Waitlist
              </Link>
              <p className="launch-date">Launching October 1st</p>
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

export default QR1;
