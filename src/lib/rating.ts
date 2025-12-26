// Rating utilities - unified with daiostea.ro platform
// Color-coded rating system: 1=Red, 2=Orange, 3=Yellow, 4=Emerald, 5=Turquoise

export const ratingColors = {
  1: '#ef4444', // roșu (red)
  2: '#f97316', // portocaliu (orange)
  3: '#facc15', // galben (yellow)
  4: '#10b981', // verde smarald (emerald)
  5: '#06b6d4', // turcoaz (turquoise)
} as const;

export const ratingLabels = {
  1: 'Foarte slab',
  2: 'Slab',
  3: 'Acceptabil',
  4: 'Bun',
  5: 'Excelent',
} as const;

export const getRatingColor = (rating: number): string => {
  const roundedRating = Math.round(rating) as keyof typeof ratingColors;
  return ratingColors[roundedRating] || ratingColors[1];
};

export const getRatingLabel = (rating: number): string => {
  const roundedRating = Math.round(rating) as keyof typeof ratingLabels;
  return ratingLabels[roundedRating] || '';
};

export const getRatingClass = (rating: number): string => {
  const roundedRating = Math.round(rating);
  switch (roundedRating) {
    case 5: return 'text-cyan-400'; // turcoaz
    case 4: return 'text-emerald-400'; // verde
    case 3: return 'text-amber-400'; // galben
    case 2: return 'text-orange-400'; // portocaliu
    default: return 'text-red-400'; // roșu
  }
};

export const getRatingBgClass = (rating: number): string => {
  const roundedRating = Math.round(rating);
  switch (roundedRating) {
    case 5: return 'bg-cyan-500/20 border-cyan-500/30';
    case 4: return 'bg-emerald-500/20 border-emerald-500/30';
    case 3: return 'bg-amber-500/20 border-amber-500/30';
    case 2: return 'bg-orange-500/20 border-orange-500/30';
    default: return 'bg-red-500/20 border-red-500/30';
  }
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Calculate new rating using weighted average algorithm
 * @param currentRating - Current courier rating (1-5)
 * @param currentReviewCount - Number of existing reviews
 * @param newReviewRating - New review rating (1-5)
 * @returns Updated rating
 */
export const calculateNewRating = (
  currentRating: number,
  currentReviewCount: number,
  newReviewRating: number
): number => {
  const totalRating = currentRating * currentReviewCount + newReviewRating;
  const newCount = currentReviewCount + 1;
  return totalRating / newCount;
};
