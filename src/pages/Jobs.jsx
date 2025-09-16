import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.scss';

function Jobs() {
  return (
    <>
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img
              className="brand-logo"
              src={logo}
              alt="moments logo"
              decoding="async"
              loading="eager"
            />
          </Link>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/waitlist">Waitlist</Link>
          </nav>
        </header>

        <main className="legal-content">
          <div className="legal-container" style={{ maxWidth: '1100px' }}>
            <h1>Open Positions</h1>
            <p>We are assembling a disciplined, high-ownership team to launch Moments on campus. Roles are listed below.</p>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <h2 style={{ margin: 0 }}>Digital Marketing</h2>
                <p style={{ margin: '8px 0 12px' }}>Create an online presence that drives curiosity and demand.</p>
                <ul>
                  <li>Draft Instagram/TikTok content and iterate with data</li>
                  <li>Manage scheduling, captions, and engagement</li>
                  <li>Track reach, analytics, and trends</li>
                  <li>Support newsletters and email campaigns</li>
                </ul>
                <p><strong>Ideal profile:</strong> Social-first thinker who understands growth mechanics.</p>
              </div>

              <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <h2 style={{ margin: 0 }}>Field Operations</h2>
                <p style={{ margin: '8px 0 12px' }}>Drive IRL adoption and feedback loops on campus.</p>
                <ul>
                  <li>Table at student centers, dorms, and events</li>
                  <li>Distribute flyers/bracelets/stickers</li>
                  <li>Run street-team activations (demos, chalking)</li>
                  <li>Collect quick feedback during tabling</li>
                </ul>
                <p><strong>Ideal profile:</strong> Clear communicator who enjoys speaking with students.</p>
              </div>

              <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <h2 style={{ margin: 0 }}>Marketing Outreach</h2>
                <p style={{ margin: '8px 0 12px' }}>Build relationships with orgs and campus leaders.</p>
                <ul>
                  <li>Partner with student clubs and organizations</li>
                  <li>Coordinate with fraternities/sororities</li>
                  <li>Establish word-of-mouth programs</li>
                  <li>Maintain a structured contact log for follow-ups</li>
                </ul>
                <p><strong>Ideal profile:</strong> Organized networker with campus relationships.</p>
              </div>

              <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <h2 style={{ margin: 0 }}>Design</h2>
                <p style={{ margin: '8px 0 12px' }}>Elevate our visual identity across digital and print.</p>
                <ul>
                  <li>Create social graphics, posters, and flyers</li>
                  <li>Develop reusable templates (colors, typography)</li>
                  <li>Collaborate on campaign creative</li>
                  <li>Explore content formats optimized for sharing</li>
                </ul>
                <p><strong>Ideal profile:</strong> Portfolio demonstrating clean, consistent brand work.</p>
              </div>

              <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <h2 style={{ margin: 0 }}>Film & Photography</h2>
                <p style={{ margin: '8px 0 12px' }}>Tell the Moments story through video and stills.</p>
                <ul>
                  <li>Capture content at events and activations</li>
                  <li>Edit reels/TikToks with on-brand pacing</li>
                  <li>Shoot headshots or group photos for press</li>
                  <li>Assist with the launch video</li>
                </ul>
                <p><strong>Ideal profile:</strong> Strong eye for narrative and motion.</p>
              </div>

              <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <h2 style={{ margin: 0 }}>Engineering</h2>
                <p style={{ margin: '8px 0 12px' }}>Contribute to product, site, and internal tools.</p>
                <ul>
                  <li>Work on the web app (React, Supabase, Tailwind)</li>
                  <li>Improve waitlist/onboarding and team dashboard</li>
                  <li>Polish UX and fix bugs</li>
                  <li>Explore wearable/NFC prototypes</li>
                </ul>
                <p><strong>Ideal profile:</strong> Builder who ships, tests, and iterates quickly.</p>
              </div>
            </section>

            <section>
              <h2>Schedule a conversation</h2>
              <div className="calendar-embed">
                <iframe
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3wajatrcDcPcpcXcp09pOU7gJ1TovcauFfKPAGgzBjVhIOm40UpuT-eAK0_veCKR76yoyv7FLN?gv=true"
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Moments scheduling"
                />
              </div>
            </section>

            <section>
              <h2>Apply</h2>
              <p>Email <a href="mailto:intern@havemoments.com">intern@havemoments.com</a> with your role of interest, links (portfolio, GitHub, LinkedIn), and 2–3 sentences on why Moments.</p>
              <p style={{ opacity: 0.8, fontSize: '0.95em' }}>Note: All internships are unpaid.</p>
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
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/consent">Consent</Link>
            <Link to="/login">Team</Link>
            <a href="mailto:contact@havemoments.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default Jobs;
