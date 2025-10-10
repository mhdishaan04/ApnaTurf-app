import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export default function DatePicker({ selectedDate, setSelectedDate }: Props) {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  const formatDate = (date: Date) => {
    if (date.toDateString() === new Date().toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center space-x-2">
      {dates.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => setSelectedDate(date)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition text-white ${
            selectedDate.toDateString() === date.toDateString()
              ? 'bg-brand-primary shadow-md'
              : 'bg-brand-card/70 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/50'
          }`}
        >
          {formatDate(date)}
        </button>
      ))}
    </div>
  );
}