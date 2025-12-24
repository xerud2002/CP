'use client';

import {
  BellIcon,
  RefreshIcon,
} from '@/components/icons/DashboardIcons';

interface AdminHeaderProps {
  userName: string;
  onLogout: () => void;
  onRefresh: () => void;
  notificationCount?: number;
  onBellClick?: () => void;
}

export default function AdminHeader({ userName, onLogout, onRefresh, notificationCount = 0, onBellClick }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">Curierul Perfect</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Reîncarcă datele"
            >
              <RefreshIcon className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button 
              onClick={onBellClick}
              className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Mesaje de la utilizatori"
            >
              <BellIcon className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-medium text-white flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-orange-500/25">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-red-400">Administrator</p>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Ieșire
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
