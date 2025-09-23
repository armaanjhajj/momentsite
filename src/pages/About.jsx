import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import phoneFrame from '../assets/apple-iphone-16-pro-max-2024-medium.png';
import teaserVideo from '../assets/video.mp4';
import '../App.scss';

function About() {
  return (
    <>
      <div className="App">
        {/* Global header used */}

        <main style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', padding: '2rem 0 4rem' }}>
          <section style={{ paddingLeft: '1rem' }}>
            <h1 className="hero-title" style={{ lineHeight: 1.05, marginBottom: 16 }}>real connections, in real time</h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: 640, margin: 0 }}>
              Moments helps you meet the people around you you’re most likely to vibe with.
              It’s fast, in-person, and designed for campus life.
            </p>

            <ul style={{ marginTop: 20, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>See high-signal opportunities to meet nearby students</li>
              <li>Lock in a time and place instantly</li>
              <li>No feeds. No swipes. Just say “hey.”</li>
            </ul>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <Link to="/waitlist" className="manifesto-link" style={{ borderColor: '#000' }}>Join Waitlist</Link>
              <Link to="/jobs" className="manifesto-link" style={{ borderColor: '#000' }}>Jobs</Link>
            </div>
          </section>

          <section style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 420, maxWidth: '100%' }}>
              <img src={phoneFrame} alt="iPhone frame" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '76%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#111', marginBottom: 8 }}>
                  <span>9:27</span>
                  <span>
                    <span style={{ marginRight: 8 }}>Wi‑Fi</span>
                    <span>100%</span>
                  </span>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 24, padding: '18px 16px', textAlign: 'left', boxShadow: '0 8px 18px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em', color: '#111', marginBottom: 6 }}>alex</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>in your econ class</div>
                  <div style={{ fontSize: 13, color: '#3f3f46', marginBottom: 12 }}>both listen to Ken Carson + love raving</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#111', border: '1px solid #111', borderRadius: 9999, padding: '6px 10px' }}>
                    <span>business building</span>
                    <span>•</span>
                    <span>5:45 PM</span>
                  </div>
                </div>
                <div style={{ height: 6, width: 120, background: '#e5e5e5', borderRadius: 9999, margin: '18px auto 0' }} />
              </div>
            </div>
          </section>
        </main>

        <section>
          <YouTubeCard
            videoSrc={teaserVideo}
            ratio="16/9"
            fit="contain"
            scale={1}
            autoPlay={false}
            loop={false}
            muted={false}
            controls={true}
            className="truly-borderless-video"
          />
        </section>

        {/* Global footer used */}
      </div>
    </>
  );
}

function YouTubeCard({
  videoId,
  videoSrc,             // optional: if provided, render HTML5 <video>
  ratio = "1/1",        // '16/9' | '4/3' | '1/1' | '9/16'
  fit = "cover",         // 'contain' | 'cover'
  rounded = "rounded-4xl",
  scale = 1.15,          // zoom when fit='cover'
  className = "",
  // HTML5 video behavior (defaults: user-controlled playback)
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
}) {
  const aspectMap = {
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "9/16": "aspect-[9/16]",
  };

  const src = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&color=white&showinfo=0&controls=0&iv_load_policy=3&fs=0&disablekb=1&autohide=1`
    : undefined;
  const coverStyle =
    fit === "cover" ? { transform: `scale(${scale})`, transformOrigin: "center" } : undefined;
  const iframeBleed = fit === "cover" ? 1 : 0; // 1px bleed only for cover
  const iframePos = {
    top: -iframeBleed,
    left: -iframeBleed,
    right: -iframeBleed,
    bottom: -iframeBleed,
    width: iframeBleed ? `calc(100% + ${iframeBleed * 2}px)` : '100%',
    height: iframeBleed ? `calc(100% + ${iframeBleed * 2}px)` : '100%'
  };

  return (
    <section className={`mx-auto max-w-7xl px-4 py-10 ${className}`}>
      <div
        className={`relative w-full ${aspectMap[ratio] ?? aspectMap["16/9"]} truly-borderless-video`}
        style={{
          borderRadius: '28px',
          overflow: 'hidden',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          outline: 'none',
        }}
      >
    {videoSrc ? (
          <video
            className="absolute truly-borderless-video-iframe"
            style={{
              ...(coverStyle ?? {}),
              ...iframePos,
              objectFit: fit,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              background: 'transparent',
              transform: `${coverStyle?.transform ?? ''} translateZ(0)`.trim(),
              willChange: 'transform'
            }}
            src={videoSrc}
      playsInline
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
      controls={controls}
      preload="metadata"
          />
        ) : (
          <iframe
            className="absolute truly-borderless-video-iframe"
            style={{
              ...(coverStyle ?? {}),
              ...iframePos,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              background: 'transparent',
              transform: `${coverStyle?.transform ?? ''} translateZ(0)`.trim(),
              willChange: 'transform'
            }}
            src={src}
            title="YouTube video"
            frameBorder="0"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </section>
  );
}


export default About;
