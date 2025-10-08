import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { User } from 'lucide-react';

type Player = {
  full_name: string;
  mobile_number: string;
};

export default function MatchDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!sessionId) return;
      setLoading(true);

      const { data, error } = await supabase.rpc('get_players_for_session', {
        session_id_param: Number(sessionId),
      });

      if (error) {
        console.error('Error fetching players:', error);
      } else {
        setPlayers(data as Player[]);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Match Details</h1>
        <p className="mt-2 text-lg text-gray-600">Here's everyone who has joined the game.</p>

        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Players Joined</h2>
          {loading ? (
            <p className="mt-4">Loading players...</p>
          ) : (
            <div className="mt-4 space-y-4">
              {players.map((player, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-100 rounded-md">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                    <User size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">{player.full_name}</p>
                    <p className="text-sm text-gray-600">{player.mobile_number || 'No mobile number provided'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}