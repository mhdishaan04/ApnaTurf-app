import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { PlusCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

// A simplified and more accurate type for our sessions
type OpenGame = {
  session_id: number;
  turf_name: string;
  start_time: string;
  players_needed: number;
  players_joined: number;
};

export default function GameLobbyPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const { user } = useAuth();

  const [openGames, setOpenGames] = useState<OpenGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<number | null>(null);

  // This function is now more reliable for fetching games
  const fetchOpenGames = async () => {
    if (!sportId) return;
    setLoading(true);

    const { data, error } = await supabase.rpc('get_open_games_for_sport', { sport_name: sportId });

    if (error) {
      console.error("Error fetching open games:", error);
      setOpenGames([]);
    } else {
      setOpenGames(data as OpenGame[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOpenGames();
  }, [sportId]);

  const handleJoinGame = async (sessionId: number) => {
    if (!user) {
      alert('You must be logged in to join a game.');
      return;
    }
    setJoining(sessionId);

    // Logic to join the game
    const { error } = await supabase.from('matchmaking_players').insert({
      session_id: sessionId,
      player_id: user.id,
    });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        alert("You've already joined this game!");
      } else {
        alert('Failed to join the game. Please try again.');
        console.error(error);
      }
    } else {
      alert('You have successfully joined the game!');
      fetchOpenGames(); // Refresh the list
    }
    setJoining(null);
  };
  
  const sportTitle = sportId ? sportId.charAt(0).toUpperCase() + sportId.slice(1) : 'Games';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900">{sportTitle} Lobby</h1>
        
        {/* Host or Join Options */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to={`/host-game/${sportId}`} className="block p-8 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition">
            <PlusCircle size={40} />
            <h2 className="mt-4 text-2xl font-bold">Host a New Game</h2>
            <p className="mt-2">Choose a turf, set the time, and invite others to join your match.</p>
          </Link>
          <div className="p-8 bg-white rounded-2xl shadow-lg">
            <Users size={40} className="text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Join an Existing Game</h2>
            <p className="mt-2">Browse the list below to find a game that needs players.</p>
          </div>
        </div>

        {/* List of Open Games */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900">Open Games</h2>
          <div className="mt-6">
            {loading ? (
              <p>Loading open games...</p>
            ) : openGames.length > 0 ? (
              <div className="space-y-4">
                {openGames.map(game => (
                  <Link to={`/match/${game.session_id}`} key={game.session_id} className="block">
                    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-bold text-lg">{game.turf_name}</p>
                        <p className="text-gray-600">{new Date(game.start_time).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{game.players_joined} / {game.players_needed}</p>
                        <p className="text-sm text-gray-500">Players</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // This is important to stop the Link navigation
                          handleJoinGame(game.session_id);
                        }}
                        disabled={joining === game.session_id || game.players_joined >= game.players_needed}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 relative z-10"
                      >
                        {joining === game.session_id ? 'Joining...' : game.players_joined >= game.players_needed ? 'Full' : 'Join Game'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No open {sportTitle} games right now. Why not host one?</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}