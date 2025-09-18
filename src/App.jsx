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

function App() {
  return (
    <Router>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/waitlist" element={<Waitlist />} />
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
    </Router>
  );
}

export default App;