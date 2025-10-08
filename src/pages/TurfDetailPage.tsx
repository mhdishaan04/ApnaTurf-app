import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { useAuth } from '../context/AuthProvider';
import { Turf, Booking } from '../types';
import { generateTimeSlots, getBookedSlots } from '../utils/timeHelpers';
import { MapPin, Clock, Star } from 'lucide-react';
import StarRating from '../components/StarRating';
import DatePicker from '../components/DatePicker';

// Define the Review type for this page
type Review = {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  user_id: string; // Needed to check if the current user has reviewed
  user_profiles: { full_name: string };
};

export default function TurfDetailPage() {
  const { turfId } = useParams<{ turfId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // All state for the component
  const [turf, setTurf] = useState<Turf | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State for the review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // State for the booking modal
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [playersNeeded, setPlayersNeeded] = useState(10);

  const fetchTurfDetails = async () => {
    if (!turfId) return;
    setLoading(true);

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Fetch all data in parallel
    const turfPromise = supabase.from('turfs').select('*').eq('id', turfId).single();
    const bookingsPromise = supabase.from('bookings').select('*').eq('turf_id', turfId).gte('start_time', dayStart.toISOString()).lte('start_time', dayEnd.toISOString());
    const reviewsPromise = supabase.from('reviews').select('*, user_id, user_profiles(full_name)').eq('turf_id', turfId);

    const [ { data: turfData, error: turfError }, { data: bookingsData, error: bookingsError }, { data: reviewsData, error: reviewsError } ] = await Promise.all([turfPromise, bookingsPromise, reviewsPromise]);

    if (turfError) console.error('Error fetching turf:', turfError);
    else setTurf(turfData as Turf);

    if (bookingsError) console.error('Error fetching bookings:', bookingsError);
    else setBookings(bookingsData as Booking[]);
    
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
    } else {
      setReviews(reviewsData as Review[]);
      if (user && reviewsData.some(review => review.user_id === user.id)) {
        setHasUserReviewed(true);
      } else {
        setHasUserReviewed(false);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchTurfDetails();
  }, [turfId, selectedDate, user]);

  const handleSlotSelect = (slot: Date) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const navigateToPayment = (isMatchmaking: boolean) => {
    if (!turf || !selectedSlot) return;
    const amount = isMatchmaking ? turf.price_per_hour / playersNeeded : turf.price_per_hour;
    navigate('/payment', {
      state: { turf, selectedSlot: selectedSlot.toISOString(), isMatchmaking, playersNeeded, amount },
    });
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return alert('Please select a rating.');
    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert({ turf_id: turfId, user_id: user.id, rating, comment });
    setIsSubmitting(false);
    if (error) {
      if (error.code === '23505') alert("You've already reviewed this turf.");
      else alert('Failed to submit review.');
    } else {
      alert('Review submitted successfully!');
      setComment('');
      setRating(0);
      fetchTurfDetails();
    }
  };

  if (loading) return <div>Loading turf details...</div>;
  if (!turf) return <div>Turf not found.</div>;

  const timeSlots = generateTimeSlots(selectedDate);
  const bookedSlots = getBookedSlots(timeSlots, bookings);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Turf Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div><img src={turf.images?.[0] || '/placeholder-turf.jpg'} alt={turf.name} className="w-full h-80 object-cover rounded-lg shadow-lg"/></div>
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-gray-900">{turf.name}</h1>
            <p className="flex items-center text-lg text-gray-600 mt-2"><MapPin size={18} className="mr-2"/>{turf.location}</p>
            <p className="flex items-center text-lg text-gray-600 mt-2"><Clock size={18} className="mr-2"/>{turf.operating_hours.open} - {turf.operating_hours.close}</p>
            <p className="mt-4 text-3xl font-bold text-blue-600">₹{turf.price_per_hour}<span className="text-lg font-normal text-gray-500">/hr</span></p>
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900">Book a Slot</h2>
          <div className="mt-6"><DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} /></div>
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {timeSlots.map(slot => {
              const isBooked = bookedSlots.has(slot.toISOString());
              const isPast = slot < new Date();
              return (<button key={slot.toISOString()} disabled={isBooked || isPast} onClick={() => handleSlotSelect(slot)} className={`p-4 rounded-lg text-center font-semibold transition ${isBooked || isPast ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white shadow-md hover:bg-blue-500 hover:text-white'}`}>{slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</button>);
            })}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h2>
          {hasUserReviewed ? (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-center"><h3 className="font-bold text-xl text-green-600">Thank you for your review!</h3></div>
          ) : (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-xl">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                <div><label className="block font-medium">Your Rating</label><StarRating rating={rating} setRating={setRating} /></div>
                <div><label htmlFor="comment" className="block font-medium">Your Comment</label><textarea id="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full mt-1 p-2 border rounded-md" placeholder="Share your experience..."></textarea></div>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
              </form>
            </div>
          )}
          
          <div className="mt-8 space-y-6">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-white p-5 rounded-lg shadow">
                  <div className="flex items-center justify-between"><p className="font-semibold">{review.user_profiles.full_name}</p><div className="flex">{[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="text-yellow-500 fill-current" />)}</div></div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-3 text-right">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))
            ) : (<p className="mt-8 text-center text-gray-500">No reviews yet. Be the first to leave one!</p>)}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
            <p className="mt-2 text-gray-600">You are booking <strong>{turf?.name}</strong> for <strong>{selectedSlot?.toLocaleString([], { weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>.</p>
            <div className="mt-6 border-b border-gray-200"><nav className="-mb-px flex space-x-8"><p className="border-transparent text-gray-500 py-4 px-1 border-b-2 font-medium text-sm">Choose your booking type:</p></nav></div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg">Book Privately</h3>
                <p className="text-sm text-gray-600 mt-1">Book the turf for your friends.</p>
                <p className="mt-4 font-semibold text-xl">Total: ₹{turf?.price_per_hour}</p>
                <button onClick={() => navigateToPayment(false)} className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md">Proceed to Pay</button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg">List for Matchmaking</h3>
                <div className="mt-1"><label htmlFor="players" className="text-sm font-medium text-gray-700">Total players?</label><select id="players" value={playersNeeded} onChange={(e) => setPlayersNeeded(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md"><option value={10}>10 (5v5)</option><option value={12}>12 (6v6)</option><option value={14}>14 (7v7)</option></select></div>
                <p className="mt-2 font-semibold text-xl">Your Share: ₹{(turf ? turf.price_per_hour / playersNeeded : 0).toFixed(2)}</p>
                <button onClick={() => navigateToPayment(true)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md">Proceed to Pay</button>
              </div>
            </div>
            <div className="mt-6 text-center"><button onClick={() => setShowModal(false)} className="text-sm text-gray-600 hover:underline">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}