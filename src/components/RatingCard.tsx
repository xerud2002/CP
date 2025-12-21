import React from 'react';
import Image from 'next/image';
import { getRatingClass, getRatingBgClass, formatRating, ratingColors } from '@/lib/rating';

interface RatingCardProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// Map rating to icon filename (DOS style)
const getRatingIcon = (rating: number): string => {
  const rounded = Math.round(rating);
  if (rounded <= 1) return 'ico-red.png';
  if (rounded === 2) return 'ico-orange.png';
  if (rounded === 3) return 'ico-yellow.png';
  if (rounded === 4) return 'ico-emerald.png';
  return 'ico-turquoise.png';
};

export default function RatingCard({ 
  rating, 
  reviewCount, 
  size = 'md',
  showLabel = true,
  className = '' 
}: RatingCardProps) {
  const roundedRating = Math.round(rating);
  const iconName = getRatingIcon(rating);
  
  // Size variants
  const sizeConfig = {
    sm: {
      card: 'p-3',
      starSize: 18,
      starGap: 'gap-0.5',
      starMargin: 'mb-2',
      ratingSize: 'text-2xl',
      textSize: 'text-xs'
    },
    md: {
      card: 'p-4 sm:p-6',
      starSize: 20,
      starGap: 'gap-1',
      starMargin: 'mb-3',
      ratingSize: 'text-3xl sm:text-4xl',
      textSize: 'text-sm'
    },
    lg: {
      card: 'p-6 sm:p-8',
      starSize: 20,
      starGap: 'gap-1',
      starMargin: 'mb-4',
      ratingSize: 'text-5xl sm:text-6xl',
      textSize: 'text-sm'
    }
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={`flex flex-col items-center rounded-2xl border ${getRatingBgClass(rating)} ${config.card} ${className}`}
      style={{ 
        boxShadow: `0 4px 30px -4px ${ratingColors[roundedRating as keyof typeof ratingColors] || ratingColors[5]}20`
      }}
    >
      {/* Stars - DOS style with images */}
      <div className={`flex ${config.starGap} ${config.starMargin}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Image
            key={star}
            src={`/img/${star <= roundedRating ? iconName : 'ico-gray.png'}`}
            alt="star"
            width={config.starSize}
            height={config.starSize}
            className="transition-transform hover:scale-110"
            style={{ transitionDelay: `${star * 50}ms` }}
          />
        ))}
      </div>

      {/* Rating Number */}
      <div className={`${config.ratingSize} font-black mb-1 ${getRatingClass(rating)}`}>
        {formatRating(rating)}
      </div>

      {/* Review Count Label */}
      {showLabel && (
        <div className={`text-gray-400 ${config.textSize}`}>
          {reviewCount !== undefined 
            ? `${reviewCount} ${reviewCount === 1 ? 'recenzie' : 'recenzii'}`
            : '0 recenzii'
          }
        </div>
      )}
    </div>
  );
}
