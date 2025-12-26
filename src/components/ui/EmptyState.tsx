interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
}

export default function EmptyState({ 
  icon, 
  title, 
  description,
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            action.variant === 'primary' 
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25' 
              : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
