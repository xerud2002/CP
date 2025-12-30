'use client';

import { useNotifications } from '@/hooks/useNotifications';

// Bell Icon SVG
const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

// Bell Slash Icon SVG
const BellSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
  </svg>
);

interface NotificationToggleProps {
  userId: string | undefined;
  className?: string;
}

export function NotificationToggle({ userId, className = '' }: NotificationToggleProps) {
  const { isSupported, isEnabled, isLoading, enableNotifications, disableNotifications } = useNotifications(userId);

  // Don't render if notifications not supported
  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isEnabled) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isEnabled
          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isEnabled ? 'Dezactivează notificările' : 'Activează notificările'}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isEnabled ? (
        <BellIcon className="w-5 h-5" />
      ) : (
        <BellSlashIcon className="w-5 h-5" />
      )}
      <span className="text-sm">
        {isLoading ? 'Se procesează...' : isEnabled ? 'Notificări active' : 'Activează notificări'}
      </span>
    </button>
  );
}

// Compact version for header/navbar
export function NotificationToggleCompact({ userId, className = '' }: NotificationToggleProps) {
  const { isSupported, isEnabled, isLoading, enableNotifications, disableNotifications } = useNotifications(userId);

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isEnabled) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-all ${
        isEnabled
          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isEnabled ? 'Dezactivează notificările' : 'Activează notificările'}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isEnabled ? (
        <BellIcon className="w-5 h-5" />
      ) : (
        <BellSlashIcon className="w-5 h-5" />
      )}
    </button>
  );
}
