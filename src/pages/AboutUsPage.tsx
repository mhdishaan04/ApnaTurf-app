import { motion } from 'framer-motion';

export default function AboutUsPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-card/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-gray-700/50"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">About ApnaTurf</h1>
        <p className="mt-6 text-lg text-gray-300">
          ApnaTurf was born from a simple idea: playing the sports we love should be easy. We were a group of friends who grew tired of the endless phone calls, uncertain availability, and hassle of organizing a simple game of football or cricket. We knew there had to be a better way.
        </p>
        <p className="mt-4 text-lg text-gray-300">
          Launched in 2025, our mission is to connect players with the best sports facilities in their city. We believe in the power of sports to build communities, foster friendships, and promote a healthy lifestyle. By creating a seamless booking platform, we're taking the "work" out of "play."
        </p>
        <p className="mt-4 text-lg text-gray-300">
          Whether you're looking to book a turf for your team, find players for a matchmaking game, or a turf owner wanting to maximize your bookings, ApnaTurf is the platform for you.
        </p>
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p className="mt-2 text-gray-400">To be the #1 destination for amateur sports in India, making the joy of play accessible to everyone, everywhere.</p>
        </div>
      </motion.div>
    </main>
  );
}