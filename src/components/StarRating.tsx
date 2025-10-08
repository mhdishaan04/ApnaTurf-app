import { useState } from 'react';
import { Star } from 'lucide-react';

type Props = {
  rating: number;
  setRating: (rating: number) => void;
};

export default function StarRating({ rating, setRating }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <Star
              className="cursor-pointer"
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              fill={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
}