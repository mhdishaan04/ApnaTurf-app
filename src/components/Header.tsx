import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Header() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BookMyTurf
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-600 hover:text-blue-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}