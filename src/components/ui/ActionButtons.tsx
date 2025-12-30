'use client';

import { ChatIcon, EyeIcon, TrashIcon } from '@/components/icons/DashboardIcons';

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
}

interface MessageButtonProps extends ActionButtonProps {
  unreadCount?: number;
}

// Green Message Button with unread badge
export function MessageButton({ onClick, title, disabled = false, unreadCount = 0 }: MessageButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="relative p-1.5 xs:p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      title={title}
    >
      <ChatIcon className="w-4 h-4 xs:w-5 xs:h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 xs:h-[18px] xs:w-[18px]">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 xs:h-[18px] xs:w-[18px] bg-emerald-500 items-center justify-center">
            <span className="text-white text-[9px] xs:text-[10px] font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </span>
        </span>
      )}
    </button>
  );
}

// Blue View Button
export function ViewButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 xs:p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      title={title}
    >
      <EyeIcon className="w-4 h-4 xs:w-5 xs:h-5" />
    </button>
  );
}

// Red Delete Button
export function DeleteButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 xs:p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      title={title}
    >
      <TrashIcon className="w-4 h-4 xs:w-5 xs:h-5" />
    </button>
  );
}

// Action Buttons Group Container
interface ActionButtonsGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionButtonsGroup({ children, className = '' }: ActionButtonsGroupProps) {
  return (
    <div className={`flex items-center gap-1 xs:gap-2 ${className}`}>
      {children}
    </div>
  );
}

// Small icon-only action buttons (for tables)
export function SmallMessageButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <ChatIcon className="w-5 h-5" />
    </button>
  );
}

export function SmallViewButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <EyeIcon className="w-5 h-5" />
    </button>
  );
}

export function SmallDeleteButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}

// Dismiss/Not Interested Button (for couriers to hide orders)
export function DismissButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 xs:p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      title={title}
    >
      <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    </button>
  );
}
