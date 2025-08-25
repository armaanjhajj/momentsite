import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundAnimation from '../components/BackgroundAnimation';
import NFCAnimation from '../components/NFCAnimation';
import '../App.scss';

function Home() {
  const [launchCountdown, setLaunchCountdown] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [expandedMoments, setExpandedMoments] = React.useState(new Set());

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
    if (isConfirmed) return; // Stop swiping when confirmed
    
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
  }, [isAnimating, isConfirmed]);

  // Inject LaunchList widget script on mount so SPA reliably initializes the widget
  React.useEffect(() => {
    const scriptId = 'launchlist-widget-script';
    if (document.getElementById(scriptId)) return; // already injected
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://getlaunchlist.com/js/widget.js';
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handleReplay = () => {
    // Reset all phone demo state
    setCurrentCardIndex(0);
    setIsAnimating(false);
    setIsConfirmed(false);
    setExpandedMoments(new Set());
  };

  const toggleMomentExpansion = (momentId) => {
    setExpandedMoments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(momentId)) {
        newSet.delete(momentId);
      } else {
        newSet.add(momentId);
      }
      return newSet;
    });
  };

  const cards = [
    {
      name: "AAZAM",
      headline: "marketing major • huge Drake fan",
      subline: "Sophomore",
      reason: "Matched for shared music taste + overlapping class times.",
      location: "The Yard, by Starbucks",
      avatar: "https://i.imgur.com/nmlzmsq.jpeg",
      score: "92%",
      meetTime: "5:45 PM"
    },
    {
      name: "OWEN",
      headline: "aerospace engineer • basketball player",
      subline: "Junior",
      reason: "Matched for shared love of sports + cafe culture.",
      location: "Alexander Library, Digital Commons",
      avatar: "https://i.imgur.com/5LLtQBM.jpeg",
      score: "87%",
      meetTime: "6:30 PM"
    },
    {
      name: "NATASHA",
      headline: "pre-med • archive fashion lover",
      subline: "Senior",
      reason: "Matched for shared passion of business + looking for a co-founder.",
      location: "CA Student Center, Atrium",
      avatar: "https://i.imgur.com/5WP4xL0.jpeg",
      score: "94%",
      meetTime: "4:15 PM"
    }
  ];

  const publicMoments = [
    {
      id: "orgo-study",
      title: "orgo study group",
      desc: "studying for midterm 3, need help with redox rxns",
      location: "alexander library",
      time: "now",
      icon: "https://i.imgur.com/oHgPYTX.jpeg",
      expandedDetails: {
        fullTime: "Today, 7:00 PM - 10:00 PM",
        fullLocation: "Alexander Library, Room 101",
        totalAttending: 12,
        connectedAttending: 3,
        nonConnectedAttending: 9,
        connectedAvatars: [
          "https://i.imgur.com/nmlzmsq.jpeg",
          "https://i.imgur.com/5LLtQBM.jpeg", 
          "https://i.imgur.com/5WP4xL0.jpeg"
        ],
        nonConnectedAvatars: [
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        ]
      }
    },
    {
      id: "run-club",
      title: "run club",
      desc: "super easy 5k social, waiting for 3 more people",
      location: "johnson park",
      time: "in 30 min",
      icon: "https://i.imgur.com/fvvxFRj.jpeg",
      expandedDetails: {
        fullTime: "Today, 6:30 PM - 7:30 PM",
        fullLocation: "Johnson Park, Main Entrance",
        totalAttending: 8,
        connectedAttending: 2,
        nonConnectedAttending: 6,
        connectedAvatars: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        ],
        nonConnectedAvatars: [
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
        ]
      }
    },
    {
      id: "coffee-chat",
      title: "coffee chat",
      desc: "casual networking over coffee, all majors welcome",
      location: "starbucks",
      time: "in 15 min",
      icon: "https://i.imgur.com/mE5YsIx.png",
      expandedDetails: {
        fullTime: "Today, 6:15 PM - 7:15 PM",
        fullLocation: "Starbucks, College Ave",
        totalAttending: 15,
        connectedAttending: 4,
        nonConnectedAttending: 11,
        connectedAvatars: [
          "https://i.imgur.com/nmlzmsq.jpeg",
          "https://i.imgur.com/5LLtQBM.jpeg",
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
        ],
        nonConnectedAvatars: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
        ]
      }
    },
    {
      id: "movie-night",
      title: "movie night",
      desc: "watching the new marvel movie, bring snacks",
      location: "student center",
      time: "8pm",
      icon: "https://sca.rutgers.edu/sites/default/files/inline-images/Iglesias_200305-25.jpg",
      expandedDetails: {
        fullTime: "Today, 8:00 PM - 10:30 PM",
        fullLocation: "Student Center, Theater Room",
        totalAttending: 25,
        connectedAttending: 6,
        nonConnectedAttending: 19,
        connectedAvatars: [
          "https://i.imgur.com/5WP4xL0.jpeg",
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        ],
        nonConnectedAvatars: [
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face"
        ]
      }
    },
    {
      id: "gaming-night",
      title: "gaming night",
      desc: "smash bros tournament, all skill levels welcome",
      location: "dorm lounge",
      time: "9pm",
      icon: "https://i.postimg.cc/YS6h9mXF/SMASHBROSULTIMATEBanner-November12.png",
      expandedDetails: {
        fullTime: "Today, 9:00 PM - 12:00 AM",
        fullLocation: "Livingston Dorm Lounge",
        totalAttending: 20,
        connectedAttending: 5,
        nonConnectedAttending: 15,
        connectedAvatars: [
          "https://i.imgur.com/5LLtQBM.jpeg",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
        ],
        nonConnectedAvatars: [
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face"
        ]
      }
    },
    {
      id: "art-workshop",
      title: "art workshop",
      desc: "watercolor painting session, supplies provided",
      location: "art studio",
      time: "tomorrow 2pm",
      icon: "https://sites.rutgers.edu/mgsa-community-arts/wp-content/uploads/sites/364/2024/11/49084972930073.H7sHX0V4iy8bv8UEavIm_height640-300x200.png",
      expandedDetails: {
        fullTime: "Tomorrow, 2:00 PM - 4:00 PM",
        fullLocation: "Visual Arts Building, Studio 205",
        totalAttending: 10,
        connectedAttending: 1,
        nonConnectedAttending: 9,
        connectedAvatars: [
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        ],
        nonConnectedAvatars: [
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
        ]
      }
    }
  ];

  return (
    <>
      <BackgroundAnimation />
      <div className="App">
        <header className="site-header">
        <Link to="/" className="brand">
          <img
            className="brand-logo"
            src="https://i.imgur.com/y83R3ej.png"
            alt="moments logo"
            decoding="async"
            loading="eager"
          />
        </Link>
        

        
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
                <div className="phone-brand" onClick={handleReplay} style={{ cursor: 'pointer' }}>
                  <img
                    className="phone-brand-logo"
                    src="https://i.imgur.com/y83R3ej.png"
                    alt="moments logo"
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
                  
                
                  
                  <div className="match-avatar-score">
                    <div className="avatar-circle">
                      <img src={cards[currentCardIndex].avatar} alt={cards[currentCardIndex].name} />
                    </div>
                    <div className="moment-score">
                      {cards[currentCardIndex].score} <span className="smaller-text">MNTQ™</span>
                    </div>
                  </div>
                  {/* Show meet banner with actions when not confirmed */}
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
                        <button 
                          className="action-btn confirm-btn" 
                          aria-label="Confirm"
                          onClick={handleConfirm}
                        >
                          ✓
                        </button>
                      </span>
                    </div>
                  )}
                
                  {/* Show confirmed state with location, time, and NFC animation */}
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
                <div className="public-moments-title">SHARED MOMENTS</div>
                <div className="public-moments-list">
                  {publicMoments.map((moment) => {
                    const isExpanded = expandedMoments.has(moment.id);
                    return (
                      <div key={moment.id} className={`public-moment-item ${isExpanded ? 'expanded' : ''}`}>
                        {!isExpanded ? (
                          <>
                            <div className="moment-icon">
                              <img src={moment.icon} alt={moment.title} />
                            </div>
                            <div className="moment-content">
                              <div className="moment-title">{moment.title}</div>
                              <div className="moment-subtitle">
                                <span className="moment-desc">{moment.desc}</span>
                                <span className="moment-meta"> {moment.location} • {moment.time}</span>
                              </div>
                            </div>
                            <button 
                              className="moment-cta"
                              onClick={() => toggleMomentExpansion(moment.id)}
                            >
                              explore
                            </button>
                          </>
                        ) : (
                          <div className="moment-content">
                            <div className="moment-header-expanded">
                              <div className="moment-icon">
                                <img src={moment.icon} alt={moment.title} />
                              </div>
                              <div className="moment-title-expanded">
                                <div className="moment-title">{moment.title}</div>
                                <div className="moment-subtitle">
                                  <span className="moment-desc">{moment.desc}</span>
                                  <span className="moment-meta"> {moment.location} • {moment.time}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="moment-expanded-details">
                              <div className="expanded-time-location">
                                <div className="expanded-time">{moment.expandedDetails.fullTime}</div>
                                <div className="expanded-location">{moment.expandedDetails.fullLocation}</div>
                              </div>
                              
                              <div className="attendees-section">
                                <div className="attendee-group">
                                  <div className="attendee-count">{moment.expandedDetails.connectedAttending} connections attending</div>
                                  <div className="avatar-stack">
                                    {moment.expandedDetails.connectedAvatars.slice(0, 4).map((avatar, index) => (
                                      <img key={index} src={avatar} alt="" className="avatar-small connected" />
                                    ))}
                                    {moment.expandedDetails.connectedAttending > 4 && (
                                      <div className="avatar-small more-count">+{moment.expandedDetails.connectedAttending - 4}</div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="attendee-group">
                                  <div className="attendee-count">{moment.expandedDetails.nonConnectedAttending} others attending</div>
                                  <div className="avatar-stack">
                                    {moment.expandedDetails.nonConnectedAvatars.slice(0, 4).map((avatar, index) => (
                                      <img key={index} src={avatar} alt="" className="avatar-small non-connected" />
                                    ))}
                                    {moment.expandedDetails.nonConnectedAttending > 4 && (
                                      <div className="avatar-small more-count">+{moment.expandedDetails.nonConnectedAttending - 4}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
            <div className="rsvp-note">Use your @rutgers.edu email to sign up</div>
          </div>
          <div className="launchlist-widget" data-key-id="PS7heZ" data-height="180px"></div>
        </div>
      </main>

      {/* ElevenLabs Convai Widget - Default Floating */}
      <elevenlabs-convai agent-id="agent_4001k37hrm0wfxcvq8ch4cxmj1ge"></elevenlabs-convai>

      {/* Divider row — thin and quiet */}
      <div className="divider-row">
        <div className="divider-line" />
      </div>

      <footer className="site-footer">
        <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
        <nav className="footer-nav">
          <Link to="/manifesto">Manifesto</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/consent">Consent</Link>
          <Link to="/admin">Admin</Link>
          <a href="mailto:makemomentsapp@gmail.com">Contact</a>
        </nav>
      </footer>
      </div>
    </>
  );
}

// LaunchList widget handles the form UI and submission; no local form component needed

export default Home;
