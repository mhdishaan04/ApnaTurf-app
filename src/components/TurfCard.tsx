import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Turf } from '../types'; // We will create this type definition file next

type Props = {
  turf: Turf;
};

export default function TurfCard({ turf }: Props) {
  return (
    <Link to={`/turf/${turf.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <img src={turf.images?.[0] || '/placeholder-turf.jpg'} alt={turf.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{turf.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <MapPin size={14} className="mr-1" />
          {turf.location}
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="font-semibold text-blue-600">₹{turf.price_per_hour}/hr</p>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="ml-1 text-gray-700 font-semibold">4.5</span> {/* Placeholder rating */}
          </div>
        </div>
      </div>
    </Link>
  );
}