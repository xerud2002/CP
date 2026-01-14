'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import OrderChat from './OrderChat';
import CourierProfileModal from './CourierProfileModal';

interface CourierConversation {
  courierId: string;
  courierName: string;
  companyName: string;
  profileImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  verified?: boolean;
}

interface OrderChatMultiProps {
  orderId: string;
  orderNumber?: number;
}

export default function OrderChatMulti({ orderId, orderNumber }: OrderChatMultiProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<CourierConversation[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch all couriers who have messaged this order
  useEffect(() => {
    if (!orderId || !user || user.role !== 'client') return;

    const messagesRef = collection(db, 'mesaje');
    const q = query(
      messagesRef,
      where('orderId', '==', orderId),
      where('clientId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      // Group messages by courierId
      const courierMap = new Map<string, {
        lastMessage: string;
        lastMessageTime: Date;
        unreadCount: number;
      }>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const courierId = data.courierId;
        
        if (!courierId) return;

        const existing = courierMap.get(courierId);
        const messageTime = data.createdAt?.toDate() || new Date();
        
        // Use readByClient for client unread count
        const isUnread = data.readByClient !== true && data.senderId !== user.uid;
        
        if (!existing || messageTime > existing.lastMessageTime) {
          courierMap.set(courierId, {
            lastMessage: data.message,
            lastMessageTime: messageTime,
            unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0)
          });
        } else if (isUnread) {
          courierMap.set(courierId, {
            ...existing,
            unreadCount: existing.unreadCount + 1
          });
        }
      });

      // Fetch courier profiles
      const conversationsData: CourierConversation[] = [];
      for (const [courierId, data] of courierMap.entries()) {
        try {
          // Get courier name from users collection
          const userDoc = await getDoc(doc(db, 'users', courierId));
          const userData = userDoc.data();
          const courierName = userData?.nume || userData?.displayName || 'Curier';
          const isVerified = userData?.verified === true;

          // Get company name and profile image from profil_curier
          const profilDoc = await getDoc(doc(db, 'profil_curier', courierId));
          const profilData = profilDoc.data();
          const companyName = profilData?.firma || profilData?.numeCompanie || profilData?.denumire_firma || profilData?.nume || courierName;
          const profileImage = profilData?.profileImage || profilData?.logo || profilData?.logoUrl;

          conversationsData.push({
            courierId,
            courierName,
            companyName,
            profileImage,
            lastMessage: data.lastMessage,
            lastMessageTime: data.lastMessageTime,
            unreadCount: data.unreadCount,
            verified: isVerified
          });
        } catch (error) {
          console.error('Error fetching courier data:', error);
        }
      }

      // Sort by last message time (most recent first)
      conversationsData.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
      
      setConversations(conversationsData);
      
      // Auto-select first conversation if none selected
      if (!selectedCourierId && conversationsData.length > 0) {
        setSelectedCourierId(conversationsData[0].courierId);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId, user, selectedCourierId]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Acum';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}z`;
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-3">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Niciun mesaj pentru această comandă</p>
          <p className="text-gray-500 text-xs mt-1">Așteptați ca un curier să vă contacteze</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[70vh] md:h-112 bg-slate-900 rounded-lg overflow-hidden border border-white/10">
      {/* Sidebar - Lista curieri */}
      <div className={`${selectedCourierId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/50 flex-col max-h-full`}>
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-white/10 shrink-0">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Conversații ({conversations.length})
          </h3>
          <p className="text-gray-500 text-xs mt-1">Comanda #{orderNumber || orderId.slice(0, 8)}</p>
        </div>

        {/* Lista conversații */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map((conv) => (
            <button
              key={conv.courierId}
              onClick={() => setSelectedCourierId(conv.courierId)}
              className={`w-full p-3 border-b border-white/5 hover:bg-slate-800/50 transition-colors text-left active:bg-slate-800/70 ${
                selectedCourierId === conv.courierId ? 'bg-slate-800/70' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Avatar */}
                {conv.profileImage ? (
                  <Image 
                    src={conv.profileImage} 
                    alt={conv.companyName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-orange-500/30"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0 border-2 border-orange-400/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/>
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-white font-medium text-sm truncate">{conv.companyName}</h4>
                      {/* Verified badge */}
                      {conv.verified && (
                        <div className="p-0.5 bg-emerald-500/20 rounded-full shrink-0" title="Curier verificat">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs shrink-0">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs truncate">{conv.lastMessage}</p>
                </div>

                {/* Unread badge */}
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{conv.unreadCount}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${!selectedCourierId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-800/50 min-h-0`}>
        {selectedCourierId ? (
          <>
            {/* Chat header */}
            <div className="p-3 border-b border-white/10 bg-slate-800/30 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Back button on mobile */}
                  <button
                    onClick={() => setSelectedCourierId(null)}
                    className="md:hidden p-1.5 hover:bg-slate-700/50 active:bg-slate-700 rounded-lg transition-colors shrink-0"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {conversations.find(c => c.courierId === selectedCourierId)?.profileImage ? (
                    <Image 
                      src={conversations.find(c => c.courierId === selectedCourierId)?.profileImage || ''} 
                      alt={conversations.find(c => c.courierId === selectedCourierId)?.companyName || 'Logo'}
                      width={40}
                      height={40}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-orange-500/30 shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0 border-2 border-orange-400/20">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/>
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-white font-medium text-sm truncate">
                        {conversations.find(c => c.courierId === selectedCourierId)?.companyName}
                      </h4>
                      {/* Verified badge in header */}
                      {conversations.find(c => c.courierId === selectedCourierId)?.verified && (
                        <div className="p-0.5 bg-emerald-500/20 rounded-full shrink-0" title="Curier verificat">
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">
                      {conversations.find(c => c.courierId === selectedCourierId)?.verified ? 'Curier verificat' : 'Curier'}
                    </p>
                  </div>
                </div>
                
                {/* View Profile Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 active:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-all group shrink-0"
                  title="Vezi profilul companiei"
                >
                  <svg className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-medium text-orange-400 group-hover:text-orange-300 transition-colors hidden sm:inline">Profil</span>
                </button>
              </div>
            </div>

            {/* OrderChat component */}
            <div className="flex-1 overflow-hidden min-h-0">
              <OrderChat
                orderId={orderId}
                orderNumber={orderNumber}
                courierId={selectedCourierId}
                clientId={user?.uid}
                compact={true}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Selectează o conversație</p>
          </div>
        )}
      </div>

      {/* Courier Profile Modal */}
      {showProfileModal && selectedCourierId && (
        <CourierProfileModal
          courierId={selectedCourierId}
          companyName={conversations.find(c => c.courierId === selectedCourierId)?.companyName || 'Curier'}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
