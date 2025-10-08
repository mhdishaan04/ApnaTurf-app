import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { Mail, Phone } from 'lucide-react';

// Define the profile type here
type UserProfile = {
  full_name: string | null;
  mobile_number: string | null;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, mobile_number')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Now the page has its own loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="text-center py-20">Loading profile...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center md:flex-row md:items-start">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                {getInitials(profile?.full_name)}
              </div>
            </div>
            <div className="w-full text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900">{profile?.full_name || 'User'}</h1>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <Mail size={20} className="mr-3" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <Phone size={20} className="mr-3" />
                  <span>{profile?.mobile_number || 'No mobile number provided'}</span>
                </div>
              </div>
              <div className="mt-8 flex justify-center md:justify-start space-x-4">
                <button className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300" onClick={() => alert('Edit profile feature coming soon!')}>
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}