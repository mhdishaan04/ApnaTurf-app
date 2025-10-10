import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { Calendar, Users, Lock, ChevronRight } from 'lucide-react';

type UserGame = {
  booking_type: 'matchmaking' | 'private';
  id: number;
  turf_id: number;
  turf_name: string;
  start_time: string;
  players_needed: number;
  players_joined: number;
  status: string;
  is_host: boolean;
};

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [games, setGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGames = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase.rpc('get_all_user_bookings', { p_user_id: user.id });
      if (error) {
        console.error('Error fetching user games:', error);
      } else {
        const sortedData = (data as UserGame[]).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        setGames(sortedData);
      }
      setLoading(false);
    };
    if (user) {
      fetchUserGames();
    }
  }, [user]);

  const matchmakingGames = games.filter(g => g.booking_type === 'matchmaking');
  const privateBookings = games.filter(g => g.booking_type === 'private');

  return (
    <main className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-white">My Games & Bookings</h1>
      <p className="mt-2 text-lg text-gray-300">Here's a list of all your upcoming and past activity.</p>

      <section className="mt-12">
        <h2 className="text-3xl font-bold text-white">Matchmaking Games</h2>
        <div className="mt-6 space-y-4">
          {loading ? <p className="text-gray-300">Loading...</p> : matchmakingGames.length > 0 ? (
            matchmakingGames.map(game => (
              <GameCard key={`match-${game.id}`} game={game} />
            ))
          ) : <p className="text-gray-400">You haven't joined or hosted any matchmaking games.</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold text-white">Private Bookings</h2>
        <div className="mt-6 space-y-4">
          {loading ? <p className="text-gray-300">Loading...</p> : privateBookings.length > 0 ? (
            privateBookings.map(booking => (
              <GameCard key={`private-${booking.id}`} game={booking} />
            ))
          ) : <p className="text-gray-400">You haven't made any private bookings.</p>}
        </div>
      </section>
    </main>
  );
}

function GameCard({ game }: { game: UserGame }) {
  const isPrivate = game.booking_type === 'private';
  const isUpcoming = new Date(game.start_time) >= new Date();
  const linkTarget = isPrivate ? `/turf/${game.turf_id}` : `/match/${game.id}`;

  return (
    <Link to={linkTarget} className={`block bg-brand-card/70 backdrop-blur-sm p-4 rounded-lg shadow-md hover:bg-brand-card transition-shadow border border-gray-700/50 ${!isUpcoming && 'opacity-60'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl text-white">{game.turf_name}</h3>
          <p className="flex items-center text-sm text-gray-300 mt-1"><Calendar size={14} className="mr-2" /> {new Date(game.start_time).toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isPrivate ? (
            <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded-full flex items-center"><Lock size={12} className="mr-1"/>PRIVATE</span>
          ) : (
            <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
              game.status === 'confirmed' ? 'bg-green-200 text-green-800' :
              game.status === 'collecting_payment' ? 'bg-yellow-200 text-yellow-800' :
              'bg-blue-200 text-blue-800'
            }`}>
              {game.status.replace('_', ' ').toUpperCase()}
            </span>
          )}
          <ChevronRight className="text-gray-400" />
        </div>
      </div>
      {!isPrivate && (
        <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-300">
          <p className="flex items-center"><Users size={14} className="mr-2" /> {game.players_joined} / {game.players_needed} Players</p>
          {game.is_host && <span className="font-semibold text-brand-primary">You are the host</span>}
        </div>
      )}
    </Link>
  );
}