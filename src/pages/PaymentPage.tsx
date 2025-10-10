import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const { turf, selectedSlot, isMatchmaking, playersNeeded, amount } = state || {};

  if (!turf || !selectedSlot || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Invalid booking details. Please start over.</p>
      </div>
    );
  }

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const endTime = new Date(selectedSlot);
    endTime.setHours(endTime.getHours() + 1);
    let bookingId: number | null = null;
    if (isMatchmaking) {
      const { data, error } = await supabase.rpc('create_matchmaking_game', {
        p_turf_id: turf.id, p_user_id: user.id, p_start_time: selectedSlot, p_end_time: endTime.toISOString(),
        p_total_price: turf.price_per_hour, p_players_needed: playersNeeded
      });
      if (error) {
        alert('Failed to create the game. Please try again.');
        console.error('RPC Error:', error);
        setProcessing(false);
        return;
      }
      bookingId = data;
    } else {
      const { data, error } = await supabase.from('bookings').insert({
        turf_id: turf.id, user_id: user.id, start_time: selectedSlot, end_time: endTime.toISOString(),
        total_price: turf.price_per_hour, is_matchmaking: false,
      }).select('id').single();
      if (error) {
        alert('Failed to create private booking. Please try again.');
        setProcessing(false);
        return;
      }
      bookingId = data.id;
    }
    navigate('/confirmation', { state: { bookingId, turfName: turf.name, slot: selectedSlot } });
  };

  return (
    <div className="relative min-h-screen bg-brand-dark flex justify-center items-center p-4">
      {/* Video Background */}
       <video autoPlay loop muted className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-30">
        <source src="https://cdn.pixabay.com/video/2023/02/28/152652-803732590_large.mp4" type="video/mp4" />
      </video>
      <div className="w-full max-w-lg bg-brand-card/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700/50">
        <h1 className="text-3xl font-bold text-center text-white">Confirm & Pay</h1>
        <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <h2 className="font-semibold text-lg text-white">Booking Summary</h2>
          <div className="mt-2 space-y-2 text-gray-300">
            <div className="flex justify-between"><span>Turf:</span><span className="font-medium text-white">{turf.name}</span></div>
            <div className="flex justify-between"><span>Date:</span><span className="font-medium text-white">{new Date(selectedSlot).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span>Time:</span><span className="font-medium text-white">{new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-baseline">
            <span className="font-bold text-xl text-white">Total Amount:</span>
            <span className="font-bold text-2xl text-brand-primary">₹{amount.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="font-semibold text-lg text-white">Payment Method</h2>
          <div className="mt-2 p-4 border border-gray-700 rounded-lg flex items-center bg-brand-primary/10">
            <CreditCard className="text-brand-primary" />
            <p className="ml-3 font-medium text-blue-300">Card / UPI (Simulation)</p>
          </div>
        </div>
        <button onClick={handlePayment} disabled={processing} className="w-full mt-8 bg-green-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
          {processing ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
        </button>
        <p className="flex items-center justify-center mt-4 text-sm text-gray-400">
          <ShieldCheck size={14} className="mr-1 text-green-500" /> Secure Payment Simulation
        </p>
      </div>
    </div>
  );
}