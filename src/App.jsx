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
import './App.scss';

function App() {
  return (
    <Router>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;