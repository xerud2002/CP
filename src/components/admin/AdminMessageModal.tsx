'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from '@/types';
import { CloseIcon, ChatIcon } from '@/components/icons/DashboardIcons';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/lib/toast';
import { getDisplayName } from './types';

interface AdminMessageModalProps {
  user: User | null;
  onClose: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'client' | 'curier';
  receiverId: string;
  message: string;
  createdAt: any;
  read: boolean;
}

export default function AdminMessageModal({ user: targetUser, onClose }: AdminMessageModalProps) {
  const { user: adminUser } = useAuth();
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
    if (!targetUser || !adminUser) return;

    const q = query(
      collection(db, 'admin_messages'),
      where('participants', 'array-contains', adminUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Only show messages between admin and target user
        if (
          (data.senderId === adminUser.uid && data.receiverId === targetUser.uid) ||
          (data.senderId === targetUser.uid && data.receiverId === adminUser.uid)
        ) {
          loadedMessages.push({ id: docSnap.id, ...data } as Message);
          
          // Mark message as read if sent by user and not yet read
          if (data.senderId === targetUser.uid && !data.read) {
            updateDoc(doc(db, 'admin_messages', docSnap.id), { read: true }).catch(err => {
              console.error('Error marking message as read:', err);
            });
          }
        }
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [targetUser, adminUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !targetUser || !adminUser || sending) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'admin_messages'), {
        senderId: adminUser.uid,
        senderName: adminUser.displayName || 'Admin',
        senderRole: 'admin',
        receiverId: targetUser.uid,
        receiverName: getDisplayName(targetUser),
        receiverRole: targetUser.role,
        participants: [adminUser.uid, targetUser.uid],
        message: newMessage.trim(),
        read: false,
        createdAt: serverTimestamp(),
      });

      setNewMessage('');
      showSuccess('Mesaj trimis!');
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Eroare la trimiterea mesajului.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!targetUser) return null;

  const targetUserName = getDisplayName(targetUser);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${
              targetUser.role === 'curier' 
                ? 'bg-linear-to-br from-orange-400 to-orange-600' 
                : 'bg-linear-to-br from-emerald-400 to-emerald-600'
            }`}>
              {targetUserName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <ChatIcon className="w-5 h-5 text-orange-400" />
                Conversație cu {targetUserName}
              </h3>
              <p className="text-gray-400 text-sm">{targetUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ChatIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>Niciun mesaj încă</p>
              <p className="text-sm mt-1">Începe conversația cu {targetUserName}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.senderId === adminUser?.uid;
              return (
                <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      isAdmin
                        ? 'bg-linear-to-br from-orange-500 to-orange-600 text-white'
                        : 'bg-slate-700/50 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isAdmin ? 'text-orange-200' : 'text-gray-400'}`}>
                      {msg.createdAt?.toDate?.()?.toLocaleString('ro-RO', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) || 'Acum'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Scrie un mesaj către ${targetUserName}...`}
              className="flex-1 bg-slate-700/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-white/10"
              rows={3}
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Trimite'
              )}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Apasă Enter pentru a trimite, Shift+Enter pentru linie nouă
          </p>
        </div>
      </div>
    </div>
  );
}
