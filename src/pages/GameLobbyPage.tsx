import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { PlusCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

type OpenGame = {
  game_id: number;
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

  const handleJoinGame = async (gameId: number) => {
    if (!user) return alert('You must be logged in to join a game.');
    setJoining(gameId);
    const { error: insertError } = await supabase.from('matchmaking_players').insert({
        game_id: gameId,
        player_id: user.id,
    });
    if (insertError) {
        if (insertError.code === '23505') alert("You've already joined this game!");
        else alert('Failed to join the game. Please try again.');
    } else {
        const { error: rpcError } = await supabase.rpc('trigger_payment_collection_if_full', { p_game_id: gameId });
        if (rpcError) console.error("Error triggering payment collection:", rpcError);
        alert('You have successfully joined the game!');
        fetchOpenGames();
    }
    setJoining(null);
  };

  const sportTitle = sportId ? sportId.charAt(0).toUpperCase() + sportId.slice(1) : 'Games';

  return (
    <div>
      <main className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">{sportTitle} Lobby</h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to={`/host-game/${sportId}`} className="block p-6 md:p-8 bg-brand-primary/80 backdrop-blur-sm text-white rounded-2xl shadow-lg hover:bg-brand-primary transition border border-blue-400/50">
            <PlusCircle size={40} />
            <h2 className="mt-4 text-2xl font-bold">Host a New Game</h2>
            <p className="mt-2">Choose a turf, set the time, and invite others to join.</p>
          </Link>
          <div className="p-6 md:p-8 bg-brand-card/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50">
            <Users size={40} className="text-brand-accent" />
            <h2 className="mt-4 text-2xl font-bold text-white">Join an Existing Game</h2>
            <p className="mt-2 text-gray-300">Browse the list below to find a game that needs players.</p>
          </div>
        </div>

        <section className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Open Games</h2>
          <div className="mt-6">
            {loading ? (
              <p className="text-gray-300">Loading open games...</p>
            ) : openGames.length > 0 ? (
              <div className="space-y-4">
                {openGames.map(game => (
                  <div key={game.game_id} className="bg-brand-card/70 backdrop-blur-sm p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-700/50">
                    <Link to={`/match/${game.game_id}`} className="flex-grow w-full">
                      <p className="font-bold text-lg text-white">{game.turf_name}</p>
                      <p className="text-sm text-gray-300">{new Date(game.start_time).toLocaleString()}</p>
                    </Link>
                    <div className="flex justify-between w-full sm:w-auto sm:gap-6 items-center">
                      <div className="text-center">
                        <p className="font-semibold text-white">{game.players_joined} / {game.players_needed}</p>
                        <p className="text-xs text-gray-400">Players</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleJoinGame(game.game_id);
                        }}
                        disabled={joining === game.game_id || game.players_joined >= game.players_needed}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                      >
                        {joining === game.game_id ? 'Joining...' : game.players_joined >= game.players_needed ? 'Full' : 'Join'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No open {sportTitle} games right now. Why not host one?</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}