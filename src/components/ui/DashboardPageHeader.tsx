import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconGradient?: string;
  backHref?: string;
  maxWidth?: '5xl' | '6xl' | '7xl';
}

export default function DashboardPageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconGradient = 'from-blue-500/20 to-cyan-500/20',
  backHref = '/dashboard/client',
  maxWidth = '7xl'
}: DashboardPageHeaderProps) {
  const maxWidthClass = `max-w-${maxWidth}`;

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className={`${maxWidthClass} mx-auto px-3 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href={backHref}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 hover:text-white" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {Icon && (
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${iconGradient} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-white truncate">{title}</h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-gray-400 truncate">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
