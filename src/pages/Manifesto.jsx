import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';

function Manifesto() {
  return (
    <>
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img
              className="brand-logo"
              src="https://i.imgur.com/WZvHbcj.png"
              alt="moments asterisk"
              decoding="async"
              loading="eager"
            />
          </Link>
        </header>

        <main className="legal-content">
          <div className="legal-container">
            <h1>moments — a manifesto</h1>
            
            <section>
              <p>We weren't built to live life through screens.<br />
              We weren't built to swipe past strangers or scroll past people we could've met.<br />
              We were built to connect right here, right now, face to face.</p>
            </section>

            <section>
              <p>Moments exists because too many connections slip away before they even start.<br />
              That smile across the café.<br />
              That person in your lecture hall you almost talked to.<br />
              That spark at a party, gone before you made a move.</p>
            </section>

            <section>
              <h2>We're done missing them.</h2>
              <p>This isn't a feed.<br />
              It's not a game of swipes, likes, or endless profiles.<br />
              This is presence.<br />
              This is urgency.<br />
              This is human.</p>
            </section>

            <section>
              <p>On Moments, your phone isn't the connection, it's just the spark.<br />
              The real connection? That happens off-screen.</p>
            </section>

            <section>
              <p>In a world drowning in noise, we're choosing something different:<br />
              Real-life signals over digital distractions.<br />
              Courage over comfort.<br />
              Spontaneity over curation.<br />
              People over profiles.</p>
            </section>

            <section>
              <p>Because the best stories don't start with a DM.<br />
              They start with a simple "hey."</p>
            </section>

            <section>
              <h2>Turn passing encounters into lasting connections.</h2>
              <p>For the missed connections and the ones you never even knew existed. That's what Moments is for.</p>
            </section>

            <section>
              <h2>From the Founders</h2>
              <p className="founders-quote">We built Moments because we were tired of watching real connections slip through our fingers.</p>
              
              <p>There were too many times we sat in lecture halls, coffee shops, and campus events, surrounded by hundreds of people and still felt disconnected. We'd notice someone interesting, feel that little spark, and let the moment pass. If that's ever happened to you, you get it.</p>
              
              <p>Moments isn't here to replace real interaction, it's here to make it easier. We're not trying to be another social media app. We're building a bridge between digital discovery and real-world connection, a tool that helps you turn "I wish I'd said something" into "I'm glad I did."</p>
              
              <p>College is short. These moments are fleeting.<br />
              Let's not miss them.</p>
              
              <div className="founders-signature">
                <span className="founders-names">— Armaan & Simeon</span>
                <span className="founders-title-text">Co-founders, Moments</span>
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
            <Link to="/manifesto">Manifesto</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/consent">Consent</Link>
            <Link to="/jobs">Jobs</Link>
            <a href="mailto:makemomentsapp@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default Manifesto;
