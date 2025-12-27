'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
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
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [courierVerified, setCourierVerified] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldScrollRef = useRef(true);

  // Check courier verification status
  useEffect(() => {
    const checkCourierVerification = async () => {
      if (!courierId || user?.role !== 'client') return;
      try {
        const userDoc = await getDoc(doc(db, 'users', courierId));
        if (userDoc.exists()) {
          setCourierVerified(userDoc.data().verified === true);
        }
      } catch (error) {
        console.error('Error checking courier verification:', error);
      }
    };
    checkCourierVerification();
  }, [courierId, user?.role]);

  // Scroll to bottom when new messages arrive - use container scroll, not scrollIntoView
  const scrollToBottom = () => {
    if (shouldScrollRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM has fully rendered before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Listen to messages in real-time
  useEffect(() => {
    if (!orderId || !user) return;

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
          attachmentUrl: data.attachmentUrl,
          attachmentName: data.attachmentName,
          attachmentType: data.attachmentType,
          read: data.read || false,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      setMessages(loadedMessages);
    }, (error) => {
      console.error('OrderChat - Error:', error);
      logError(error, 'Error loading messages');
    });

    return () => unsubscribe();
  }, [orderId, user, courierId, clientId]);

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
              where('courierId', '==', courierId)
            );
          } else {
            q = query(
              messagesRef,
              where('orderId', '==', orderId),
              where('clientId', '==', user.uid)
            );
          }
        } else {
          // Courier marks messages from client as read
          if (!clientId) return;
          
          q = query(
            messagesRef,
            where('orderId', '==', orderId),
            where('clientId', '==', clientId),
            where('courierId', '==', user.uid)
          );
        }

        const snapshot = await getDocs(q);
        
        // Filter out own messages and messages already read, then update
        const updatePromises = snapshot.docs
          .filter(docSnap => {
            const data = docSnap.data();
            // Skip own messages
            if (data.senderId === user.uid) return false;
            // For client: only update if not already readByClient
            if (user.role === 'client' && data.readByClient === true) return false;
            // For courier: only update if not already readByCourier
            if (user.role !== 'client' && data.readByCourier === true) return false;
            return true;
          })
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
    
    if ((!newMessage.trim() && !selectedFile) || !user || !orderId) return;

    // Keep scroll at bottom when sending
    shouldScrollRef.current = true;
    
    setLoading(true);
    try {
      const receiverId = user.role === 'client' ? (courierId || '') : (clientId || '');
      const finalCourierId = user.role === 'curier' ? user.uid : (courierId || '');
      const finalClientId = user.role === 'client' ? user.uid : (clientId || '');
      
      // Upload attachment if selected
      let attachmentUrl = '';
      let attachmentName = '';
      let attachmentType = '';
      
      if (selectedFile) {
        setUploadingFile(true);
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const storageRef = ref(storage, `chat_attachments/${orderId}/${fileName}`);
        
        await uploadBytes(storageRef, selectedFile);
        attachmentUrl = await getDownloadURL(storageRef);
        attachmentName = selectedFile.name;
        attachmentType = selectedFile.type;
        setUploadingFile(false);
      }
      
      await addDoc(collection(db, 'mesaje'), {
        orderId,
        senderId: user.uid,
        senderName: formatSenderName(user.nume || user.displayName, user.email),
        senderRole: user.role,
        receiverId,
        clientId: finalClientId,
        courierId: finalCourierId,
        message: newMessage.trim(),
        ...(attachmentUrl && { attachmentUrl, attachmentName, attachmentType }),
        read: false,
        createdAt: serverTimestamp(),
      });

      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('Fișierul este prea mare. Dimensiunea maximă este 10MB.');
      return;
    }
    
    setSelectedFile(file);
  };

  const isImageFile = (type?: string) => type?.startsWith('image/');

  // Format sender name: "Prenume N." (first name + last name initial)
  const formatSenderName = (fullName?: string, email?: string): string => {
    if (fullName && fullName.trim()) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        // Assume format is "Prenume Nume" - show "Prenume N."
        const firstName = parts[0];
        const lastName = parts[parts.length - 1];
        return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
      }
      return fullName;
    }
    // Fallback to email prefix formatted nicely
    if (email) {
      const prefix = email.split('@')[0];
      // Capitalize first letter
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return 'Utilizator';
  };

  return (
    <div className={`flex flex-col h-full ${compact ? '' : 'bg-linear-to-br from-slate-900/60 to-slate-900/80 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm'}`}>
      {/* Header with improved design - Only show if not compact */}
      {!compact && (
        <div className="px-3 py-2.5 border-b border-slate-700/50 bg-linear-to-r from-slate-800/60 to-slate-800/40 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                Chat Comandă {orderNumber ? `#CP${orderNumber}` : ''}
              </h3>
              <p className="text-[10px] text-gray-400">Mesagerie instant</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages with improved scrollbar */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-2.5 custom-scrollbar"
        style={{ maxHeight: compact ? 'none' : '380px' }}
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
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-linear-to-br from-slate-800 to-slate-800/80 border border-slate-700/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-300 text-xs font-medium">Niciun mesaj încă</p>
            <p className="text-gray-500 text-[10px] mt-1">Începe conversația pentru această comandă</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === user?.uid;
            const isClient = msg.senderRole === 'client';

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-200`}
              >
                <div className={`max-w-[85%] sm:max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {/* Sender name with avatar circle */}
                  {!isOwnMessage && (
                    <div className="flex items-center gap-1.5 px-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isClient 
                          ? 'bg-linear-to-br from-emerald-500 to-emerald-600 text-white'
                          : 'bg-linear-to-br from-orange-500 to-orange-600 text-white'
                      }`}>
                        {msg.senderName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-gray-300">{msg.senderName}</span>
                      {/* Verified badge for couriers */}
                      {!isClient && courierVerified && (
                        <div className="p-0.5 bg-emerald-500/20 rounded-full" title="Curier verificat">
                          <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <span className={`w-1 h-1 rounded-full ${isClient ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                    </div>
                  )}
                  
                  {/* Image attachment - displayed outside bubble with hover effect */}
                  {msg.attachmentUrl && isImageFile(msg.attachmentType) && (
                    <button 
                      type="button"
                      onClick={() => setPreviewImage({ url: msg.attachmentUrl!, name: msg.attachmentName || 'Imagine' })}
                      className="block cursor-zoom-in group relative overflow-hidden rounded-xl"
                    >
                      <Image 
                        src={msg.attachmentUrl} 
                        alt={msg.attachmentName || 'Atașament'} 
                        width={280}
                        height={192}
                        className="max-w-70 max-h-48 rounded-xl object-cover transition-transform group-hover:scale-105 shadow-lg"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </button>
                  )}

                  {/* Message bubble - only show if there's text or non-image attachment */}
                  {(msg.message || (msg.attachmentUrl && !isImageFile(msg.attachmentType))) && (
                    <div
                      className={`px-3 py-2 rounded-xl shadow-sm relative ${
                        isOwnMessage
                          ? 'bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                          : isClient
                          ? 'bg-linear-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-50 border border-emerald-500/30 rounded-bl-md backdrop-blur-sm'
                          : 'bg-linear-to-br from-orange-500/20 to-orange-600/20 text-orange-50 border border-orange-500/30 rounded-bl-md backdrop-blur-sm'
                      }`}
                    >
                      {/* Non-image attachment with improved styling */}
                      {msg.attachmentUrl && !isImageFile(msg.attachmentType) && (
                        <div className={msg.message ? 'mb-2' : ''}>
                          <a 
                            href={msg.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${
                              isOwnMessage 
                                ? 'bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/20' 
                                : 'bg-slate-700/60 hover:bg-slate-700/80 border border-white/10'
                            } transition-all hover:scale-[1.02] group`}
                          >
                            <div className={`p-1.5 rounded-lg ${isOwnMessage ? 'bg-blue-400/20' : 'bg-orange-400/20'}`}>
                              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium truncate block">{msg.attachmentName}</span>
                            </div>
                            <svg className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                      {msg.message && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                      )}
                    </div>
                  )}

                  {/* Timestamp with improved styling */}
                  <span className={`text-[9px] font-medium px-1 ${
                    isOwnMessage ? 'text-blue-300/60' : 'text-gray-400'
                  }`}>
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form with enhanced design */}
      <form onSubmit={handleSendMessage} className="p-2 sm:p-3 border-t border-slate-700/50 bg-linear-to-b from-slate-800/50 to-slate-800 shrink-0">
        {/* File preview with improved styling */}
        {selectedFile && (
          <div className="mb-2 p-2 bg-linear-to-r from-slate-700/60 to-slate-700/40 border border-slate-600/50 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-2 fade-in backdrop-blur-sm">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-1.5 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-gray-200 block truncate">{selectedFile.name}</span>
                <span className="text-[9px] text-gray-400">Gata de trimitere</span>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="ml-2 p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all group"
            >
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex gap-1.5 sm:gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          
          {/* Attachment button with improved design */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || uploadingFile}
            className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-slate-700 to-slate-700/80 hover:from-slate-600 hover:to-slate-600/80 border border-slate-600/50 hover:border-slate-500 text-gray-400 hover:text-orange-400 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shrink-0"
            title="Atașează fișier"
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          {/* Message input with enhanced styling */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            disabled={loading || uploadingFile}
            className="flex-1 min-w-0 px-3 py-2 bg-slate-700/60 border border-slate-600/50 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700 transition-all backdrop-blur-sm disabled:opacity-50"
          />
          
          {/* Send button with gradient and animation */}
          <button
            type="submit"
            disabled={loading || uploadingFile || (!newMessage.trim() && !selectedFile)}
            className="px-3 sm:px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 disabled:hover:scale-100 flex items-center gap-1.5 text-sm shrink-0 group"
          >
            {(loading || uploadingFile) ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span className="hidden sm:inline">Trimite...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Trimite</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Image Preview Modal with improved design */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-gray-300 hover:text-white transition-all border border-slate-600/50 z-10 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-6xl max-h-[90vh] animate-in zoom-in-95 duration-200">
            <Image 
              src={previewImage.url} 
              alt={previewImage.name}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-slate-700/50"
              onClick={(e) => e.stopPropagation()}
              unoptimized
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700/50 text-sm text-gray-300 max-w-md truncate">
              {previewImage.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
