'use client';

import { CloseIcon, ChatIcon, UserIcon } from '@/components/icons/DashboardIcons';
import { useAdminMessageThreads } from '@/hooks/useAdminMessageThreads';
import { User } from '@/types';

interface AdminMessagesListModalProps {
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

interface MessageThread {
  userId: string;
  userName: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export default function AdminMessagesListModal({ onClose, onSelectUser }: AdminMessagesListModalProps) {
  const { threads, totalUnread, loading } = useAdminMessageThreads();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Acum';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} ore`;
    if (diffDays < 7) return `${diffDays} zile`;
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
  };

  const truncateMessage = (msg: string, maxLength: number = 60) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength).trim() + '...';
  };

  const handleThreadClick = (thread: MessageThread) => {
    // Create a minimal User object to open AdminMessageModal
    const user: User = {
      uid: thread.userId,
      email: '',
      role: thread.userRole as 'client' | 'curier',
      displayName: thread.userName,
      createdAt: new Date(),
    };
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <ChatIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Conversații</h2>
              <p className="text-sm text-slate-400">
                {totalUnread > 0 ? `${totalUnread} ${totalUnread === 1 ? 'mesaj necitit' : 'mesaje necitite'}` : 'Niciun mesaj necitit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            aria-label="Închide"
            title="Închide"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mb-4" />
              <p className="text-slate-400">Se încarcă conversațiile...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ChatIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nu există conversații încă</p>
              <p className="text-sm mt-1">Trimite un mesaj dintr-un profil de utilizator</p>
            </div>
          ) : (
            <div className="space-y-2">
              {threads.map((thread) => (
                <button
                  key={thread.userId}
                  onClick={() => handleThreadClick(thread)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors text-left group"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      thread.unreadCount > 0 ? 'bg-orange-500/30' : 'bg-slate-600'
                    }`}>
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-medium truncate ${thread.unreadCount > 0 ? 'text-white' : 'text-slate-300'}`}>
                          {thread.userName}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          thread.userRole === 'client' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {thread.userRole === 'client' ? 'Client' : 'Curier'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatTime(thread.lastMessageTime)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                      {truncateMessage(thread.lastMessage)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-400 shrink-0 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
