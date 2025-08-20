import React, { useState, useEffect } from 'react';
import './App.css';

// Main application component for the light‑themed Moments site.
// The layout takes inspiration from BeReal's marketing page but
// embraces Moments branding with a fresh accent colour and minimal
// explanatory copy. The right side hosts a rotating phone demo.
function App() {
  return (
    <div className="App">
      <header className="site-header">
        <img
          className="logo-image"
          src="https://i.postimg.cc/Prkyw9gt/finallogo.jpg"
          alt="moments asterisk"
          decoding="async"
          loading="eager"
        />
      </header>
      <section className="hero">
        <div className="hero-text">
          <div className="hero-title-wrap">
            <div className="hero-overline">the new way to meet</div>
            <h1 className="hero-title">
              <img
                className="hero-logo"
                src="https://i.imgur.com/FxWsdhb.jpeg"
                alt="moments logo"
                decoding="async"
                loading="eager"
              />
            </h1>
          </div>
          <ul className="features-list">
            <li><span className="emoji" role="img" aria-label="match">🤝</span><span>match — we find your people</span></li>
            <li><span className="emoji" role="img" aria-label="meet">📍</span><span>meet — pick a neutral spot & time</span></li>
            <li><span className="emoji" role="img" aria-label="moment">✨</span><span>moment — show up & connect</span></li>
          </ul>
          <p className="description">Every day, get a notification to share a genuine real life moment with someone nearby.</p>
          <EarlyAccessCTA />
        </div>
        <div className="hero-phone">
          <PhoneDemo />
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-left">&copy; {new Date().getFullYear()} moments</div>
        <nav className="footer-nav">
          <a href="#">terms</a>
          <a href="#">privacy</a>
          <a href="mailto:hello@makemoments.app">contact</a>
        </nav>
      </footer>
    </div>
  );
}

// A compact list of nearby moments with join buttons, presented inside the phone demo.
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

// PhoneDemo cycles through the match → meet → moment flow. The look and feel
// are adapted for a light theme, with subtle shadows and the global accent colour.
function PhoneDemo() {
  const [step, setStep] = useState(0);
  const steps = [
    { pill: 'match', title: 'we find your people', line: 'smart matching nearby' },
    { pill: 'meet', title: 'pick a meeting spot', line: 'a time & neutral location' },
    { pill: 'moment', title: 'show up & connect', line: 'no chats. only moments' },
  ];
  const criteriaSets = [
    { name: 'alex',   traits: ['lives at sephora', 'drake fan'],         year: 'sophomore' },
    { name: 'maria',  traits: ['valorant player', 'drinks boba'],        year: 'freshman'  },
    { name: 'zane',   traits: ['matcha enthusiast', 'gym bro'],          year: 'senior'    },
    { name: 'riya',   traits: ['enjoys gardening', 'rolling'],           year: 'junior'    },
    { name: 'hadi',   traits: ['shower-er', 'cs major'],                  year: 'freshman'  },
    { name: 'amir',   traits: ['league addict', 'poke bowl fan'],        year: 'sophomore' },
    { name: 'simeon', traits: ['thrifts', 'performs'],      year: 'junior'    },
    { name: 'armaan', traits: ['swaggy', 'runner'],          year: 'senior'    },
    { name: 'natasha',traits: ['pre-med', 'swiftie'],     year: 'junior'    },
    { name: 'owen',   traits: ['mkgee listener', 'hooper'],                year: 'freshman'  },
    { name: 'momo',   traits: ['smells weird', 'eats cheese'],                  year: 'sophomore' },
    { name: 'shar',   traits: ['likes to party', 'robloxer'],                    year: 'senior'    },
  ];
  const avatarPairs = [
    { left: 'AK', right: 'SJ' },
    { left: 'MT', right: 'RL' },
    { left: 'KP', right: 'ZN' },
    { left: 'AM', right: 'BR' },
    { left: 'HD', right: 'NT' },
    { left: 'AR', right: 'LM' },
    { left: 'SM', right: 'TS' },
    { left: 'AJ', right: 'GG' },
    { left: 'NS', right: 'DK' },
    { left: 'OW', right: 'JP' },
    { left: 'MM', right: 'KT' },
    { left: 'SR', right: 'LV' },
  ];
  const momentStrengths = [92, 86, 78, 88, 90, 84, 81, 95, 87, 83, 89, 91];

  useEffect(() => {
    const t = setInterval(() => setStep(s => s + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const idx = step % criteriaSets.length;
  const avatarIdx = step % avatarPairs.length;
  const strengthIdx = step % momentStrengths.length;

  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-topbar">
          <div className="phone-brand">
            <img
              className="phone-brand-logo"
              src="https://i.postimg.cc/Prkyw9gt/finallogo.jpg"
              alt="moments"
              decoding="async"
              loading="eager"
            />
          </div>
        </div>
        <MomentsNearby />
        <div className="phone-cards">
          <div className="phone-card primary">
            <div className="pill">{criteriaSets[idx].name.toUpperCase()}</div>
            <div className="card-title">{criteriaSets[idx].traits.join(' • ')}</div>
            <div className="card-year">{criteriaSets[idx].year}</div>
            <div className="avatars">
              <div className="avatar dark">{avatarPairs[avatarIdx].left}</div>
              <div className="avatar light">{avatarPairs[avatarIdx].right}</div>
              <div className="match">moment strength • {momentStrengths[strengthIdx]}%</div>
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
            <Countdown />
          </div>
        </div>
      </div>
    </div>
  );
}

function Countdown() {
  const [seconds, setSeconds] = useState(23);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 23)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return <div className="countdown-time">00:{mm}:{ss}</div>;
}

export default App;

function EarlyAccessCTA() {
  const [open, setOpen] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      className={`cta cta-bubble${open ? ' open' : ''}`}
      aria-expanded={open}
      onClick={() => setOpen(v => !v)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
    >
      <span className={`cta-label`}>GET EARLY ACCESS</span>
      <div className={`cta-choices${open ? ' show' : ''}`}>
        <button type="button" className="cta-choice">Rutgers SSO</button>
        <button type="button" className="cta-choice">Verify your rutgers.edu email</button>
      </div>
    </div>
  );
}