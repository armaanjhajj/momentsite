import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';

function Consent() {
  return (
    <>
      <div className="App">
        <header className="site-header">
          <Link to="/" className="brand">
            <img
              className="brand-logo"
              src="https://i.imgur.com/WZvHbcj.png"
              alt="moments asterisk"
              decoding="async"
              loading="eager"
            />
          </Link>
        </header>

        <main className="legal-content">
          <div className="legal-container">
            <h1>Phone Number Consent</h1>
            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2>Waitlist Text Message Consent</h2>
              <p>By providing your phone number, you agree to receive waitlist text messages from Moments. Please read the following information carefully:</p>
              
              <div className="consent-box">
                <p><strong>I agree to receive waitlist texts from Moments.</strong></p>
                <p><em>Consent not required to sign up. Msg & data rates may apply. Up to 4 msgs/mo. Reply STOP to cancel, HELP for help.</em></p>
                <p>See our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
              </div>
            </section>

            <section>
              <h2>What This Means</h2>
              <ul>
                <li><strong>Consent is optional:</strong> You can still sign up for our waitlist without providing phone consent</li>
                <li><strong>Message frequency:</strong> We will send no more than 4 messages per month</li>
                <li><strong>Message content:</strong> Updates about your waitlist status, app launch, and exclusive early access opportunities</li>
                <li><strong>Data rates:</strong> Standard messaging and data rates from your carrier may apply</li>
              </ul>
            </section>

            <section>
              <h2>How to Manage Your Consent</h2>
              <ul>
                <li><strong>Reply STOP:</strong> To unsubscribe from all text messages</li>
                <li><strong>Reply HELP:</strong> To get help and contact information</li>
                <li><strong>Email us:</strong> Contact us at <a href="mailto:makemomentsapp@gmail.com">makemomentsapp@gmail.com</a> for any questions</li>
              </ul>
            </section>

            <section>
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Withdraw consent at any time by replying STOP</li>
                <li>Update your phone number or preferences</li>
                <li>Request information about how we use your phone number</li>
                <li>File a complaint if you believe your rights have been violated</li>
              </ul>
            </section>

            <div className="legal-footer">
              <Link to="/" className="back-home">← Back to Home</Link>
            </div>
          </div>
        </main>

        <footer className="site-footer">
          <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
          <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/manifesto">Manifesto</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/consent">Consent</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/login">Team</Link>
          <a href="mailto:makemomentsapp@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default Consent;
