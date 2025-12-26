interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  fullScreen = true, 
  text = 'Se încarcă...',
  size = 'md'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4'
  };

  const spinner = (
    <div className="text-center">
      <div 
        className={`${sizeClasses[size]} border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`} 
      />
      {text && <p className="text-gray-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
