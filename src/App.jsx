import React, { useState } from 'react';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="site-header">
        <div className="brand">
          <img
            className="brand-asterisk"
            src="https://i.imgur.com/WZvHbcj.png"
            alt="moments asterisk"
            decoding="async"
            loading="eager"
          />
          <span className="brand-name">moments</span>
        </div>
      </header>
      
      <section className="hero">
        <div className="hero-heading">
          <div className="hero-title-wrap">
            <h1 className="hero-title">The in-person social network.</h1>
          </div>
        </div>
        
        <div className="hero-phone">
          <PhoneDemo />
        </div>
        
        <div className="hero-details">
          <ul className="big-bullets">
            <li>😊 Meaningful connections</li>
            <li>⚠️ Spontaneous moments</li>
            <li>🤳 Authentic real life</li>
          </ul>
          <p className="big-copy">
            Every day, get a notification to make a Moment — connect authentically with new people and friends in real life, whether it's meeting one-on-one or joining group events.
          </p>
          <EarlyAccessCTA />
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-left">&copy; {new Date().getFullYear()} moments</div>
        <nav className="footer-nav">
          <a href="/terms">terms</a>
          <a href="/privacy">privacy</a>
          <a href="mailto:hello@makemoments.app">contact</a>
        </nav>
      </footer>
    </div>
  );
}

function PhoneDemo() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-topbar">
          <div className="phone-brand">
            <img
              className="phone-brand-logo"
              src="https://i.imgur.com/WZvHbcj.png"
              alt="moments asterisk"
              decoding="async"
              loading="eager"
            />
          </div>
        </div>
        <div className="phone-cards">
          <div className="phone-card primary">
            <div className="pill">ALEX</div>
            <div className="card-title">marketing major • huge Drake fan</div>
            <div className="card-year">Sophomore</div>
            <div className="avatars">
              <div className="avatar dark">AK</div>
              <div className="avatar light">SJ</div>
              <div className="avatar light">92%</div>
            </div>
          </div>
          <div className="phone-card surface">
            <div className="row">
              <span className="icon">📍</span>
              <span>student center, main atrium</span>
            </div>
            <div className="row between">
              <div className="row">
                <span className="icon">⏰</span>
                <span>today • 7:30 pm</span>
              </div>
              <button className="small-cta">confirm</button>
            </div>
          </div>
          <div className="countdown-card">
            <div className="countdown-label">moment starts in</div>
            <div className="countdown-time">00:00:23</div>
          </div>
        </div>
        <MomentsNearby />
      </div>
      <img
        className="phone-underlay"
        src="https://i.imgur.com/bTFDcto.jpeg"
        alt=""
        decoding="async"
        loading="eager"
        aria-hidden
      />
      <img
        className="phone-overlay"
        src="https://i.imgur.com/R99AcWp.png"
        alt=""
        decoding="async"
        loading="eager"
        aria-hidden
      />
    </div>
  );
}

function MomentsNearby() {
  const items = [
    { id: 1, icon: '👥', title: 'orgo study group', meta: 'alexander library • now' },
    { id: 2, icon: '🎶', title: 'boiler room', meta: 'delta sigma pi • 9pm' },
    { id: 3, icon: '🏃‍♀️', title: 'run club', meta: 'johnson park • in 30 min' },
  ];

  return (
    <div className="nearby-section">
      <div className="nearby-title">moments happening nearby</div>
      <div className="nearby-list">
        {items.map(item => (
          <div key={item.id} className="nearby-item">
            <div className="nearby-left">
              <div className="nearby-icon" aria-hidden>
                <span>{item.icon}</span>
              </div>
              <div className="nearby-text">
                <div className="nearby-title-line">{item.title}</div>
                <div className="nearby-meta">{item.meta}</div>
              </div>
            </div>
            <button className="small-cta" type="button">join</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EarlyAccessCTA() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const onSubmit = (e) => {
    e.preventDefault();
    setMessage('Thanks! We will be in touch.');
    setEmail('');
  };
  
  return (
    <form className="email-cta" onSubmit={onSubmit} noValidate>
      <div className="email-cta-main">
        <input
          type="tel"
          className="email-field"
          placeholder="ENTER PHONE NUMBER TO RSVP"
          aria-label="Enter phone number to RSVP"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[^0-9]/g, ''))}
          required
        />
      </div>
      <button type="submit" className="email-cta-arrow" aria-label="Submit">→</button>
      {message && <div style={{ gridColumn: '1 / span 2', paddingTop: 8, fontSize: 12, color: '#0B0F13' }}>{message}</div>}
    </form>
  );
}

export default App;