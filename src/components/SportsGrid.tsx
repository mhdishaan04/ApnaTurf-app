import SportCard from './SportCard';

const SPORTS = [
  { id: 'football', title: 'Football', subtitle: '5v5, 7v7', color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
  { id: 'cricket', title: 'Cricket', subtitle: 'Box Cricket', color: 'bg-gradient-to-br from-yellow-500 to-amber-600' },
  { id: 'basketball', title: 'Basketball', subtitle: 'Full Court', color: 'bg-gradient-to-br from-orange-500 to-red-600' },
  { id: 'badminton', title: 'Badminton', subtitle: 'Singles, Doubles', color: 'bg-gradient-to-br from-sky-500 to-indigo-600' },
];

export default function SportsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {SPORTS.map((s) => (
        <SportCard key={s.id} sport={s} />
      ))}
    </div>
  );
}