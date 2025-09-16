import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../components/BackgroundAnimation';
import NFCAnimation from '../components/NFCAnimation';
import logo from '../assets/logo.png';
import '../App.scss';

function About() {
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  React.useEffect(() => {
    if (isConfirmed) return;
    const cardTimer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentCardIndex(prev => (prev + 1) % 3);
          setIsAnimating(false);
        }, 600);
      }
    }, 5000);
    return () => clearInterval(cardTimer);
  }, [isAnimating, isConfirmed]);

  const handleConfirm = () => setIsConfirmed(true);
  const handleReplay = () => {
    setCurrentCardIndex(0);
    setIsAnimating(false);
    setIsConfirmed(false);
  };

  const cards = [
    {
      name: 'AAZAM',
      headline: 'marketing major • huge Drake fan',
      subline: 'Sophomore',
      reason: 'You guys both have Drake on repeat, get iced coffee before 8am lectures, and always sit in the back row of Marketing 301.',
      location: 'The Yard, by Starbucks',
      avatar: 'https://i.imgur.com/nmlzmsq.jpeg',
      meetTime: '5:45 PM'
    },
    {
      name: 'OWEN',
      headline: 'aerospace engineer • basketball player',
      subline: 'Junior',
      reason: 'You guys both posted Instagram stories at the rec center this week, study at the same Starbucks, and follow the same NBA meme accounts.',
      location: 'Alexander Library, Digital Commons',
      avatar: 'https://i.imgur.com/5LLtQBM.jpeg',
      meetTime: '6:30 PM'
    },
    {
      name: 'NATASHA',
      headline: 'pre-med • archive fashion lover',
      subline: 'Senior',
      reason: "You guys both have 'future entrepreneur' in their LinkedIn bios, attend the same business networking events, and are trying to get into Road To Consulting.",
      location: 'CA Student Center, Atrium',
      avatar: 'https://i.imgur.com/5WP4xL0.jpeg',
      meetTime: '4:15 PM'
    }
  ];

  const searchPhrases = [
    "I'm looking for someone who shares my music taste and class schedule",
    "I'm looking for a fellow athlete who loves coffee as much as sports",
    "I'm looking for a potential co-founder for my business idea"
  ];

  const recentMoments = [
    { id: 'econ-classmate', title: 'alex in your econ class', desc: 'both listen to Ken Carson + love raving', location: 'business building', time: '5 min ago', icon: 'https://i.imgur.com/EXZUihD.jpeg', connected: true },
    { id: 'khyber-coffee', title: 'sam just walked into khyber coffee', desc: 'wants to grind LeetCode + hates Prof Chen too', location: 'khyber coffee', time: '2 min ago', icon: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', connected: false },
    { id: 'crossed-paths', title: 'you crossed paths with jordyn', desc: 'posted at rec center 11pm + plays Rutgers intramural soccer', location: 'college ave', time: 'just now', icon: 'https://i.imgur.com/GcdiFTm.png', connected: true },
    { id: 'gym-buddy', title: 'casey at the rec center', desc: 'goes to Werblin 2x a week + loves to lift', location: 'college ave gym', time: '15 min ago', icon: 'https://i.imgur.com/lxRPNqo.png', connected: true },
    { id: 'library-studier', title: 'taylor at alexander library', desc: 'looking for a study group for orgo + likes going to Chi Phi', location: 'alexander library', time: '10 min ago', icon: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', connected: false },
    { id: 'dining-hall', title: 'riley at brower commons', desc: 'big foodie + loves to eat late at night', location: 'brower commons', time: '20 min ago', icon: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', connected: false }
  ];

  return (
    <>
      <BackgroundAnimation />
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
          </Link>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/waitlist">Waitlist</Link>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-heading">
            <div className="hero-title-wrap">
              <h1 className="hero-title">
                connect with anyone,<br />
                <span className="accent-text">in real time</span><br />
              </h1>
            </div>

            <div className="search-display">
              <div className="search-text-box">
                <div className="search-placeholder">describe your ideal moment</div>
                <div className="search-input">{searchPhrases[currentCardIndex]}</div>
              </div>
            </div>
          </div>

          <div className="hero-phone">
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-topbar">
                  <div className="phone-status-bar">
                    <div className="status-left">
                      <img className="status-time" src="https://i.imgur.com/xB31BFx.png" alt="signal wifi battery" decoding="async" loading="eager" />
                    </div>
                    <div className="status-right">
                      <img className="status-status-symbols" src="https://i.imgur.com/pZbr4aH.png" alt="9:27" decoding="async" loading="eager" />
                    </div>
                  </div>
                  <div className="phone-brand" onClick={handleReplay} style={{ cursor: 'pointer' }}>
                    <img className="phone-brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
                  </div>
                </div>

                <div className="phone-cards">
                  <div className={`phone-card match-card ${isAnimating ? 'slide-out' : 'slide-in'}`}>
                    <div className="match-header">
                      <div className="match-header-content">
                        <div className="match-name">{cards[currentCardIndex].name}</div>
                        <div className="match-headline">{cards[currentCardIndex].headline}</div>
                        <div className="match-subline">{cards[currentCardIndex].subline}</div>
                      </div>
                      <div className="avatar-circle">
                        <img src={cards[currentCardIndex].avatar} alt={cards[currentCardIndex].name} />
                      </div>
                    </div>

                    <div className="match-reason">{cards[currentCardIndex].reason}</div>

                    {!isConfirmed && (
                      <div className="meet-banner">
                        <div className="meet-content">
                          <div className="meet-text">
                            Meet them at <span className="yard-bold">{cards[currentCardIndex].location}</span>
                          </div>
                          <div className="meet-time">
                            <span className="time-label">at</span>
                            <span className="countdown">{cards[currentCardIndex].meetTime}</span>
                            <span className="minutes-text">?</span>
                          </div>
                        </div>
                        <span className="meet-actions-inline">
                          <button className="action-btn confirm-btn" aria-label="Confirm" onClick={() => setIsConfirmed(true)}>✓</button>
                        </span>
                      </div>
                    )}

                    {isConfirmed && (
                      <div className="confirmed-meeting">
                        <div className="confirmed-location">
                          <div className="location-label">Meeting at</div>
                          <div className="location-name">{cards[currentCardIndex].location}</div>
                        </div>
                        <div className="confirmed-time">
                          <div className="time-label">at</div>
                          <div className="time-value">{cards[currentCardIndex].meetTime}</div>
                        </div>
                        <div className="nfc-animation-container">
                          <NFCAnimation className="nfc-tap-animation" />
                          <div className="nfc-instruction">Tap phones to connect</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="public-moments">
                  <div className="public-moments-title">RECENT MOMENTS</div>
                  <div className="public-moments-list">
                    {recentMoments.map((moment) => (
                      <div key={moment.id} className="public-moment-item">
                        <div className="moment-icon">
                          <img src={moment.icon} alt={moment.title} className={moment.connected ? '' : 'blurred-avatar'} />
                        </div>
                        <div className="moment-content">
                          <div className="moment-title">{moment.title}</div>
                          <div className="moment-subtitle">
                            <span className="moment-desc">{moment.desc}</span>
                            <span className="moment-meta"> {moment.location} • {moment.time}</span>
                          </div>
                        </div>
                        <div className="connection-indicator">
                          <img src="https://i.imgur.com/P9Z734H.png" alt="moments logo" className={`moments-logo ${moment.connected ? 'connected' : 'not-connected'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <img className="phone-overlay" src="https://i.imgur.com/UByl4z5.png" alt="" decoding="async" loading="eager" aria-hidden />
            </div>
          </div>
        </main>

        <div className="divider-row"><div className="divider-line" /></div>

        <footer className="site-footer">
          <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/waitlist">Waitlist</Link>
            <Link to="/manifesto">Manifesto</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/consent">Consent</Link>
            <Link to="/login">Team</Link>
            <a href="mailto:contact@havemoments.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default About;
