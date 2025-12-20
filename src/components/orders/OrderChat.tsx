'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';

interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'curier';
  receiverId: string;
  courierId?: string;
  clientId?: string;
  message: string;
  createdAt: Date;
  read?: boolean;
}

interface OrderChatProps {
  orderId: string;
  orderNumber?: number;
  courierId?: string;
  clientId?: string;
  compact?: boolean; // If true, hides header (for use in OrderChatMulti)
}

export default function OrderChat({ orderId, orderNumber, courierId, clientId, compact = false }: OrderChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen to messages in real-time
  useEffect(() => {
    if (!orderId || !user) return;

    console.log('OrderChat - Init', { userRole: user.role, orderId, courierId, clientId });

    const messagesRef = collection(db, 'mesaje');
    
    // Build query based on user role and available IDs
    let q;
    if (user.role === 'client') {
      // Client sees messages for this order and clientId
      // If courierId is provided, filter by it (specific courier chat)
      // If no courierId, show ALL messages for this order (any courier can message)
      if (courierId) {
        q = query(
          messagesRef,
          where('orderId', '==', orderId),
          where('clientId', '==', user.uid),
          where('courierId', '==', courierId),
          orderBy('createdAt', 'asc')
        );
      } else {
        // No courier assigned yet - show messages from ANY courier for this order
        q = query(
          messagesRef,
          where('orderId', '==', orderId),
          where('clientId', '==', user.uid),
          orderBy('createdAt', 'asc')
        );
      }
    } else {
      // Courier sees messages between them and the client
      // Use provided courierId or fall back to user.uid (current courier)
      const effectiveCourierId = courierId || user.uid;
      
      if (!clientId) {
        console.error('OrderChat - No clientId for courier!');
        setMessages([]);
        return;
      }
      
      q = query(
        messagesRef,
        where('orderId', '==', orderId),
        where('clientId', '==', clientId),
        where('courierId', '==', effectiveCourierId),
        orderBy('createdAt', 'asc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          orderId: data.orderId,
          senderId: data.senderId,
          senderName: data.senderName,
          senderRole: data.senderRole,
          receiverId: data.receiverId,
          clientId: data.clientId,
          courierId: data.courierId,
          message: data.message,
          read: data.read || false,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      console.log('OrderChat - Messages loaded:', loadedMessages.length);
      setMessages(loadedMessages);
    }, (error) => {
      console.error('OrderChat - Error:', error);
      logError(error, 'Error loading messages');
    });

    return () => unsubscribe();
  }, [orderId, user?.uid, user?.role, courierId, clientId]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!orderId || !user) return;

      try {
        const messagesRef = collection(db, 'mesaje');
        let q;
        
        if (user.role === 'client') {
          // Client marks messages from courier as read
          if (courierId) {
            q = query(
              messagesRef,
              where('orderId', '==', orderId),
              where('clientId', '==', user.uid),
              where('courierId', '==', courierId),
              where('read', '==', false)
            );
          } else {
            q = query(
              messagesRef,
              where('orderId', '==', orderId),
              where('clientId', '==', user.uid),
              where('read', '==', false)
            );
          }
        } else {
          // Courier marks messages from client as read
          if (!clientId) return;
          
          q = query(
            messagesRef,
            where('orderId', '==', orderId),
            where('clientId', '==', clientId),
            where('courierId', '==', user.uid),
            where('read', '==', false)
          );
        }

        const snapshot = await getDocs(q);
        
        // Filter out own messages and update only received messages
        const updatePromises = snapshot.docs
          .filter(docSnap => docSnap.data().senderId !== user.uid)
          .map(docSnap => {
            const updateData: Record<string, boolean> = { read: true };
            // Set role-specific read flag
            if (user.role === 'client') {
              updateData.readByClient = true;
            } else {
              updateData.readByCourier = true;
            }
            return updateDoc(doc(db, 'mesaje', docSnap.id), updateData);
          });
        
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
          console.log(`Marked ${updatePromises.length} messages as read`);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
        logError(error, 'Error marking messages as read');
      }
    };

    // Mark as read after a short delay to ensure chat is fully loaded
    const timer = setTimeout(() => {
      markMessagesAsRead();
    }, 500);

    return () => clearTimeout(timer);
  }, [orderId, user, courierId, clientId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newMessage.trim() || !user || !orderId) return;

    // Keep scroll at bottom when sending
    shouldScrollRef.current = true;
    
    setLoading(true);
    try {
      const receiverId = user.role === 'client' ? (courierId || '') : (clientId || '');
      const finalCourierId = user.role === 'curier' ? user.uid : (courierId || '');
      const finalClientId = user.role === 'client' ? user.uid : (clientId || '');
      
      await addDoc(collection(db, 'mesaje'), {
        orderId,
        senderId: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'Utilizator',
        senderRole: user.role,
        receiverId,
        clientId: finalClientId,
        courierId: finalCourierId,
        message: newMessage.trim(),
        read: false,
        createdAt: serverTimestamp(),
      });

      setNewMessage('');
      
      // Force scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      showSuccess('Mesaj trimis!');
    } catch (error) {
      console.error('OrderChat - Send error:', error);
      logError(error, 'Error sending message');
      showError('Eroare la trimiterea mesajului');
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Acum';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}z`;
    
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full ${compact ? '' : 'bg-slate-900/40 rounded-xl border border-white/5'}`}>
      {/* Header - Only show if not compact */}
      {!compact && (
        <div className="px-4 py-3 border-b border-white/5 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-white font-semibold text-sm">
              Chat Comandă {orderNumber ? `#CP${orderNumber}` : ''}
            </h3>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        style={{ maxHeight: compact ? 'none' : '400px' }}
        onWheel={(e) => {
          // Prevent parent scroll when scrolling inside chat
          const element = e.currentTarget;
          const atTop = element.scrollTop === 0;
          const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
          
          if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            // Allow scroll to propagate when at boundaries
            return;
          }
          e.stopPropagation();
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Niciun mesaj încă</p>
            <p className="text-gray-500 text-xs mt-1">Începe conversația pentru această comandă</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === user?.uid;
            const isClient = msg.senderRole === 'client';

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {/* Sender name */}
                  {!isOwnMessage && (
                    <div className="flex items-center gap-1.5 px-2">
                      <div className={`w-2 h-2 rounded-full ${isClient ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                      <span className="text-xs text-gray-400">{msg.senderName}</span>
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : isClient
                        ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-bl-md'
                        : 'bg-orange-500/20 text-orange-100 border border-orange-500/30 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-gray-500 px-2">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-slate-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            Trimite
          </button>
        </div>
      </form>
    </div>
  );
}
