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
          <div className="legal-container" style={{ maxWidth: '1200px' }}>
            <h1>join the team</h1>
            <p>We’re building real-world connection tech. If that excites you, let’s talk.</p>

            <section>
              <h2>Open roles</h2>
              <div className="role-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <div className="card" style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16 }}>
                  <div className="job-title">🌐 Digital Marketing</div>
                  <div className="job-meta">Focus: Creating the online presence that gets students curious and excited.</div>
                  <ul className="job-desc" style={{ marginTop: 8 }}>
                    <li>Brainstorm & draft engaging Instagram/TikTok content</li>
                    <li>Manage post scheduling, captions, and engagement</li>
                    <li>Help track reach, analytics, and trends</li>
                    <li>Support with newsletters and email campaigns</li>
                  </ul>
                  <div className="job-perfect">Perfect for: Social media-savvy students who want to learn how real brand growth works.</div>
                </div>

                <div className="card" style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16 }}>
                  <div className="job-title">🏫 Field Operations</div>
                  <div className="job-meta">Focus: Putting Moments in front of students IRL.</div>
                  <ul className="job-desc" style={{ marginTop: 8 }}>
                    <li>Table at student centers, dorms, and events</li>
                    <li>Hand out flyers/bracelets/stickers to spread awareness</li>
                    <li>Run “street team” activations (flash meetups, chalking, demos)</li>
                    <li>Collect quick student feedback during tabling</li>
                  </ul>
                  <div className="job-perfect">Perfect for: Outgoing students who love talking to people and building buzz on campus.</div>
                </div>

                <div className="card" style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16 }}>
                  <div className="job-title">📣 Marketing Outreach</div>
                  <div className="job-meta">Focus: Building bridges with orgs, frats/sororities, and campus leaders.</div>
                  <ul className="job-desc" style={{ marginTop: 8 }}>
                    <li>Reach out to student clubs for partnerships</li>
                    <li>Coordinate collabs with fraternities/sororities</li>
                    <li>Help Moments get into the campus conversation</li>
                    <li>Maintain a list of org contacts for follow-ups</li>
                  </ul>
                  <div className="job-perfect">Perfect for: Networkers with connections in student life who love organizing.</div>
                </div>

                <div className="card" style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16 }}>
                  <div className="job-title">🎨 GFX & Design</div>
                  <div className="job-meta">Focus: Giving Moments a strong visual identity.</div>
                  <ul className="job-desc" style={{ marginTop: 8 }}>
                    <li>Design social graphics, posters, flyers, and digital assets</li>
                    <li>Develop templates for consistent brand style</li>
                    <li>Collaborate on campaign visuals</li>
                    <li>Explore creative meme-style content for virality</li>
                  </ul>
                  <div className="job-perfect">Perfect for: Designers who want a portfolio of real startup branding work.</div>
                </div>

                <div className="card" style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16 }}>
                  <div className="job-title">🎥 Film & Photography</div>
                  <div className="job-meta">Focus: Capturing the Moments story on camera.</div>
                  <ul className="job-desc" style={{ marginTop: 8 }}>
                    <li>Shoot content at events, tabling, and staged campaigns</li>
                    <li>Edit reels/TikToks with transitions, captions, and effects</li>
                    <li>Take headshots or group photos for press kits</li>
                    <li>Support production of the Moments launch video</li>
                  </ul>
                  <div className="job-perfect">Perfect for: Creatives who love telling stories through visuals.</div>
                </div>

                <div className="card" style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16 }}>
                  <div className="job-title">💻 Development (Tech Team)</div>
                  <div className="job-meta">Focus: Building the product, site, and team tools.</div>
                  <ul className="job-desc" style={{ marginTop: 8 }}>
                    <li>Contribute to the Moments web app (React, Supabase, Tailwind)</li>
                    <li>Help with waitlist, onboarding flows, and team dashboard</li>
                    <li>Debug and polish user experience</li>
                    <li>Explore wearable/bracelet prototypes (hardware + NFC)</li>
                  </ul>
                  <div className="job-perfect">Perfect for: CS/tech students who want startup dev experience.</div>
                </div>
              </div>
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

            <section>
              <h2>How to apply</h2>
              <p>
                Email <a href="mailto:intern@havemoments.com">intern@havemoments.com</a> with your role of interest, links (portfolio, GitHub, LinkedIn), and 2–3 sentences on why Moments.
              </p>
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
