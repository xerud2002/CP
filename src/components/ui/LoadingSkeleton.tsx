import { memo } from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'list' | 'header';
  count?: number;
  className?: string;
}

const LoadingSkeleton = memo(function LoadingSkeleton({ 
  variant = 'card', 
  count = 1,
  className = '' 
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'header') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-slate-700/50 rounded-lg w-48 mb-2"></div>
        <div className="h-4 bg-slate-700/30 rounded w-64"></div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-4 ${className}`}>
        {skeletons.map(i => (
          <div key={i} className="animate-pulse flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-white/5">
            <div className="w-12 h-12 bg-slate-700/50 rounded-lg shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700/30 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-8 bg-slate-700/30 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {skeletons.map(i => (
          <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
            <div className="w-10 h-10 bg-slate-700/50 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
              <div className="h-2 bg-slate-700/30 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: card
  return (
    <div className={`space-y-4 ${className}`}>
      {skeletons.map(i => (
        <div key={i} className="animate-pulse">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-700/50 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700/30 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-700/30 rounded w-full"></div>
              <div className="h-3 bg-slate-700/30 rounded w-5/6"></div>
              <div className="h-3 bg-slate-700/30 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default LoadingSkeleton;
