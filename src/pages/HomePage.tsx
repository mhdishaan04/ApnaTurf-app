import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import KeyFeatures from '../components/KeyFeatures';
import FeaturedTurfs from '../components/FeaturedTurfs';
import SportsGrid from '../components/SportsGrid';

const testimonials = [
    { name: 'Zaid', role: 'Player', text: "Finally, an app that makes finding a last-minute game so easy. The matchmaking works surprisingly well!" },
    { name: 'Lenson Glen Lasrado', role: 'Player', text: "Booked a turf for our corporate tournament. The process was incredibly smooth and the ground was in top condition." },
    { name: 'Lionel', role: 'Player', text: "The user interface is clean and booking takes less than a minute. Love the variety of turfs available in my area." },
    { name: 'Ishaan', role: 'Player', text: "Used it to host a 5-a-side game. Got all the players we needed in just a few hours. Fantastic platform!" },
    { name: 'Muadh Ali', role: 'Player', text: "The quality of the turfs listed is consistently good. No more showing up to a poorly maintained ground. Great job!" },
    { name: 'Prateek Shetty', role: 'Turf Owner', text: "Listing my property was straightforward and the admin approval was quick. I've seen a definite increase in bookings." },
    { name: 'Joshua Dylan', role: 'Player', text: "Simple, fast, and reliable. Exactly what you need when you just want to get out and play." },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, scale: 1.1, y: 50 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

export default function HomePage() {
  return (
    <>
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden -mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 p-4">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">Unleash Your Inner Athlete</h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4">Book. Play. Conquer.</p>
          <Link to="/games/football" className="mt-8 inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-lg text-lg hover:bg-blue-500 transition-colors">
              Find a Game
          </Link>
        </motion.div>
      </section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 md:py-20 px-4 max-w-7xl mx-auto"
      >
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Choose Your Sport</motion.h2>
        <SportsGrid itemVariants={itemVariants} />
      </motion.section>

      <KeyFeatures containerVariants={containerVariants} itemVariants={itemVariants} />
      <FeaturedTurfs containerVariants={containerVariants} itemVariants={itemVariants} />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            >
                Don't Just Take Our Word For It!
            </motion.h2>

            <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_48px,_black_calc(100%-48px),transparent_100%)]">
                <div className="flex w-max animate-slide">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[320px] sm:w-[400px] flex-shrink-0 mx-4">
                            <div className="bg-brand-card border border-gray-800 p-8 rounded-lg h-full">
                                <p className="text-gray-400 italic">"{t.text}"</p>
                                <div className="mt-6">
                                    <p className="font-bold text-white">{t.name}</p>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </>
  );
}