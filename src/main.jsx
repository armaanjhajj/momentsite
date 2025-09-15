import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Client-side host redirect for jobs subdomain
if (typeof window !== 'undefined') {
  const host = window.location.host.toLowerCase();
  if (host === 'jobs.havemoments.com' && window.location.pathname !== '/jobs') {
    window.history.replaceState(null, '', '/jobs');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);