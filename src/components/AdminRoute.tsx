import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';

type Props = {
  children: JSX.Element;
};

export default function AdminRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

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
        setIsRoleLoading(false);
      };
      checkAdminRole();
    } else if (!loading) {
      setIsRoleLoading(false);
    }
  }, [user, loading]);

  if (loading || isRoleLoading) {
    return <div>Loading and verifying access...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" />; // Redirect non-admins to the homepage
  }

  return children;
}