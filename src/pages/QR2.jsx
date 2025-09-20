import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Untitled-4 (1).png';
import '../App.scss';

function QR2() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-10-01T00:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="App">
        <header className="site-header qr1-header">
          <div className="qr1-logo-container">
            <img className="brand-logo qr1-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
            <span className="newark-text">
              <span className="word-coming">coming</span>{' '}
              <span className="word-to">to</span>{' '}
              <span className="word-newark">new brunswick</span>{' '}
              <span className="word-date">10/1</span>
            </span>
          </div>
        </header>

        <main className="qr1-content">
          <div className="qr1-container">

            {/* CTA first so IG icon sits between button and video */}
            <div className="cta-section">
              <Link to="/waitlist" className="join-waitlist-btn">
                Join Waitlist
              </Link>

              {/* Instagram icon/link */}
              <a
                className="instagram-link"
                href="https://instagram.com/letsmakemoments"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow @letsmakemoments on Instagram"
                title="@letsmakemoments"
              >
                {/* Inline Instagram SVG (no extra deps) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
                <span className="sr-only">@letsmakemoments</span>
              </a>

              <p className="launch-date">launching october 1st 2025</p>
              <p className="waitlist-requirement">must be on waitlist to access app</p>

              <div className="countdown-container">
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="countdown-unit">days</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="countdown-unit">hours</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="countdown-unit">minutes</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="countdown-unit">seconds</span>
                </div>
              </div>
            </div>

            {/* Video after CTA + IG */}
            <div className="video-container">
              <iframe
                width="2560"
                height="1440"
                src="https://www.youtube.com/embed/hmibjZGhyX0?si=cw95PPau7gKlbRuP"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default QR2;
