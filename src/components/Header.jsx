import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Header() {
  return (
    <header className="site-header" style={{ margin: '1rem 0' }}>
      <Link to="/" className="brand">
        <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
      </Link>
      <nav className="footer-nav" aria-label="Primary">
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
        <NavLink to="/community">Community</NavLink>
        <NavLink to="/press">Press</NavLink>
        <NavLink to="/team">Team</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/download">Download</NavLink>
        <NavLink to="/waitlist">Waitlist</NavLink>
      </nav>
    </header>
  );
}


