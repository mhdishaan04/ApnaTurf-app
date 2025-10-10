import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Turf } from '../types';

type Props = {
  turf: Turf;
  sportId?: string; // Accept the optional sportId
};

export default function TurfCard({ turf, sportId }: Props) {
  return (
    // **THE FIX: Pass sportId in the navigation state**
    <Link 
      to={`/turf/${turf.id}`} 
      state={{ sportId: sportId }}
      className="block bg-brand-card/70 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-700/50"
    >
      <img src={turf.images?.[0] || '/placeholder-turf.jpg'} alt={turf.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-white">{turf.name}</h3>
        <div className="flex items-center text-sm text-gray-300 mt-1">
          <MapPin size={14} className="mr-1" />
          {turf.location}
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="font-semibold text-brand-primary">₹{turf.price_per_hour}/hr</p>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="ml-1 text-gray-200 font-semibold">4.5</span>
          </div>
        </div>
      </div>
    </Link>
  );
}