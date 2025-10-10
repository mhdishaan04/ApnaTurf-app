import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const checkAdminRole = async () => {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (!error && data) {
          setIsAdmin(true);
        }
        setLoading(false);
      };
      checkAdminRole();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  return { isAdmin, loading };
}