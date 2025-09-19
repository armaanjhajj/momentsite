import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="site-footer footer-global" style={{ background: 'rgba(255,255,255,0.7)' }}>
      <div className="footer-inner">
        <div className="footer-watermark-local" aria-hidden>
          {/* Large logo sits inside footer and behind links */}
          <Logo className="w-full text-black/10" />
        </div>
        <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
        <nav className="footer-nav">
          <Link to="/about">About</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/waitlist">Waitlist</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/consent">Consent</Link>
          <a href="mailto:contact@havemoments.com">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
