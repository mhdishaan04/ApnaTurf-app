import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Sport = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
};

type Props = {
  sport: Sport;
};

export default function SportCard({ sport }: Props) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/games/${sport.id}`}
        className={`block p-6 rounded-2xl shadow-lg text-white ${sport.color}`}
      >
        <h3 className="text-xl font-bold">{sport.title}</h3>
        <p className="mt-1 opacity-90">{sport.subtitle}</p>
      </Link>
    </motion.div>
  );
}