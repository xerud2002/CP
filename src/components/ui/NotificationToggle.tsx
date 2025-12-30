'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

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
