import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Manifesto from './pages/Manifesto';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Consent from './pages/Consent';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Onboard from './pages/Onboard';
import Me from './pages/Me';
import ProtectedRoute from './ProtectedRoute';
import './App.scss';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;