import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}
