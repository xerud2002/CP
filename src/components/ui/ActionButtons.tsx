'use client';

import { ChatIcon, EyeIcon, TrashIcon } from '@/components/icons/DashboardIcons';

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
}

// Green Message Button
export function MessageButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="px-3 sm:px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-1.5 border border-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <ChatIcon className="w-4 h-4 shrink-0" />
      <span>Mesaje</span>
    </button>
  );
}

// Blue View Button
export function ViewButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="px-3 sm:px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-all flex items-center justify-center gap-1.5 border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <EyeIcon className="w-4 h-4 shrink-0" />
      <span>Vezi</span>
    </button>
  );
}

// Red Delete Button
export function DeleteButton({ onClick, title, disabled = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5 border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <TrashIcon className="w-4 h-4 shrink-0" />
      <span>Șterge</span>
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
    <div className={`flex items-center gap-2 ${className}`}>
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
