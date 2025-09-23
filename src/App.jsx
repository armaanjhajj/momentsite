import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Manifesto from './pages/Manifesto';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Consent from './pages/Consent';
import Jobs from './pages/Jobs';
const Login = React.lazy(() => import('./pages/Login'));
const Onboard = React.lazy(() => import('./pages/Onboard'));
const Me = React.lazy(() => import('./pages/Me'));
const ProtectedRoute = React.lazy(() => import('./ProtectedRoute'));
import About from './pages/About';
import Waitlist from './pages/Waitlist';
import QR1 from './pages/QR1';
import QR2 from './pages/QR2';
import './App.scss';
import Footer from './components/Footer';
import Header from './components/Header';
import Features from './pages/Features';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Press from './pages/Press';
import Community from './pages/Community';
import Team from './pages/Team';
import Download from './pages/Download';
import Safety from './pages/Safety';
import Rutgers from './pages/Rutgers';

function App() {
  return (
    <Router>
  <React.Suspense fallback={null}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/features" element={<Features />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/press" element={<Press />} />
          <Route path="/community" element={<Community />} />
          <Route path="/team" element={<Team />} />
          <Route path="/download" element={<Download />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/rutgers" element={<Rutgers />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
          <Route path="/qr1" element={<QR1 />} />
          <Route path="/qr2" element={<QR2 />} />
        </Routes>
      </React.Suspense>
      {/* Site footer with embedded logo */}
      <Footer />
    </Router>
  );
}

export default App;