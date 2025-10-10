import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

export default function TurfSubmissionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [turfName, setTurfName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [openTime, setOpenTime] = useState('06:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [sports, setSports] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleSportChange = (sport: string) => {
    setSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit a turf.');
      return navigate('/login');
    }
    if (imageFiles.length === 0) {
      return alert('Please upload at least one image.');
    }
    setLoading(true);
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const fileName = `${user.id}/${nanoid()}`;
      const { data, error } = await supabase.storage.from('turf-images').upload(fileName, file);
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from('turf-images').getPublicUrl(data.path);
      imageUrls.push(publicUrl);
    }
    if (imageUrls.length === 0) {
      setLoading(false);
      return alert('Image upload failed. Please try again.');
    }
    const { error: insertError } = await supabase.from('turfs').insert({
      owner_id: user.id, name: turfName, location: location, price_per_hour: Number(price),
      operating_hours: { open: openTime, close: closeTime }, sports_available: sports, images: imageUrls, is_approved: false,
    });
    setLoading(false);
    if (insertError) {
      alert('Error submitting turf. Please try again.');
      console.error(insertError);
    } else {
      alert('Turf submitted successfully! It will be reviewed by an admin shortly.');
      navigate('/');
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-white">List Your Turf</h1>
      <p className="mt-2 text-lg text-gray-300">Join our platform and connect with thousands of players in your city.</p>

      <form onSubmit={handleSubmit} className="mt-10 bg-brand-card/70 backdrop-blur-sm p-8 rounded-lg shadow-md space-y-6 border border-gray-700/50">
        <div>
          <label htmlFor="turfName" className="block font-medium text-gray-200">Turf Name</label>
          <input type="text" id="turfName" value={turfName} onChange={e => setTurfName(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white" required />
        </div>
        <div>
          <label htmlFor="location" className="block font-medium text-gray-200">Location / Area</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white" required />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium text-gray-200">Price per Hour (₹)</label>
          <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="openTime" className="block font-medium text-gray-200">Opening Time</label>
            <input type="time" id="openTime" value={openTime} onChange={e => setOpenTime(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white" required />
          </div>
          <div>
            <label htmlFor="closeTime" className="block font-medium text-gray-200">Closing Time</label>
            <input type="time" id="closeTime" value={closeTime} onChange={e => setCloseTime(e.target.value)} className="w-full mt-1 p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white" required />
          </div>
        </div>
        <div>
          <label className="block font-medium text-gray-200">Sports Available</label>
          <div className="mt-2 flex space-x-4">
            {['football', 'cricket', 'basketball', 'badminton'].map(sport => (
              <label key={sport} className="flex items-center">
                <input type="checkbox" checked={sports.includes(sport)} onChange={() => handleSportChange(sport)} className="h-4 w-4 text-brand-primary bg-gray-800 border-gray-600 rounded focus:ring-brand-primary" />
                <span className="ml-2 text-gray-300 capitalize">{sport}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="images" className="block font-medium text-gray-200">Upload Turf Images</label>
          <input type="file" id="images" onChange={handleFileChange} multiple accept="image/*" className="w-full mt-1 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/20 file:text-brand-primary hover:file:bg-brand-primary/30" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white p-3 rounded-md hover:bg-blue-500 disabled:opacity-50 font-semibold">
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </main>
  );
}