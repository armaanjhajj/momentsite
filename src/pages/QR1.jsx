import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Untitled-4 (1).png';
import '../App.scss';

function QR1() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
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
              <span className="word-newark">newark</span>{' '}
              <span className="word-date">10/1</span>
            </span>
          </div>
        </header>

        <main className="qr1-content">
          <div className="qr1-container">
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
            
            <div className="cta-section">
              <Link to="/waitlist" className="join-waitlist-btn">
                Join Waitlist
              </Link>
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
          </div>
        </main>

        {/* Footer moved to global Footer component (rendered from App.jsx) */}
      </div>
    </>
  );
}

export default QR1;
