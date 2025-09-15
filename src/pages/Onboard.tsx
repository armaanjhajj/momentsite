import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Onboard() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        nav('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('invite_code_used')
        .eq('id', user.id)
        .single();
      if (profile?.invite_code_used) nav('/me'); else nav('/login');
      setChecking(false);
    })();
  }, []);

  return checking ? null : null;
}
