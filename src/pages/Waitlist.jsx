import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.scss';

function Waitlist() {
  return (
    <>
      <div className="App">
        {/* Global header used */}

        <main className="legal-content">
          <div className="legal-container" style={{ maxWidth: '900px' }}>
            <h1>Join the Waitlist</h1>
            <p style={{ textAlign: 'center' }}>Be first to hear when Moments launches on your campus.</p>

            <section>
              <form className="launchlist-form" action="https://getlaunchlist.com/s/PS7heZ" method="POST" style={{ display: 'grid', gap: 12 }}>
                <input name="name" type="text" placeholder="Name" style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e5e5' }} />
                <input name="email" type="email" placeholder="Email (required)" required style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e5e5' }} />
                <button type="submit" className="manifesto-link" style={{ borderColor: '#000',  alignSelf: 'start' }}>Sign Up</button>
              </form>
            </section>

            <section>
              <div className="leaderboard-wrapper">
                <h2>Leaderboard</h2>
                <iframe
                  scrolling="yes"
                  src="https://getlaunchlist.com/w/e/PS7heZ/leaderboard"
                  className="leaderboard-iframe"
                  title="Waitlist Leaderboard"
                />
              </div>
            </section>

            <div className="legal-footer">
              <Link to="/" className="back-home">← Back to Home</Link>
            </div>
          </div>
        </main>

        {/* Global footer used */}
      </div>
    </>
  );
}

export default Waitlist;
