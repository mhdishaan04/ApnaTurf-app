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
      const { error } = await supabase
        .from('turfs')
        .delete()
        .eq('id', turfId);
      if (error) alert('Failed to reject turf.');
    }
    // Refresh the list after action
    fetchPendingTurfs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-lg text-gray-600">Turf Submissions Awaiting Approval</p>

        <div className="mt-10 space-y-6">
          {loading ? (
            <p>Loading submissions...</p>
          ) : pendingTurfs.length > 0 ? (
            pendingTurfs.map(turf => (
              <div key={turf.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold">{turf.name}</h2>
                    <p className="text-gray-600">{turf.location}</p>
                    <p className="mt-2 font-semibold">₹{turf.price_per_hour}/hr</p>
                    <p className="mt-1 text-sm text-gray-500">Sports: {turf.sports_available.join(', ')}</p>
                  </div>
                  <div className="flex items-center justify-end space-x-4">
                    <button onClick={() => handleApproval(turf.id, true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                    <button onClick={() => handleApproval(turf.id, false)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No pending turf submissions.</p>
          )}
        </div>
      </main>
    </div>
  );
}