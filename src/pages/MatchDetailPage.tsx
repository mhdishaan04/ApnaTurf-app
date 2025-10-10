import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { User, CheckCircle, XCircle } from 'lucide-react';

type Player = { player_id: string; payment_status: 'paid' | 'unpaid'; full_name: string; mobile_number: string; };
type GameDetails = { id: number; sport: string; turf_name: string; start_time: string; status: 'pending' | 'collecting_payment' | 'confirmed'; cost_per_player: number; players_needed: number; host_id: string; };

export default function MatchDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const fetchGameDetails = async () => {
      setLoading(true);
      const { data: gameData, error: gameError } = await supabase.from('matchmaking_games').select('*, turf:turfs(name)').eq('id', sessionId).single();
      if (gameError) { console.error("Initial fetch failed:", gameError); setLoading(false); return; }
      const formattedGame = { ...gameData, turf_name: gameData.turf.name };
      setGame(formattedGame);
      const { data: playersData, error: playersError } = await supabase.rpc('get_players_for_game', { p_game_id: sessionId });
      if (playersError) console.error(playersError);
      else setPlayers(playersData as Player[]);
      setLoading(false);
    };
    fetchGameDetails();
    const channel = supabase.channel(`game-${sessionId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'matchmaking_games', filter: `id=eq.${sessionId}` }, (payload) => {
      fetchGameDetails();
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'matchmaking_players', filter: `game_id=eq.${sessionId}` }, (payload) => {
      fetchGameDetails();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handlePayNow = async () => {
    if (!user || !game) return;
    setIsPaying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const { error: updateError } = await supabase.from('matchmaking_players').update({ payment_status: 'paid' }).eq('game_id', game.id).eq('player_id', user.id);
    if (updateError) {
      alert('Payment failed. Please try again.');
    } else {
      const { error: rpcError } = await supabase.rpc('confirm_booking_if_all_paid', { p_game_id: game.id });
      if (rpcError) console.error("Error confirming booking:", rpcError);
      else alert('Payment successful!');
    }
    setIsPaying(false);
  };

  if (loading) return <div className="text-center py-20 text-white">Loading Game Details...</div>;
  if (!game) return <div className="text-center py-20 text-white">Game not found.</div>;

  const currentPlayer = players.find(p => p.player_id === user?.id);
  
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-brand-card/70 backdrop-blur-sm p-6 rounded-lg shadow-md mb-8 border border-gray-700/50">
        <h1 className="text-3xl font-bold text-white">{game.turf_name}</h1>
        <p className="text-lg text-gray-300">{new Date(game.start_time).toLocaleString()}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-bold text-white">{players.length} / {game.players_needed} <span className="text-lg font-normal text-gray-400">Players Joined</span></p>
          <span className={`px-4 py-1 rounded-full font-semibold text-sm ${ game.status === 'confirmed' ? 'bg-green-200 text-green-800' : game.status === 'collecting_payment' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800' }`}>
            {game.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {game.status === 'collecting_payment' && currentPlayer?.payment_status === 'unpaid' && (
        <div className="bg-green-600/80 backdrop-blur-sm text-white p-6 rounded-lg shadow-lg mb-8 text-center border border-green-400/50">
          <h2 className="text-2xl font-bold">The game is full! It's time to pay.</h2>
          <p className="mt-2">Pay your share to confirm your spot and book the turf.</p>
          <button onClick={handlePayNow} disabled={isPaying} className="mt-4 px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-70">
            {isPaying ? 'Processing...' : `Pay Your Share (₹${game.cost_per_player})`}
          </button>
        </div>
      )}
      
      <div className="bg-brand-card/70 backdrop-blur-sm p-6 rounded-lg shadow-md border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white">Players</h2>
        <div className="mt-4 space-y-4">
          {players.map((player) => (
            <div key={player.player_id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-md border border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold"><User size={20} /></div>
                <div className="ml-4">
                  <p className="font-semibold text-white">{player.full_name} {player.player_id === game.host_id ? '(Host)' : ''}</p>
                  <p className="text-sm text-gray-400">{player.mobile_number || 'No mobile number'}</p>
                </div>
              </div>
              {game.status !== 'pending' && (
                player.payment_status === 'paid' ?
                <CheckCircle className="text-green-500" /> :
                <XCircle className="text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}