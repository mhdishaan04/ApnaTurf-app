import { motion } from 'framer-motion';
import SportCard from './SportCard';

const SPORTS = [
  {
    id: 'football',
    title: 'Football',
    subtitle: '5v5, 7v7',
    videoUrl: 'https://media.istockphoto.com/id/1426877619/video/football-championship-ball-hits-net-in-slow-motion-goalkeeper-jumps-and-fails-to-protect.mp4?s=mp4-640x640-is&k=20&c=BAuUaeRKUeI0UJ7bIrx6kt5LLkyIhSS1mB1aICSTjpY=',
  },
  {
    id: 'cricket',
    title: 'Cricket',
    subtitle: 'Box Cricket',
    videoUrl: 'https://media.istockphoto.com/id/683659992/video/cricket-player-on-professional-cricket-stadium.mp4?s=mp4-640x640-is&k=20&c=0ib4fuJAqVkr7QbwrUN2-2gEw_SGrKuXYTljXjJL7Qs=',
  },
  {
    id: 'basketball',
    title: 'Basketball',
    subtitle: 'Full Court',
    videoUrl: 'https://www.shutterstock.com/shutterstock/videos/3789167887/preview/stock-footage-ball-goes-in-basket-in-arena-a-basketball-player-performing-the-slam-dunk-basketball-going.webm',
  },
  {
    id: 'badminton',
    title: 'Badminton',
    subtitle: 'Singles, Doubles',
    videoUrl: 'https://www.shutterstock.com/shutterstock/videos/1044047854/preview/stock-footage-badminton-racket-hitting-shuttlecock-in-slow-motion.webm',
  },
];

// Define the type for the props
type Props = {
  itemVariants: any;
};

export default function SportsGrid({ itemVariants }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {SPORTS.map((s) => (
        <motion.div key={s.id} variants={itemVariants}>
          <SportCard sport={s} />
        </motion.div>
      ))}
    </div>
  );
}