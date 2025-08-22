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

      {/* Liquid-glass scene is scoped INSIDE the white frame */}
      <section className="hero lg-root">

        {/* Left column — glass pane */}
        <div className="hero-heading lg-pane lg-pane--tight">
          <div className="hero-title-wrap">
            <h1 className="hero-title">The in-person social network.</h1>
          </div>
        </div>

        {/* Phone — wrapped in a stronger glass slab */}
        <div className="hero-phone">
          <div className="lg-pane lg-pane--phone">
            <PhoneDemo />
          </div>
        </div>

        {/* Right column — glass pane */}
        <div className="hero-details lg-pane">
          
          <EarlyAccessCTA />
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-left">
          &copy; {new Date().getFullYear()}&nbsp;&nbsp;&nbsp;&nbsp;moments
        </div>
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
          <div className="phone-status-bar">
            <div className="status-left">
              <img
                className="status-time"
                src="https://i.imgur.com/KKAfgbH.png"
                alt="signal wifi battery"
                decoding="async"
                loading="eager"
              />
            </div>
            <div className="status-right">
              <img
                className="status-symbols"
                src="https://i.imgur.com/b1QsrHK.png"
                alt="9:27"
                decoding="async"
                loading="eager"
              />
            </div>
          </div>
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

      {/* Keep your existing overlays; these sit above the phone-screen */}
      <img
        className="phone-underlay"
        src="https://i.imgur.com/bTFDcto.jpeg"
        alt="iPhone status bar overlay"
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
        {items.map((item) => (
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
            <button className="small-cta" type="button">
              join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EarlyAccessCTA() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length === 10) setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="email-cta submitted">
        <div className="email-cta-main submitted">
          <span className="thanks-message">Thanks! We'll keep in touch.</span>
        </div>
        <div className="email-cta-arrow submitted" />
      </div>
    );
  }

  return (
    <form className="email-cta" onSubmit={onSubmit} noValidate>
      <div className="email-cta-main">
        <input
          type="tel"
          className="email-field"
          placeholder="ENTER PHONE NUMBER TO RSVP"
          aria-label="Enter phone number to RSVP"
          value={phoneNumber}
          onChange={handlePhoneChange}
          maxLength={14}
          required
        />
      </div>
      <button type="submit" className="email-cta-arrow" aria-label="Submit">
        →
      </button>
    </form>
  );
}

export default App;
