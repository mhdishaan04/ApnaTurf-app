import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import TurfCard from '../components/TurfCard';
import { Turf } from '../types';

export default function HostGamePage() {
  const { sportId } = useParams<{ sportId: string }>();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      if (!sportId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('turfs')
        .select('*')
        .filter('sports_available', 'cs', `{${sportId}}`) // Check if sportId is in the array
        .eq('is_approved', true);

      if (error) {
        console.error('Error fetching turfs:', error);
      } else {
        setTurfs(data as Turf[]);
      }
      setLoading(false);
    };

    fetchTurfs();
  }, [sportId]);

  const sportTitle = sportId ? sportId.charAt(0).toUpperCase() + sportId.slice(1) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Host a {sportTitle} Game</h1>
        <p className="mt-2 text-lg text-gray-600">Select a turf to book your game slot.</p>

        <div className="mt-10">
          {loading ? (
            <p>Loading available turfs...</p>
          ) : turfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Sorry, no approved turfs are available for {sportTitle} right now.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}