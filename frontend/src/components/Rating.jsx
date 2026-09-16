import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ value = 0, max = 5, size = 'w-4 h-4', showValue = true, reviewCount = null }) => {
  const ratingNum = Number(value) || 0;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-400">
        {[...Array(max)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < Math.floor(ratingNum)
                ? 'fill-amber-400 text-amber-400'
                : i < ratingNum
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-bold text-gray-800 ml-1">
          {ratingNum.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-gray-500">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;
