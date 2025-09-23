import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.scss';

function Terms() {
  return (
    <>
      <div className="App">
        {/* Global header used */}

        <main className="legal-content">
          <div className="legal-container">
            <h1>Terms of Service</h1>
            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
          {/* Footer moved to global Footer component */}
            <section>
              <h2>3. User Accounts</h2>
              <p>To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2>4. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate another person or entity</li>
                <li>Share inappropriate or offensive content</li>
                <li>Attempt to gain unauthorized access to the Service</li>
              </ul>
            </section>

            <section>
              <h2>5. Privacy and Data</h2>
              <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>
            </section>

            <section>
              <h2>6. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are owned by Moments and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            </section>

            <section>
              <h2>7. Termination</h2>
              <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.</p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>In no event shall Moments, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
            </section>

            <section>
              <h2>9. Governing Law</h2>
              <p>These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2>10. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>
            </section>

            <section>
              <h2>11. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:makemomentsapp@gmail.com">makemomentsapp@gmail.com</a></p>
            </section>

            <div className="legal-footer">
              <Link to="/" className="back-home">← Back to Home</Link>
            </div>
          </div>
        </main>

        {/* Global footer used */}
      </div>
    </>
  );
}

export default Terms;
