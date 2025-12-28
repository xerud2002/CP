/**
 * Reusable chat message list component
 * Displays messages with proper formatting for sender/receiver
 */

'use client';

import { ChatIcon } from '@/components/icons/DashboardIcons';
import { ChatMessage } from '@/hooks/useChatMessages';
import Image from 'next/image';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  emptyStateText?: string;
  emptyStateSubtext?: string;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  emptyStateText = 'Niciun mesaj încă',
  emptyStateSubtext = 'Începe conversația!'
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatIcon className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-500">{emptyStateText}</p>
        <p className="text-sm text-gray-600 mt-1">{emptyStateSubtext}</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg) => {
        const isOwn = msg.senderId === currentUserId;
        const bgColor = isOwn ? 'bg-orange-500/20 border-orange-500/30' : 'bg-slate-700/50 border-slate-600/50';
        const textAlign = isOwn ? 'ml-auto' : 'mr-auto';

        return (
          <div key={msg.id} className={`flex flex-col max-w-[85%] ${textAlign}`}>
            {!isOwn && (
              <span className="text-xs text-gray-500 mb-1 ml-1">{msg.senderName}</span>
            )}
            <div className={`${bgColor} border rounded-2xl px-4 py-3`}>
              <p className="text-sm text-white whitespace-pre-wrap wrap-break-word">{msg.message}</p>
              
              {msg.attachmentUrl && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {msg.attachmentType?.startsWith('image/') ? (
                    <div className="relative w-full max-w-xs rounded-lg overflow-hidden">
                      <Image
                        src={msg.attachmentUrl}
                        alt={msg.attachmentName || 'Attachment'}
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <a
                      href={msg.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate max-w-50">{msg.attachmentName || 'Descarcă fișier'}</span>
                    </a>
                  )}
                </div>
              )}
              
              <span className="text-xs text-gray-500 mt-2 block">
                {msg.createdAt.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
