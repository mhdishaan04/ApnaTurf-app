import { Star } from 'lucide-react';

// Placeholder data - we'll replace this with real data later
const featuredTurfs = [
  {
    name: 'Greenfield Sports',
    location: 'Koramangala',
    image: 'https://images.unsplash.com/photo-1526233139368-7d1c58c0c5b3?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    name: 'Urban Arena',
    location: 'Indiranagar',
    image: 'https://images.unsplash.com/photo-1551772633-22870135d56b?q=80&w=2070&auto=format&fit=crop',
    rating: 4.6,
  },
  {
    name: 'Skyline Football',
    location: 'HSR Layout',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop',
    rating: 4.9,
  },
];

export default function FeaturedTurfs() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Featured Turfs</h2>
        <p className="mt-2 text-md text-gray-500 text-center">Explore some of the top-rated turfs on our platform.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTurfs.map((turf) => (
            <div key={turf.name} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <img src={turf.image} alt={turf.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold">{turf.name}</h3>
                <p className="text-sm text-gray-600">{turf.location}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="ml-1 text-gray-700 font-semibold">{turf.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}