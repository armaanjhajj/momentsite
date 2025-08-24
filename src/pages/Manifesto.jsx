import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../components/BackgroundAnimation';
import '../App.scss';

function Manifesto() {
  return (
    <>
      <BackgroundAnimation />
      <div className="App manifesto-page">
        <header className="site-header">
        <Link to="/" className="brand">
          <img
            className="brand-logo"
            src="https://i.imgur.com/ZkIkMD6.png"
            alt="moments asterisk"
            decoding="async"
            loading="eager"
          />
        </Link>
          <div className="header-spacer"></div>
        </header>

        <main className="manifesto-main">
          {/* Manifesto Section */}
          <section className="manifesto-section">
            <div className="manifesto-container">
              <h1 className="manifesto-title">The Moments Manifesto</h1>
              <div className="manifesto-content">
                <p>We weren't meant to live behind screens.<br />
                We weren't meant to swipe left on strangers or scroll past potential friends.<br />
                We were meant to meet — here, now, face to face.</p>

                <p>Moments exists because too many real connections slip away.<br />
                That smile across the café.<br />
                That person in your lecture hall you almost talked to.<br />
                That chance encounter at a bar, gone before you made the first move.</p>

                <p className="manifesto-emphasis">We're done missing them.</p>

                <p>This isn't a feed.<br />
                This isn't a game of likes, swipes, or endless profiles.<br />
                This is presence.<br />
                This is urgency.<br />
                This is human.</p>

                <p>On Moments, your phone is just the spark.<br />
                The connection? That's real.<br />
                In a world that glorifies digital noise, we choose real-life signals.<br />
                We choose courage over comfort.<br />
                We choose spontaneity over curation.<br />
                We choose people — not profiles.</p>

                <p>Because the best stories don't start with a DM.<br />
                They start with "hey."</p>

                <p className="manifesto-tagline">Turn real-life encounters into real connections.<br />
                <strong>That's Moments.</strong></p>
              </div>
            </div>
          </section>

          {/* Founders Message Section */}
          <section className="founders-section">
            <div className="founders-container">
              <h2 className="founders-title">From the Founders</h2>
              <div className="founders-message">
                <p className="founders-quote">"We built Moments because we were tired of missing out on the connections that matter most — the ones happening right in front of us."</p>
                
                <p className="founders-story">Too many times, we found ourselves in crowded lecture halls, bustling coffee shops, and vibrant campus events, surrounded by hundreds of people our age, yet somehow still disconnected. We'd see someone interesting, feel that spark of curiosity, but let the moment pass. Sound familiar?</p>
                
                <p className="founders-vision">Moments isn't about replacing real interaction — it's about enabling it. We're not trying to create another social media platform. We're building a bridge between digital discovery and real-world connection. A tool that helps you turn "I wish I had talked to them" into "I'm glad I did."</p>
                
                <p className="founders-closing">College is short. These moments are fleeting. Let's make sure we don't miss them.</p>
                
                <div className="founders-signature">
                  <span className="founders-names">— Armaan & Simeon</span>
                  <span className="founders-title-text">Co-founders, Moments</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="mailto:makemomentsapp@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default Manifesto;
