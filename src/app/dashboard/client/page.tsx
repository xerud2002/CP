'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, lazy, Suspense } from 'react';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logError } from '@/lib/errorMessages';
import { useUserActivity } from '@/hooks/useUserActivity';
import { useAdminMessages } from '@/hooks/useAdminMessages';
import UserMessageModal from '@/components/UserMessageModal';
import {
  UserIcon,
  BoxIcon,
  ChatIcon,
  PackageIcon,
  BellIcon,
  AdminMessageIcon,
  StarIcon,
} from '@/components/icons/DashboardIcons';

// Lazy load below-fold components
const HelpCard = lazy(() => import('@/components/HelpCard'));
const NotificationToggle = lazy(() => import('@/components/ui/NotificationToggle').then(m => ({ default: m.NotificationToggle })));

// ============================================
// TYPES & INTERFACES
// ============================================
interface RecentMessage {
  id: string;
  orderId: string;
  orderNumber?: number;
  senderName: string;
  senderRole: 'client' | 'curier';
  message: string;
  createdAt: Date;
  read?: boolean;
  senderId?: string;
  unreadCount?: number;
}

// ============================================
// CONFIGURATION DATA
// ============================================

// Navigation tiles for main menu - Client version
interface NavTile {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: string;
}

const mainNavTiles: NavTile[] = [
  {
    href: '/comanda',
    icon: BoxIcon,
    title: 'Comandă nouă',
    description: 'Găsește parteneri',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
  },
  {
    href: '/dashboard/client/comenzi',
    icon: PackageIcon,
    title: 'Comenzi',
    description: 'Comenzile tale',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    href: '/dashboard/client/profil',
    icon: UserIcon,
    title: 'Profil',
    description: 'Date personale',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  {
    href: '/dashboard/client/suport',
    icon: ChatIcon,
    title: 'Suport',
    description: 'Ajutor 24/7',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
    borderColor: 'border-pink-500/20 hover:border-pink-500/40',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bună dimineața';
  if (hour < 18) return 'Bună ziua';
  return 'Bună seara';
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Header Component
function DashboardHeader({ adminUnreadCount, onLogout, onOpenAdminMessages }: { 
  adminUnreadCount: number;
  onLogout: () => void;
  onOpenAdminMessages: () => void;
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            {/* Logo Image */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-all">
              <Image 
                src="/img/logo2.png" 
                alt="Curierul Perfect Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            {/* Text - Hidden on mobile */}
            <div className="hidden sm:flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                <span className="group-hover:opacity-80 transition-opacity" style={{color: '#FF8C00'}}>CurierulPerfect</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium tracking-wider uppercase text-center">- TRANSPORT EUROPA -</span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Admin Messages */}
            <button 
              onClick={onOpenAdminMessages}
              className="relative p-2.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 active:bg-white/10"
              title="Mesaje de la administrator"
            >
              <AdminMessageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {adminUnreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full text-[10px] sm:text-xs font-medium text-white flex items-center justify-center">
                  {adminUnreadCount}
                </span>
              )}
            </button>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="p-2.5 sm:px-4 sm:py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:bg-white/10"
              title="Ieșire"
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Ieșire</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Welcome Section Component
function WelcomeSection({ userName }: { userName: string }) {
  const greeting = getGreeting();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 backdrop-blur-sm border border-orange-500/10 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-linear-to-br from-emerald-500/8 to-emerald-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-linear-to-tr from-orange-500/8 to-amber-500/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
              {greeting}, <span className="text-emerald-400">{userName}</span>!
            </h1>
            <p className="text-gray-400 text-xs sm:text-base">Transport în toată Europa cu parteneri verificați</p>
          </div>

          {/* Status Badges */}
          <div className="shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-sm font-medium border border-emerald-500/30">
              ● Activ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Navigation Grid
// Secțiune cu 5 carduri de navigare rapidă:
// 1. Comandă Transport (orange) - badge "Popular" - link către /comanda pentru crearea comenzilor noi
// 2. Comenzi (blue) - afișează notificări (oferte noi + mesaje noi) dacă există
// 3. Profil (emerald) - gestionare date personale
// 3. Suport (pink) - ajutor 24/7
// Fiecare card are: iconă colorată, titlu, descriere scurtă, hover gradient overlay
// Notificările apar DOAR pe cardul "Comenzi" când există oferte sau mesaje noi
function MainNavigation({ totalNotifications }: { totalNotifications: number }) {
  // Color mappings for hover gradients
  const gradientMap: Record<string, string> = {
    'text-orange-400': 'from-orange-500/20 to-amber-500/20',
    'text-blue-400': 'from-blue-500/20 to-cyan-500/20',
    'text-emerald-400': 'from-emerald-500/20 to-green-500/20',
    'text-violet-400': 'from-violet-500/20 to-purple-500/20',
    'text-yellow-400': 'from-yellow-500/20 to-amber-500/20',
    'text-pink-400': 'from-pink-500/20 to-rose-500/20',
  };
  
  const borderColorMap: Record<string, string> = {
    'text-orange-400': 'border-orange-500/30 hover:border-orange-400/50',
    'text-blue-400': 'border-blue-500/30 hover:border-blue-400/50',
    'text-emerald-400': 'border-emerald-500/30 hover:border-emerald-400/50',
    'text-violet-400': 'border-violet-500/30 hover:border-violet-400/50',
    'text-yellow-400': 'border-yellow-500/30 hover:border-yellow-400/50',
    'text-pink-400': 'border-pink-500/30 hover:border-pink-400/50',
  };
  
  const iconBgMap: Record<string, string> = {
    'text-orange-400': 'bg-orange-500/20',
    'text-blue-400': 'bg-blue-500/20',
    'text-emerald-400': 'bg-emerald-500/20',
    'text-violet-400': 'bg-violet-500/20',
    'text-yellow-400': 'bg-yellow-500/20',
    'text-pink-400': 'bg-pink-500/20',
  };

  return (
    <section>
      <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-3 sm:mb-4">Meniu rapid</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {mainNavTiles.map((tile) => {
          const gradient = gradientMap[tile.color] || 'from-slate-500/20 to-slate-500/20';
          const borderColor = borderColorMap[tile.color] || 'border-white/10 hover:border-white/20';
          const iconBg = iconBgMap[tile.color] || 'bg-slate-500/20';
          const isComenziCard = tile.href === '/dashboard/client/comenzi';
          const hasNotifications = isComenziCard && totalNotifications > 0;
          
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className={`group relative bg-linear-to-br from-slate-800/90 via-slate-850/85 to-slate-900/90 backdrop-blur-xl rounded-xl border ${borderColor} p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex flex-col min-h-30 sm:min-h-35`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`}></div>
              
              {/* Badge */}
              {tile.badge && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full z-10">
                  {tile.badge}
                </span>
              )}
              
              {/* Notification Badge - Simple style without beam effect */}
              {hasNotifications && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 z-10">
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 items-center justify-center text-[9px] sm:text-[10px] font-bold text-white">
                    {totalNotifications}
                  </span>
                </span>
              )}
              
              <div className="relative flex-1 flex flex-col justify-between">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 ${iconBg} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <tile.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${tile.color}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{tile.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{tile.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Recent Activity Component - Shows recent messages from couriers
function RecentActivity({ recentMessages, unreadCount }: { recentMessages: RecentMessage[]; unreadCount: number }) {
  // Format timestamp to relative time
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

  // Truncate message preview
  const truncateMessage = (msg: string, maxLength: number = 40) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength).trim() + '...';
  };

  // Format display name: returns company name as is
  const formatDisplayName = (name: string): string => {
    if (!name) return 'Curier Transport';
    return name;
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-3.5 sm:p-6 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="relative p-1.5 bg-purple-500/20 rounded-lg">
            <BellIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
            )}
          </div>
          Mesaje recente
          {unreadCount > 0 && (
            <span className="text-[10px] sm:text-xs font-medium text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-full">
              {unreadCount} noi
            </span>
          )}
        </h3>
      </div>
      <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
        {recentMessages.length === 0 ? (
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <ChatIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400/50" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Niciun mesaj recent</p>
          </div>
        ) : (
          <>
            {recentMessages.map((msg) => (
              <Link
                key={msg.id}
                href={`/dashboard/client/comenzi?orderId=${msg.orderId}`}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors group"
              >
                <div className="relative shrink-0 mt-0.5">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center ${
                    !msg.read ? 'bg-orange-500/30' : 'bg-slate-700'
                  }`}>
                    <Image
                      src="/img/default-avatar.svg"
                      alt={formatDisplayName(msg.senderName)}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!msg.read && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className={`text-[11px] sm:text-sm font-medium truncate ${!msg.read ? 'text-white' : 'text-gray-300'}`}>
                        {formatDisplayName(msg.senderName)}
                      </span>
                      {msg.unreadCount && msg.unreadCount > 0 && (
                        <span className="text-[9px] sm:text-[10px] font-semibold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                          {msg.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-500 shrink-0">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className={`text-[10px] sm:text-xs truncate ${!msg.read ? 'text-gray-300' : 'text-gray-500'}`}>
                    {msg.orderNumber ? `#CP${msg.orderNumber} · ` : ''}{truncateMessage(msg.message)}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
            <Link
              href="/dashboard/client/comenzi"
              className="text-center text-[11px] sm:text-xs text-purple-400 hover:text-purple-300 py-2 transition-colors"
            >
              Vezi toate mesajele →
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ClientDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [userNume, setUserNume] = useState<string | null>(null);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAdminMessages, setShowAdminMessages] = useState(false);

  // Track user activity for online status
  useUserActivity(user?.uid);

  // Track admin messages
  const { unreadCount: adminUnreadCount } = useAdminMessages();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Try to get name from profil_client collection
        const profilRef = doc(db, 'profil_client', user.uid);
        const profilSnap = await getDoc(profilRef);
        
        if (profilSnap.exists()) {
          const profilData = profilSnap.data();
          if (profilData.nume) {
            setUserNume(profilData.nume);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Fetch notifications from orders
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const q = query(
          collection(db, 'comenzi'),
          where('uid_client', '==', user.uid)
        );
        
        const snapshot = await getDocs(q);
        let total = 0;
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const nrOferte = data.nrOferte || 0;
          const nrMesajeNoi = data.nrMesajeNoi || 0;
          total += nrOferte + nrMesajeNoi;
        });
        
        setTotalNotifications(total);
      } catch (error) {
        console.error('❌ Eroare la încărcarea notificărilor:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Real-time listener for recent messages sent to this client (from couriers)
  useEffect(() => {
    if (!user) return;

    // Query messages where this client is the recipient (from couriers)
    const q = query(
      collection(db, 'mesaje'),
      where('clientId', '==', user.uid),
      where('senderRole', '==', 'curier'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    // Force reading from server, not cache - prevents stale data after archiving
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: false }, async (snapshot) => {
      const allMessages: RecentMessage[] = [];
      let unread = 0;

      // Gather order IDs and courier IDs
      const orderIds = new Set<string>();
      const courierIds = new Set<string>();
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        if (data.orderId) orderIds.add(data.orderId);
        if (data.senderId) courierIds.add(data.senderId);
      });

      // Fetch order numbers in batch and check if archived
      const orderNumbers: Record<string, number> = {};
      const archivedOrders = new Set<string>();
      if (orderIds.size > 0) {
        const orderPromises = Array.from(orderIds).map(async (orderId) => {
          const orderDoc = await getDoc(doc(db, 'comenzi', orderId));
          if (orderDoc.exists()) {
            const orderData = orderDoc.data();
            orderNumbers[orderId] = orderData.orderNumber;
            // Mark archived orders
            if (orderData.archived === true) {
              archivedOrders.add(orderId);
            }
          }
        });
        await Promise.all(orderPromises);
      }

      // Fetch courier company names in batch
      const courierNames: Record<string, string> = {};
      if (courierIds.size > 0) {
        const courierPromises = Array.from(courierIds).map(async (courierId) => {
          const courierDoc = await getDoc(doc(db, 'profil_curier', courierId));
          if (courierDoc.exists()) {
            const data = courierDoc.data();
            // Priority: company name > personal name > fallback
            courierNames[courierId] = data.denumire_firma || data.nume || 'Curier Transport';
          }
        });
        await Promise.all(courierPromises);
      }

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const orderId = data.orderId || '';
        
        // Skip messages from archived orders
        if (archivedOrders.has(orderId)) {
          return;
        }
        
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const isRead = data.readByClient === true;
        
        if (!isRead) unread++;
        
        allMessages.push({
          id: docSnap.id,
          orderId,
          orderNumber: orderNumbers[orderId],
          senderName: courierNames[data.senderId] || 'Curier Transport',
          senderRole: data.senderRole || 'curier',
          message: data.message || '',
          createdAt,
          read: isRead,
          senderId: data.senderId,
        });
      });

      // Group by courier (senderId) and keep only the most recent message per courier
      // Also track unread count per courier
      const courierMessageMap = new Map<string, RecentMessage>();
      const courierUnreadCount = new Map<string, number>();

      allMessages.forEach(msg => {
        if (msg.senderId) {
          const existing = courierMessageMap.get(msg.senderId);
          
          // Count unread messages per courier
          if (!msg.read) {
            courierUnreadCount.set(msg.senderId, (courierUnreadCount.get(msg.senderId) || 0) + 1);
          }
          
          // Keep the message with the most recent createdAt
          if (!existing || msg.createdAt > existing.createdAt) {
            courierMessageMap.set(msg.senderId, msg);
          }
        }
      });

      // Convert map back to array, add unread count, and sort by date (most recent first)
      const uniqueMessages = Array.from(courierMessageMap.values())
        .map(msg => ({
          ...msg,
          unreadCount: courierUnreadCount.get(msg.senderId!) || 0
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setRecentMessages(uniqueMessages);
      setUnreadCount(unread);
    }, (error) => {
      logError(error, 'Error listening to recent messages');
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Extract first name
  const getFirstName = () => {
    if (userNume) {
      const firstName = userNume.split(' ')[0];
      return firstName || 'Client';
    }
    if (user.displayName) {
      const firstName = user.displayName.split(' ')[0];
      return firstName || 'Client';
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Client';
  };
  const userName = getFirstName();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <DashboardHeader 
        adminUnreadCount={adminUnreadCount}
        onLogout={handleLogout}
        onOpenAdminMessages={() => setShowAdminMessages(true)}
      />

      {/* Admin Messages Modal */}
      {showAdminMessages && (
        <UserMessageModal onClose={() => setShowAdminMessages(false)} />
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} />

        {/* Push Notifications Toggle */}
        <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <BellIcon className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Notificări Push</h3>
                <p className="text-xs text-gray-400">Primește alerte instant pentru mesaje și actualizări</p>
              </div>
            </div>
            <Suspense fallback={<div className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm">Se încarcă...</div>}>
              <NotificationToggle userId={user?.uid} />
            </Suspense>
          </div>
        </section>

        {/* Main Navigation - Quick access to all sections */}
        <MainNavigation totalNotifications={totalNotifications} />

        {/* Recent Activity */}
        <RecentActivity recentMessages={recentMessages} unreadCount={unreadCount} />

        {/* Help Card - Lazy loaded */}
        <Suspense fallback={null}>
          <HelpCard />
        </Suspense>
      </main>
    </div>
  );
}





