import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';
import heroVideo from '../assets/video.mp4';
import logo from '../assets/logo.png';

function Home() {
  const videoRef = React.useRef(null);
  const [muted, setMuted] = React.useState(true);
  const rotatingBtnRef = React.useRef(null);
  const [arcBg, setArcBg] = React.useState('');
  // Rotating conic-gradient border animation
  React.useEffect(() => {
    let angle = 0;
    let hue = 0;
    let running = true;
    function rotate() {
      if (!running) return;
      angle = (angle + 1) % 360;
      hue = (hue + 2) % 360;
      // Animate the arc color using HSL for smooth RGB cycling
      const arc1 = `hsl(${hue}, 100%, 60%)`;
      const arc2 = `hsl(${(hue + 30) % 360}, 100%, 60%)`;
      const arc3 = `hsl(${(hue + 60) % 360}, 100%, 60%)`;
      const arc4 = `hsl(${(hue + 90) % 360}, 100%, 60%)`;
      const arc5 = `hsl(${(hue + 120) % 360}, 100%, 60%)`;
      const bg = `linear-gradient(#181c23, #181c23) padding-box,conic-gradient(from ${angle}deg,${arc1} 0deg,${arc2} 12deg,${arc3} 24deg,${arc4} 36deg,${arc5} 48deg,transparent 60deg,transparent 360deg) border-box`;
      setArcBg(bg);
      requestAnimationFrame(rotate);
    }
    rotate();
    return () => { running = false; };
  }, []);

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

  const toggleAudio = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
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
          <button
            ref={rotatingBtnRef}
            className="rotating"
            onClick={toggleAudio}
            aria-label={muted ? 'Enable sound' : 'Mute sound'}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              background: arcBg
            }}
          >
            Sound On
          </button>
          <style>{`
            .rotating {
              padding: 8px 12px;
              border-radius: 9999px;
              outline: none;
              background:
                linear-gradient(#181c23, #181c23) padding-box,
                conic-gradient(
                  from var(--angle, 0),
                  var(--arc1, #ff0055) 0deg,
                  var(--arc2, #00c8ff) 12deg,
                  var(--arc3, #00ff99) 24deg,
                  var(--arc4, #ffe600) 36deg,
                  var(--arc5, #ff0055) 48deg,
                  transparent 60deg,
                  transparent 360deg
                ) border-box;
              border: 3px solid transparent;
              color: #fff;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 2px 12px rgba(0,0,0,0.12);
              transition: transform 0.18s cubic-bezier(.4,2,.6,1), filter 0.18s;
              z-index: 1000;
              position: absolute;
              right: 16px;
              bottom: 16px;
            }
            .rotating:hover {
              transform: scale(1.03);
              filter: brightness(1.2);
            }
          `}</style>
        </main>

        <footer className="site-footer" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
          <nav className="footer-nav">
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

export default Home;
