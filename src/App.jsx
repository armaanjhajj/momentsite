import React, { useState } from 'react';
import './App.scss';

function App() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [launchCountdown, setLaunchCountdown] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [countdown, setCountdown] = React.useState(33 * 60); // seconds

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('October 1, 2025 00:00:00').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setLaunchCountdown({ days, hours, minutes, seconds });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const cardTimer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        
        setTimeout(() => {
          setCurrentCardIndex(prev => (prev + 1) % 3);
          setIsAnimating(false);
        }, 600);
      }
    }, 3000);
    return () => clearInterval(cardTimer);
  }, [isAnimating]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const cards = [
    {
      name: "AAZAM",
      headline: "marketing major • huge Drake fan",
      subline: "Sophomore",
      reason: "Matched for shared music taste + overlapping class times.",
      location: "The Yard, by Starbucks",
      avatar: "https://i.imgur.com/nmlzmsq.jpeg",
      score: "92%"
    },
    {
      name: "OWEN",
      headline: "aerospace engineer • basketball player",
      subline: "Junior",
      reason: "Matched for shared love of sports + cafe culture.",
      location: "Alexander Library, Digital Commons",
      avatar: "https://i.imgur.com/5LLtQBM.jpeg",
      score: "87%"
    },
    {
      name: "NATASHA",
      headline: "pre-med • archive fashion lover",
      subline: "Senior",
      reason: "Matched for shared aesthetic taste + academic drive.",
      location: "CA Student Center, Atrium",
      avatar: "https://i.imgur.com/5WP4xL0.jpeg",
      score: "94%"
    }
  ];

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
        
        <div className="launch-countdown">
          <div className="countdown-label">Rutgers Launch in</div>
          <div className="countdown-timer">
            <span className="countdown-value">{launchCountdown.days}</span>
            <span className="countdown-unit">d</span>
            <span className="countdown-value">{launchCountdown.hours}</span>
            <span className="countdown-unit">h</span>
            <span className="countdown-value">{launchCountdown.minutes}</span>
            <span className="countdown-unit">m</span>
            <span className="countdown-value">{launchCountdown.seconds}</span>
            <span className="countdown-unit">s</span>
          </div>
        </div>
      </header>

      <main className="hero">
        <div className="hero-heading">
          <div className="hero-title-wrap">
            <h1 className="hero-title">
              The<br />
              <span className="accent-text">in-person</span><br />
              social&nbsp;network.
            </h1>
          </div>
        </div>
        
        <div className="hero-phone">
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-topbar">
                <div className="phone-status-bar">
                  <div className="status-left">
                    <img
                      className="status-time"
                      src="https://i.imgur.com/xB31BFx.png"
                      alt="signal wifi battery"
                      decoding="async"
                      loading="eager"
                    />
                  </div>
                  <div className="status-right">
                    <img
                      className="status-status-symbols"
                      src="https://i.imgur.com/pZbr4aH.png"
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
                <div className={`phone-card match-card ${isAnimating ? 'slide-out' : 'slide-in'}`}>
                  <div className="match-header">
                    <div className="match-name">{cards[currentCardIndex].name}</div>
                    <div className="match-headline">{cards[currentCardIndex].headline}</div>
                    <div className="match-subline">{cards[currentCardIndex].subline}</div>
                  </div>
                  
                  <div className="match-reason">{cards[currentCardIndex].reason}</div>
                  
                  <div className="match-meta">
                    <div className="meta-item">
                      <span className="icon">📍</span>
                      <span>{cards[currentCardIndex].location}</span>
                    </div>
                    <div className="meta-item">
                      <span>{cards[currentCardIndex].time}</span>
                    </div>
                    <button className="match-cta">confirm</button>
                  </div>
                  
                  <div className="match-avatar-score">
                    <div className="avatar-circle">
                      <img src={cards[currentCardIndex].avatar} alt={cards[currentCardIndex].name} />
                    </div>
                    <div className="moment-score">
                      {cards[currentCardIndex].score} <span className="smaller-text">MNTQ™</span>
                    </div>
                  </div>
                </div>
                
                <div className="meet-banner">
                  <div className="meet-text">
                    Meet them at <span className="yard-bold">{cards[currentCardIndex].location}</span> in <span className="countdown">{formatTime(countdown)}</span><span className="minutes-text"> minutes?</span>
                  </div>
                  <span className="meet-actions-inline">
                    <button className="action-btn confirm-btn" aria-label="Confirm">✓</button>
                    <button className="action-btn decline-btn" aria-label="Decline">✕</button>
                  </span>
                </div>
              </div>
              
              <div className="public-moments">
                <div className="public-moments-title">Public Moments</div>
                <div className="public-moments-list">
                  <div className="public-moment-item">
                    <div className="moment-icon">
                      <img src="https://i.imgur.com/oHgPYTX.jpeg" alt="Study group" />
                    </div>
                    <div className="moment-content">
                      <div className="moment-title">orgo study group</div>
                      <div className="moment-subtitle">
                        <span className="moment-desc">studying for midterm 3, need help with redox rxns</span>
                        <span className="moment-meta"> alexander library • now</span>
                      </div>
                    </div>
                    <button className="moment-cta">join</button>
                  </div>
                  
                  <div className="public-moment-item">
                    <div className="moment-icon">
                      <img src="https://i.imgur.com/fvvxFRj.jpeg" alt="Run club" />
                    </div>
                    <div className="moment-content">
                      <div className="moment-title">run club</div>
                      <div className="moment-subtitle">
                        <span className="moment-desc">super easy 5k social, waiting for 3 more people</span>
                        <span className="moment-meta"> johnson park • in 30 min</span>
                      </div>
                    </div>
                    <button className="moment-cta">join</button>
                  </div>
                  
                  <div className="public-moment-item">
                    <div className="moment-icon">
                      <img src="https://i.imgur.com/mE5YsIx.png" alt="Coffee chat" />
                    </div>
                    <div className="moment-content">
                      <div className="moment-title">coffee chat</div>
                      <div className="moment-subtitle">
                        <span className="moment-desc">casual networking over coffee, all majors welcome</span>
                        <span className="moment-meta"> starbucks • in 15 min</span>
                      </div>
                    </div>
                    <button className="moment-cta">join</button>
                  </div>
                  
                  <div className="public-moment-item">
                    <div className="moment-icon">
                      <img src="https://sca.rutgers.edu/sites/default/files/inline-images/Iglesias_200305-25.jpg" alt="Movie night" />
                    </div>
                    <div className="moment-content">
                      <div className="moment-title">movie night</div>
                      <div className="moment-subtitle">
                        <span className="moment-desc">watching the new marvel movie, bring snacks</span>
                        <span className="moment-meta"> student center • 8pm</span>
                      </div>
                    </div>
                    <button className="moment-cta">join</button>
                  </div>
                  
                  <div className="public-moment-item">
                    <div className="moment-icon">
                      <img src="https://i.postimg.cc/YS6h9mXF/SMASHBROSULTIMATEBanner-November12.png" alt="Gaming" />
                    </div>
                    <div className="moment-content">
                      <div className="moment-title">gaming night</div>
                      <div className="moment-subtitle">
                        <span className="moment-desc">smash bros tournament, all skill levels welcome</span>
                        <span className="moment-meta"> dorm lounge • 9pm</span>
                      </div>
                    </div>
                    <button className="moment-cta">join</button>
                  </div>
                  
                  <div className="public-moment-item">
                    <div className="moment-icon">
                      <img src="https://sites.rutgers.edu/mgsa-community-arts/wp-content/uploads/sites/364/2024/11/49084972930073.H7sHX0V4iy8bv8UEavIm_height640-300x200.png" alt="Art workshop" />
                    </div>
                    <div className="moment-content">
                      <div className="moment-title">art workshop</div>
                      <div className="moment-subtitle">
                        <span className="moment-desc">watercolor painting session, supplies provided</span>
                        <span className="moment-meta"> art studio • tomorrow 2pm</span>
                      </div>
                    </div>
                    <button className="moment-cta">join</button>
                  </div>
                </div>
              </div>
            </div>
            
            <img
              className="phone-overlay"
              src="https://i.imgur.com/UByl4z5.png"
              alt=""
              decoding="async"
              loading="eager"
              aria-hidden
            />
          </div>
        </div>

        <div className="hero-details">
          <div className="rsvp-text">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Rutgers_Scarlet_Knights_logo.svg/1200px-Rutgers_Scarlet_Knights_logo.svg.png" 
              alt="Rutgers Scarlet Knights" 
              className="rutgers-logo"
            />
            <div>RSVP for our Rutgers exclusive launch this fall</div>
          </div>
          <EarlyAccessCTA />
        </div>
      </main>

      {/* Divider row — thin and quiet */}
      <div className="divider-row">
        <div className="divider-line" />
      </div>

      <footer className="site-footer">
        <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
        <nav className="footer-nav">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="mailto:hello@makemoments.app">Contact</a>
        </nav>
      </footer>
    </div>
  );
}

function EarlyAccessCTA() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };
  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length === 10) {
      setIsSubmitted(true);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="email-cta submitted">
        <div className="email-cta-main submitted">
          <span className="thanks-message">You’re in. We’ll keep you posted.</span>
        </div>
        <div className="email-cta-arrow submitted"></div>
      </div>
    );
  }
  
  return (
    <form className="email-cta" onSubmit={onSubmit} noValidate>
      <div className="email-cta-main">
        <input
          type="tel"
          className="email-field"
          placeholder="ENTER PHONE NUMBER"
          aria-label="Enter phone number to RSVP"
          value={phoneNumber}
          onChange={handlePhoneChange}
          maxLength={14} // (XXX) XXX-XXXX = 14 characters
          required
        />
      </div>
      <button type="submit" className="email-cta-arrow" aria-label="Submit">→</button>
    </form>
  );
}

export default App;
