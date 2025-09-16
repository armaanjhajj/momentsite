import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';

function Jobs() {
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
            <h1>join the team</h1>
            <p>We’re building real-world connection tech. If that excites you, let’s talk.</p>

            <section>
              <h2>Open roles</h2>
              <ul className="jobs-list">
                <li>
                  <div className="job-item">
                    <div className="job-title">Founding Engineer (Mobile/Full-stack)</div>
                    <div className="job-meta">NYC • Hybrid • Full-time</div>
                    <div className="job-desc">Ship fast, own product surface areas, and help architect v1 to scale.</div>
                  </div>
                </li>
                <li>
                  <div className="job-item">
                    <div className="job-title">Campus Lead (Rutgers)</div>
                    <div className="job-meta">New Brunswick • Part-time • On-campus</div>
                    <div className="job-desc">Lead launch operations, ambassador programs, and local partnerships.</div>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h2>How to apply</h2>
              <p>
                Email us at <a href="mailto:makemomentsapp@gmail.com?subject=Jobs">makemomentsapp@gmail.com</a> with links (GitHub, LinkedIn, portfolio) and a couple sentences about why Moments.
              </p>
            </section>

            <section>
              <h2>Schedule a chat</h2>
              <p>Pick a time that works for you below.</p>
              <div className="calendar-embed">
                <iframe
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3wajatrcDcPcpcXcp09pOU7gJ1TovcauFfKPAGgzBjVhIOm40UpuT-eAK0_veCKR76yoyv7FLN?gv=true"
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Moments interview scheduling"
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
            <Link to="/manifesto">Manifesto</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/consent">Consent</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/login">Team</Link>
            <a href="mailto:makemomentsapp@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default Jobs;
