import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.scss';

function NWK() {
  return (
    <>
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img className="brand-logo" src={logo} alt="moments logo" decoding="async" loading="eager" />
          </Link>
        </header>

        <main style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '2rem 1rem',
          textAlign: 'center',
          gap: '2rem'
        }}>
          {/* YouTube Video Embed */}
          <div style={{ 
            width: '100%', 
            maxWidth: '800px',
            aspectRatio: '16/9',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/hmibjZGhyX0?si=NmKZABk_aAeRTo6r"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>

          {/* Text Content */}
          <p style={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '900',
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            color: '#111',
            margin: '1rem 0',
            maxWidth: '600px',
            lineHeight: '1.2'
          }}>
            we are making app to help you find friends
          </p>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '400px'
          }}>
            <Link 
              to="/waitlist" 
              className="manifesto-link" 
              style={{ 
                width: '100%',
                borderColor: '#000',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center'
              }}
            >
              Join the Waitlist
            </Link>
            
            <a 
              href="https://www.instagram.com/letsmakemoments?igsh=bmVvdjgwMDF3dnd5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="manifesto-link" 
              style={{ 
                width: '100%',
                borderColor: '#000',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center'
              }}
            >
              Follow us on Instagram
            </a>
            
            <a 
              href="https://www.tiktok.com/@letsmakemoments?_t=ZT-8zpw0DszxEF&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="manifesto-link" 
              style={{ 
                width: '100%',
                borderColor: '#000',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center'
              }}
            >
              Follow us on TikTok
            </a>
          </div>

          {/* Bottom Text */}
          <p style={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '400',
            fontSize: '1rem',
            color: '#666',
            marginTop: '2rem'
          }}>
            Launching October 1st, stay tuned.
          </p>
        </main>
      </div>
    </>
  );
}

export default NWK;