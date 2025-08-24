import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';

function Privacy() {
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
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, complete your profile, or communicate with us. This may include:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Profile information and interests</li>
                <li>Location data (with your consent)</li>
                <li>Communication preferences</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Connect you with other users based on shared interests</li>
                <li>Send you notifications and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section>
              <h2>3. Location Services</h2>
              <p>Moments uses location services to help you discover nearby events and connect with people in your area. We only collect location data when you explicitly grant permission, and you can disable location services at any time through your device settings.</p>
            </section>

            <section>
              <h2>4. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
              <ul>
                <li>With your explicit permission</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in operating our platform</li>
              </ul>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2>6. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your account and associated data at any time.</p>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of certain communications</li>
                <li>Request information about how we use your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2>8. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2>9. Third-Party Services</h2>
              <p>Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services.</p>
            </section>

            <section>
              <h2>10. Children's Privacy</h2>
              <p>Moments is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
            </section>

            <section>
              <h2>11. International Users</h2>
              <p>If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.</p>
            </section>

            <section>
              <h2>12. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2>13. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:makemomentsapp@gmail.com">makemomentsapp@gmail.com</a></p>
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
            <Link to="/admin">Admin</Link>
            <a href="mailto:makemomentsapp@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default Privacy;
