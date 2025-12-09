'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  description?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
};

export function StarRating({
  value,
  onChange,
  label,
  description,
  required = false,
  size = 'md'
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const ratingLabels = ['매우 불만족', '불만족', '보통', '만족', '매우 만족'];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                (hoverValue || value) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600 min-w-[80px]">
          {hoverValue > 0
            ? ratingLabels[hoverValue - 1]
            : value > 0
              ? ratingLabels[value - 1]
              : '선택해주세요'}
        </span>
      </div>
    </div>
  );
}
