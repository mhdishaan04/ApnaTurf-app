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

  // Get booking details passed from the previous page
  const { turf, selectedSlot, isMatchmaking, playersNeeded, amount } = state || {};

  if (!turf || !selectedSlot || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Invalid booking details. Please start over.</p>
      </div>
    );
  }

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // This is the booking logic we moved from the TurfDetailPage
    const endTime = new Date(selectedSlot);
    endTime.setHours(endTime.getHours() + 1);

    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        turf_id: turf.id,
        user_id: user.id,
        start_time: selectedSlot,
        end_time: endTime.toISOString(),
        total_price: turf.price_per_hour,
        is_matchmaking: isMatchmaking,
      })
      .select()
      .single();

    if (bookingError) {
      alert('Failed to create booking. Payment has not been charged.');
      setProcessing(false);
      return;
    }

    if (isMatchmaking) {
      const { error: sessionError } = await supabase
        .from('matchmaking_sessions')
        .insert({
          booking_id: bookingData.id,
          host_id: user.id,
          players_needed: playersNeeded,
          cost_per_player: turf.price_per_hour / playersNeeded,
        });

      if (sessionError) {
        alert('Booking failed during session creation. Payment has not been charged.');
        setProcessing(false);
        return;
      }
    }
    
    // On success, navigate to the confirmation page
    navigate('/confirmation', { state: { bookingId: bookingData.id, turfName: turf.name, slot: selectedSlot } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Confirm & Pay</h1>
        
        {/* Booking Summary */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
          <h2 className="font-semibold text-lg">Booking Summary</h2>
          <div className="mt-2 space-y-2 text-gray-700">
            <div className="flex justify-between"><span>Turf:</span><span className="font-medium">{turf.name}</span></div>
            <div className="flex justify-between"><span>Date:</span><span className="font-medium">{new Date(selectedSlot).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span>Time:</span><span className="font-medium">{new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-baseline">
            <span className="font-bold text-xl">Total Amount:</span>
            <span className="font-bold text-2xl text-blue-600">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Mock Payment Form */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg">Payment Method</h2>
          <div className="mt-2 p-4 border rounded-lg flex items-center bg-blue-50">
            <CreditCard className="text-blue-600" />
            <p className="ml-3 font-medium text-blue-800">Card / UPI (Simulation)</p>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full mt-8 bg-green-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
        >
          {processing ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
        </button>
        <p className="flex items-center justify-center mt-4 text-sm text-gray-500">
          <ShieldCheck size={14} className="mr-1 text-green-600" /> Secure Payment Simulation
        </p>
      </div>
    </div>
  );
}

