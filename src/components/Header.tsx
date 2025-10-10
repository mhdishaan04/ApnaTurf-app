import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      if (data && !error) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5 border-b border-gray-800">
          <Link to="/" className="text-2xl font-bold text-white tracking-wider">
            ApnaTurf
          </Link>
          <div className="flex items-center space-x-6">
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 font-semibold">
                Admin Panel
              </Link>
            )}
            <Link to="/my-games" className="text-gray-300 hover:text-white transition font-semibold">My Games</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition font-semibold">Profile</Link>
            {user ? (
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">Logout</button>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}