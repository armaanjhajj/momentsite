import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';
import heroVideo from '../assets/video.mp4';
import logo from '../assets/logo.png';
import Logo from '../components/Logo';

function Home() {
  const videoRef = React.useRef(null);
  const [muted, setMuted] = React.useState(true);
  const [showSoundOverlay, setShowSoundOverlay] = React.useState(true);
  const [flashText, setFlashText] = React.useState('CLICK');

  // Flash between "CLICK" and "HERE"
  React.useEffect(() => {
    if (!showSoundOverlay) return;
    
    const interval = setInterval(() => {
      setFlashText(prev => prev === 'CLICK' ? 'HERE' : 'CLICK');
    }, 800);

    return () => clearInterval(interval);
  }, [showSoundOverlay]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = muted;
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  }, [muted]);

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    
    v.muted = false;
    setMuted(false);
    setShowSoundOverlay(false);
    
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  };

  return (
    <>
      <div className="App" style={{ maxWidth: 'none', borderRadius: 0 }}>
        <header className="site-header" style={{ margin: '0.75rem 0' }}>
          <Link to="/" className="brand">
            <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
          </Link>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/waitlist">Waitlist</Link>
          </nav>
        </header>

        <main style={{ position: 'relative', width: '100%', height: 'calc(100vh - 160px)', background: '#000' }}>
          <video
            ref={videoRef}
            src={heroVideo}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }}
            playsInline
            autoPlay
            loop
            preload="auto"
            muted
            controls={false}
          />
          {showSoundOverlay && (
            <div
              onClick={enableSound}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              <div
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 'clamp(4rem, 15vw, 12rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  animation: 'pulse 0.8s ease-in-out infinite alternate'
                }}
              >
                {flashText}
              </div>
            </div>
          )}
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.8; transform: scale(1); }
              100% { opacity: 1; transform: scale(1.05); }
            }
          `}</style>
        </main>

        {/* Footer moved to global Footer component (rendered from App.jsx) */}
      </div>
    </>
  );
}

export default Home;
