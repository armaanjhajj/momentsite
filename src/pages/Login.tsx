import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/logo.png';
import '../App.scss';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'signin'|'claim'>('signin');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = window.location.origin + '/onboard';

  const signInGoogle = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect } });
    setLoading(false);
    if (error) setError(error.message);
  };

  const signInWithEmailPassword = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message); else setStage('claim');
  };

  const signUpWithEmailPassword = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirect } });
    setLoading(false);
    if (error) setError(error.message); else setStage('claim');
  };

  const claim = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.rpc('claim_invite', { p_code: code });
    setLoading(false);
    if (error) setError(error.message); else nav('/me');
  };

  return (
    <div className="App">
      <header className="site-header">
        <Link to="/" className="brand">
          <img className="brand-logo" src={logo} alt="moments logo" />
        </Link>
      </header>

      <main className="legal-content">
        <div className="legal-container">
          <h1>Moments Team Login</h1>
          <div className="login-box">
            {stage === 'signin' && (
              <div className="login-stage">
                <button onClick={signInGoogle} className="btn">
                  {loading ? 'Loading…' : 'Continue with Google'}
                </button>
                <div className="or-sep">or</div>
                <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <div className="btn-row">
                  <button onClick={signInWithEmailPassword} className="btn">Sign in</button>
                  <button onClick={signUpWithEmailPassword} className="btn secondary">Create account</button>
                </div>
              </div>
            )}

            {stage === 'claim' && (
              <div className="login-stage">
                <p className="helper-text">Enter your invite code to continue</p>
                <input className="input" placeholder="Invite Code" value={code} onChange={e=>setCode(e.target.value)} />
                <button onClick={claim} className="btn">Continue</button>
              </div>
            )}

            {error && <div className="error-text">{error}</div>}
          </div>
        </div>
      </main>

      {/* Footer moved to global Footer component (rendered from App.jsx) */}
    </div>
  );
}
