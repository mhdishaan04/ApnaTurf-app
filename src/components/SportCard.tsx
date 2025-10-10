import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

type Sport = {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
};

export default function SportCard({ sport }: { sport: Sport }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative rounded-2xl overflow-hidden h-64 shadow-lg group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/games/${sport.id}`} className="block w-full h-full">
        {/* The video background */}
        <video
          ref={videoRef}
          src={sport.videoUrl}
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Text content */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold">{sport.title}</h3>
          <p className="mt-1 text-sm opacity-80">{sport.subtitle}</p>
        </div>
      </Link>
    </motion.div>
  );
}