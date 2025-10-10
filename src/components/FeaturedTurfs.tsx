import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

type FeaturedTurf = {
  id: number;
  name: string;
  location: string;
  images: string[];
};

// Define the type for the props
type Props = {
  containerVariants: any;
  itemVariants: any;
};

export default function FeaturedTurfs({ containerVariants, itemVariants }: Props) {
  const [turfs, setTurfs] = useState<FeaturedTurf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTurfs = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_featured_turfs');
      
      if (error) {
        console.error("Error fetching featured turfs:", error);
      } else {
        setTurfs(data as FeaturedTurf[]);
      }
      setLoading(false);
    };
    fetchFeaturedTurfs();
  }, []);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 px-4 bg-brand-dark"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          variants={itemVariants}
          className="text-4xl font-bold text-center text-white mb-12"
        >
          Featured Turfs
        </motion.h2>

        {loading ? (
            <div className="text-center text-gray-400">Loading turfs...</div>
        ) : turfs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {turfs.map((turf) => (
                <motion.div
                  key={turf.id}
                  variants={itemVariants}
                >
                  <Link to={`/turf/${turf.id}`} className="block bg-brand-card rounded-lg shadow-lg overflow-hidden group border border-gray-800 h-full hover:border-brand-primary transition-colors">
                      <div className="h-48 overflow-hidden">
                      <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="p-4">
                      <h3 className="font-bold text-white text-lg truncate">{turf.name}</h3>
                      <p className="flex items-center text-sm text-gray-400 mt-1">
                          <MapPin size={14} className="mr-2 flex-shrink-0" />
                          {turf.location}
                      </p>
                      </div>
                  </Link>
                </motion.div>
            ))}
            </div>
        ) : (
            <div className="text-center text-gray-500">No approved turfs are available yet.</div>
        )}
      </div>
    </motion.section>
  );
}