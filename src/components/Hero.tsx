import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[50vh] min-h-[400px] rounded-b-3xl overflow-hidden text-white flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1599499423237-7098415275e7?q=80&w=2070&auto=format&fit=crop)`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-left"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Find Your Turf, Gather Your Team, Play Today.
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            The ultimate platform to book sports turfs and connect with fellow players in your city.
          </p>
        </motion.div>
      </div>
    </section>
  );
}