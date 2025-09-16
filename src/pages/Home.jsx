import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';
import heroVideo from '../assets/video.mp4';
import logo from '../assets/logo.png';

function Home() {
  const videoRef = React.useRef(null);
  const [muted, setMuted] = React.useState(true);
  const [hover, setHover] = React.useState(false);

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
            <Link to="/about">Waitlist</Link>
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
            onClick={toggleAudio}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            aria-label={muted ? 'Enable sound' : 'Mute sound'}
            style={{
              position: 'absolute', right: 16, bottom: 16, zIndex: 3,
              background: hover ? '#fff' : '#000', color: hover ? '#000' : '#fff',
              border: '1px solid #fff', borderRadius: 9999,
              padding: '8px 12px', fontSize: 12, opacity: hover ? 1 : 0.85,
              transition: 'all 160ms ease', cursor: 'pointer'
            }}
          >
            {muted ? 'Sound On' : 'Mute'}
          </button>
        </main>

        <footer className="site-footer" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/jobs">Jobs</Link>
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
