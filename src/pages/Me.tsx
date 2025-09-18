import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/logo.png';
import '../App.scss';

export default function Me() {
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(p);
      const { data: t } = await supabase.from('tasks').select('*').eq('assignee', user.id).order('created_at', { ascending: false });
      setTasks(t || []);
    })();
  }, []);

  if (!profile) return null;

  return (
    <div className="App">
      <header className="site-header">
        <Link to="/" className="brand">
          <img className="brand-logo" src={logo} alt="moments logo" />
        </Link>
      </header>

      <main className="legal-content">
        <div className="legal-container">
          <h1>Welcome, {profile.full_name ?? 'New Intern'}</h1>

          <div className="dashboard">
            <div className="card">
              <div className="card-title">Profile</div>
              <div className="card-body">
                <div>Role: {profile.role}</div>
                <div>Email: {profile.email}</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Your Tasks</div>
              <div className="card-body">
                {tasks.length === 0 && <div>No tasks yet.</div>}
                <ul className="tasks-list">
                  {tasks.map(t => (
                    <li key={t.id} className="task-item">
                      <span>{t.title}</span>
                      <span className="task-status">{t.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-left">&copy; {new Date().getFullYear()} Moments. All rights reserved.</div>
        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/waitlist">Waitlist</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/consent">Consent</Link>
          <a href="mailto:contact@havemoments.com">Contact</a>
        </nav>
      </footer>
    </div>
  );
}
