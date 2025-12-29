'use client';

import { useState, useEffect, useRef } from 'react';
import { CloseIcon, ChatIcon } from '@/components/icons/DashboardIcons';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/lib/toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'client' | 'curier';
  receiverId: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
}

interface UserMessageModalProps {
  onClose: () => void;
}

export default function UserMessageModal({ onClose }: UserMessageModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'admin_messages'),
      where('participants', 'array-contains', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      setMessages(loadedMessages);

      // Mark all unread messages as read
      loadedMessages.forEach(async (msg) => {
        if (!msg.read && msg.senderId !== user.uid) {
          try {
            await updateDoc(doc(db, 'admin_messages', msg.id), { read: true });
          } catch (error) {
            console.error('Error marking message as read:', error);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      // Find admin ID from existing messages or use a default
      const adminMessage = messages.find(m => m.senderRole === 'admin');
      const adminId = adminMessage?.senderId || 'admin'; // Fallback to 'admin'
      const adminName = adminMessage?.senderName || 'Administrator';

      await addDoc(collection(db, 'admin_messages'), {
        senderId: user.uid,
        senderName: user.displayName || user.email || 'Utilizator',
        senderRole: user.role,
        receiverId: adminId,
        receiverName: adminName,
        receiverRole: 'admin',
        participants: [user.uid, adminId],
        message: newMessage.trim(),
        read: false,
        createdAt: serverTimestamp()
      });

      setNewMessage('');
      showSuccess('Mesaj trimis!');
    } catch (error) {
      console.error('Error sending message:', error);
      showError(error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

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
              <h2 className="text-lg font-semibold text-white">Mesaje de la Administrator</h2>
              <p className="text-sm text-slate-400">Conversație cu echipa Curierul Perfect</p>
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ChatIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nu ai mesaje încă</p>
              <p className="text-sm mt-1">Scrie un mesaj pentru a începe conversația</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromAdmin = msg.senderRole === 'admin';
              const isFromMe = msg.senderId === user.uid;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isFromAdmin
                        ? 'bg-linear-to-br from-orange-500 to-orange-600 text-white'
                        : isFromMe
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-1 ${isFromMe ? 'text-right text-emerald-400' : 'text-orange-300'}`}>
                      {isFromMe ? 'Tu' : (msg.senderName || 'Administrator')}
                    </p>
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                    <p className={`text-xs mt-1 opacity-75 ${isFromMe ? 'text-right' : ''}`}>
                      {msg.createdAt?.toDate?.()?.toLocaleString('ro-RO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) || 'Trimitere...'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Scrie un mesaj către ${messages.find(m => m.senderRole === 'admin')?.senderName || 'Administrator'}...`}
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={2}
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {sending ? 'Se trimite...' : 'Trimite'}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Apasă Enter pentru a trimite, Shift+Enter pentru linie nouă
          </p>
        </div>
      </div>
    </div>
  );
}
