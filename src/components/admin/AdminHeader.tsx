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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span className="text-white font-bold text-sm sm:text-lg">CP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">Curierul Perfect</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Reîncarcă datele"
            >
              <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Notifications */}
            <button 
              onClick={onBellClick}
              className="relative p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Mesaje de la utilizatori"
            >
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {notificationCount !== undefined && notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 bg-red-500 rounded-full text-[10px] sm:text-xs font-medium text-white flex items-center justify-center px-1">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-red-400">Administrator</p>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="Ieșire"
            >
              <span className="hidden sm:inline">Ieșire</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
