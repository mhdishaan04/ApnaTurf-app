import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';

export default function Footer() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      // Check the user_roles table to see if the user has the 'admin' role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (data && !error) {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, [user]);

  return (
    <footer className="bg-gray-800 text-white text-center py-6">
      <div className="space-x-4">
        <Link to="/list-your-turf" className="hover:underline">List Your Turf</Link>
        <span>&bull;</span>
        {/* This is the conditional link. It only appears if isAdmin is true. */}
        {isAdmin && (
          <>
            <Link to="/admin" className="hover:underline text-yellow-400 font-semibold">Admin Panel</Link>
            <span>&bull;</span>
          </>
        )}
        <span>&copy; 2024 BookMyTurf. All rights reserved.</span>
      </div>
    </footer>
  );
}