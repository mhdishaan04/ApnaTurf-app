import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { Turf } from '../types';

export default function AdminPage() {
  const [pendingTurfs, setPendingTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingTurfs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('turfs')
      .select('*')
      .eq('is_approved', false);

    if (error) {
      console.error('Error fetching pending turfs:', error);
    } else {
      setPendingTurfs(data as Turf[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingTurfs();
  }, []);

  const handleApproval = async (turfId: number, approve: boolean) => {
    if (approve) {
      const { error } = await supabase
        .from('turfs')
        .update({ is_approved: true })
        .eq('id', turfId);
      if (error) alert('Failed to approve turf.');
    } else {
      // Consider adding a confirmation step here in a real app
      const { error } = await supabase
        .from('turfs')
        .delete()
        .eq('id', turfId);
      if (error) alert('Failed to reject turf.');
    }
    fetchPendingTurfs();
  };

  return (
    // Note: The original component had a white background, which doesn't match the site's theme.
    // I'm assuming you might want to wrap this in your `Layout` component for consistency.
    // For now, I'll adjust the existing styles for responsiveness.
    <div className="min-h-screen bg-brand-dark text-white">
      {/* The Header is already responsive from our previous changes */}
      <main className="max-w-7xl mx-auto py-8 md:py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold">Admin Panel</h1>
        <p className="mt-2 text-md md:text-lg text-gray-400">Turf Submissions Awaiting Approval</p>

        <div className="mt-10 space-y-6">
          {loading ? (
            <p>Loading submissions...</p>
          ) : pendingTurfs.length > 0 ? (
            pendingTurfs.map(turf => (
              <div key={turf.id} className="bg-brand-card p-4 md:p-6 rounded-lg shadow-md border border-gray-700/50">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <h2 className="text-xl md:text-2xl font-bold">{turf.name}</h2>
                    <p className="text-gray-400">{turf.location}</p>
                    <p className="mt-2 font-semibold">₹{turf.price_per_hour}/hr</p>
                    <p className="mt-1 text-sm text-gray-500">Sports: {turf.sports_available.join(', ')}</p>
                  </div>
                  <div className="flex items-center justify-end flex-shrink-0 space-x-4">
                    <button onClick={() => handleApproval(turf.id, true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                    <button onClick={() => handleApproval(turf.id, false)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-brand-card rounded-lg border border-gray-700/50">
              <p>No pending turf submissions.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}