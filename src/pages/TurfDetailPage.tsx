import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { Turf } from '../types';
import { generateTimeSlots } from '../utils/timeHelpers';
import { MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from '../components/DatePicker';

export default function TurfDetailPage() {
  const { turfId } = useParams<{ turfId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const { sportId } = location.state || {};
  const [turf, setTurf] = useState<Turf | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unavailableSlots, setUnavailableSlots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [playersNeeded, setPlayersNeeded] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextImage = () => {
    if (turf && turf.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % turf.images.length);
    }
  };
  const prevImage = () => {
    if (turf && turf.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + turf.images.length) % turf.images.length);
    }
  };

  useEffect(() => {
    const fetchTurfDetails = async () => {
      if (!turfId) return;
      setLoading(true);
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23, 59, 59, 999);
      const turfPromise = supabase.from('turfs').select('*').eq('id', turfId).single();
      const bookingsPromise = supabase.from('bookings').select('start_time, end_time').eq('turf_id', turfId).gte('start_time', dayStart.toISOString()).lte('start_time', dayEnd.toISOString());
      const gamesPromise = supabase.from('matchmaking_games').select('start_time, end_time, status').eq('turf_id', turfId).in('status', ['pending', 'collecting_payment', 'confirmed']).gte('start_time', dayStart.toISOString()).lte('start_time', dayEnd.toISOString());
      
      const [{ data: turfData, error: turfError }, { data: bookingsData }, { data: gamesData }] = await Promise.all([turfPromise, bookingsPromise, gamesPromise]);
      
      if (turfData) setTurf(turfData as Turf);
      
      const bookedSlots = new Set<string>();
      const processBookings = (bookings: { start_time: string, end_time: string }[]) => {
          bookings?.forEach(b => {
              const start = new Date(b.start_time);
              const end = new Date(b.end_time);
              for (let d = start; d < end; d.setHours(d.getHours() + 1)) {
                  bookedSlots.add(d.toISOString().slice(0, 16));
              }
          });
      };
      
      processBookings(bookingsData || []);
      processBookings(gamesData || []);

      setUnavailableSlots(bookedSlots);
      setLoading(false);
    };
    fetchTurfDetails();
  }, [turfId, selectedDate]);
  
  const handleHostGame = async () => {
    if (!turf || !selectedSlot || !user) return;
    const gameSport = sportId || turf.sports_available[0];
    setIsSubmitting(true);
    const endTime = new Date(selectedSlot);
    endTime.setHours(endTime.getHours() + 1);
    const { data: gameData, error: gameError } = await supabase.from('matchmaking_games').insert({
      turf_id: turf.id,
      host_id: user.id,
      sport: gameSport,
      start_time: selectedSlot.toISOString(),
      end_time: endTime.toISOString(),
      players_needed: playersNeeded,
      cost_per_player: turf.price_per_hour / playersNeeded,
      status: 'pending',
    }).select().single();
    if (gameError) {
      alert('Failed to host game. The slot may have just been taken. Please refresh and try again.');
      setIsSubmitting(false);
      return;
    }
    await supabase.from('matchmaking_players').insert({ game_id: gameData.id, player_id: user.id });
    alert('Your game is now listed!');
    navigate(`/games/${gameSport}`);
    setIsSubmitting(false);
    setShowModal(false);
  };

  const handleSlotSelect = (slot: Date) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };
  const navigateToPayment = () => {
    if (!turf || !selectedSlot) return;
    const amount = turf.price_per_hour;
    navigate('/payment', { state: { turf, selectedSlot: selectedSlot.toISOString(), isMatchmaking: false, playersNeeded: 0, amount } });
  };

  if (loading) return <div className="text-center py-20 text-white">Loading turf details...</div>;
  if (!turf) return <div className="text-center py-20 text-white">Turf not found.</div>;
  const timeSlots = generateTimeSlots(selectedDate);

  return (
    <>
      <main className="max-w-7xl mx-auto py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-brand-card/70 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-gray-700/50">
          <div className="relative">
            <img src={turf.images?.[currentImageIndex] || '/placeholder-turf.jpg'} alt={turf.name} className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg" />
            {turf.images && turf.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{turf.name}</h1>
            <p className="flex items-center justify-center md:justify-start text-lg text-gray-300 mt-2"><MapPin size={18} className="mr-2 text-brand-accent" />{turf.location}</p>
            <p className="flex items-center justify-center md:justify-start text-lg text-gray-300 mt-2"><Clock size={18} className="mr-2 text-brand-accent" />{turf.operating_hours.open} - {turf.operating_hours.close}</p>
            <p className="mt-4 text-3xl font-bold text-brand-primary">₹{turf.price_per_hour}<span className="text-lg font-normal text-gray-400">/hr</span></p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Choose a Time Slot</h2>
          <div className="mt-6 overflow-x-auto pb-4">
            <div className="inline-block">
                <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {timeSlots.map(slot => {
              const slotKey = slot.toISOString().slice(0, 16);
              const isUnavailable = unavailableSlots.has(slotKey);
              const isPast = slot < new Date();
              return (
                <button
                  key={slot.toISOString()}
                  disabled={isUnavailable || isPast}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-3 md:p-4 rounded-lg text-center font-semibold transition text-sm md:text-base ${isUnavailable || isPast ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-brand-card/70 backdrop-blur-sm border border-gray-700/50 shadow-md hover:bg-brand-primary hover:text-white'}`}
                >
                  {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-brand-dark p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white">Confirm Your Booking</h2>
            <p className="mt-2 text-gray-300 text-sm md:text-base">You are booking <strong>{turf.name}</strong> for <strong>{selectedSlot?.toLocaleString([], { weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-700 rounded-lg flex flex-col bg-brand-card/50">
                <h3 className="font-bold text-lg text-white">Book Privately</h3>
                <p className="text-sm text-gray-400 mt-1 flex-grow">Book the entire turf for your group.</p>
                <p className="mt-4 font-semibold text-xl text-white">Total: ₹{turf.price_per_hour}</p>
                <button onClick={navigateToPayment} disabled={isSubmitting} className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50">Proceed to Pay</button>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg flex flex-col bg-brand-card/50">
                <h3 className="font-bold text-lg text-white">Host Matchmaking</h3>
                <p className="text-sm text-gray-400 mt-1 flex-grow">Find other players. No payment now.</p>
                <div className="mt-1">
                  <label htmlFor="players" className="text-sm font-medium text-gray-300">Total players?</label>
                  <select id="players" value={playersNeeded} onChange={e => setPlayersNeeded(Number(e.target.value))} className="w-full mt-1 p-2 border border-gray-600 bg-gray-900 rounded-md text-white">
                    <option value={2}>2 (1v1)</option>
                    <option value={4}>4 (2v2)</option>
                    <option value={10}>10 (5v5)</option>
                  </select>
                </div>
                <p className="mt-2 font-semibold text-lg text-white">Share: ₹{(turf.price_per_hour / playersNeeded).toFixed(2)}</p>
                <button onClick={handleHostGame} disabled={isSubmitting} className="mt-4 w-full px-4 py-2 bg-brand-primary text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Hosting...' : 'Host Game'}</button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => setShowModal(false)} className="text-sm text-gray-400 hover:underline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}