import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import '../App.scss';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvpData, setRsvpData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load RSVP data from API on component mount
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.waitlist);
        if (response.ok) {
          const data = await response.json();
          setRsvpData(data.data || []);
        } else {
          console.error('Failed to fetch waitlist data');
          // Fallback to localStorage if API fails
          const savedData = localStorage.getItem('rsvpData');
          if (savedData) {
            setRsvpData(JSON.parse(savedData));
          }
        }
      } catch (error) {
        console.error('Error fetching waitlist data:', error);
        // Fallback to localStorage if API fails
        const savedData = localStorage.getItem('rsvpData');
        if (savedData) {
          setRsvpData(JSON.parse(savedData));
        }
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Moments2025!!') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const exportToCSV = () => {
    const headers = ['Phone Number', 'Name', 'Message', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...rsvpData.map(item => [
        item.phoneNumber,
        item.name || '',
        item.message || '',
        new Date(item.timestamp).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moments-rsvp-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all RSVP data? This action cannot be undone.')) {
      try {
        // Clear from database
        const response = await fetch(API_ENDPOINTS.waitlist, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          console.log('Database cleared successfully');
        } else {
          console.error('Failed to clear database');
        }
      } catch (error) {
        console.error('Error clearing database:', error);
      }
      
      // Clear from localStorage as fallback
      localStorage.removeItem('rsvpData');
      setRsvpData([]);
    }
  };

  if (!isAuthenticated) {
    return (
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

        <main className="admin-login">
          <div className="admin-login-container">
            <h1>Admin Access</h1>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="admin-login-btn">Login</button>
            </form>
            <div className="admin-footer">
              <Link to="/" className="back-home">← Back to Home</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
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
        <div className="admin-header-controls">
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <div className="admin-stats">
              <span className="stat-item">
                <strong>Total RSVPs:</strong> {rsvpData.length}
              </span>
            </div>
          </div>

          <div className="admin-controls">
            <button onClick={exportToCSV} className="export-btn">
              Export to CSV
            </button>
            <button onClick={clearAllData} className="clear-btn">
              Clear All Data
            </button>
          </div>

          <div className="rsvp-list">
            {rsvpData.length === 0 ? (
              <div className="no-data">No RSVP data available</div>
            ) : (
              <div className="rsvp-table">
                <div className="rsvp-header">
                  <div className="rsvp-cell">Phone Number</div>
                  <div className="rsvp-cell">Name</div>
                  <div className="rsvp-cell">Message</div>
                  <div className="rsvp-cell">Timestamp</div>
                </div>
                {rsvpData.map((item, index) => (
                  <div key={index} className="rsvp-row">
                    <div className="rsvp-cell">{item.phoneNumber}</div>
                    <div className="rsvp-cell">{item.name || '-'}</div>
                    <div className="rsvp-cell">{item.message || '-'}</div>
                    <div className="rsvp-cell">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-footer">
            <Link to="/" className="back-home">← Back to Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
