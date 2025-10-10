import { motion } from 'framer-motion';
import { ShieldCheck, CalendarClock, Users } from 'lucide-react';

const features = [
  { icon: <ShieldCheck className="w-10 h-10 text-brand-accent"/>, title: "Verified Turfs", description: "Every turf on our platform is verified for quality and safety, ensuring a premium experience." },
  { icon: <CalendarClock className="w-10 h-10 text-brand-accent"/>, title: "Instant Booking", description: "Book your favorite turf in seconds for a private game or host a match for others to join." },
  { icon: <Users className="w-10 h-10 text-brand-accent"/>, title: "Community Powered", description: "Find teammates, join existing games, and read authentic reviews from fellow players." },
];

// Define the type for the props we're passing in
type Props = {
  containerVariants: any;
  itemVariants: any;
};

export default function KeyFeatures({ containerVariants, itemVariants }: Props) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-24 bg-black/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-center text-white mb-12"
        >
          An Unmatched Experience
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="bg-brand-card p-8 rounded-lg border border-gray-800 text-center"
            >
              {feature.icon}
              <h3 className="text-2xl font-bold mt-4 text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}