'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import HelpCard from '@/components/HelpCard';
import {
  UserIcon,
  BoxIcon,
  ChatIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  BellIcon,
  StarIcon,
} from '@/components/icons/DashboardIcons';

// ============================================
// TYPES & INTERFACES
// ============================================
interface ActivityItem {
  type: string;
  message: string;
  time: string;
  color: string;
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
    title: 'Comandă Transport',
    description: 'Găsește parteneri',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
    badge: 'Popular',
  },
  {
    href: '/dashboard/client/comenzi',
    icon: PackageIcon,
    title: 'Comenzi',
    description: 'Coletele tale',
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
    href: '/dashboard/client/recenzii',
    icon: StarIcon,
    title: 'Recenzii',
    description: 'Evaluează serviciile',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10 hover:bg-violet-500/20',
    borderColor: 'border-violet-500/20 hover:border-violet-500/40',
  },
  {
    href: '/dashboard/client/fidelitate',
    icon: StarIcon,
    title: 'Fidelitate',
    description: 'Puncte & reduceri',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20',
    borderColor: 'border-yellow-500/20 hover:border-yellow-500/40',
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

// Activities will be loaded from Firebase
const recentActivities: ActivityItem[] = [];

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
function DashboardHeader({ userName, notificationCount, onLogout }: { 
  userName: string; 
  notificationCount: number;
  onLogout: () => void;
}) {
  return (
    <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            {/* Logo Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-emerald-500/10 rounded-xl blur-2xl opacity-70 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800/95 via-slate-850/95 to-slate-900/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-2xl border border-orange-500/20 group-hover:border-orange-500/40 group-hover:scale-105 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-emerald-500/5"></div>
                <Image 
                  src="/img/logo.png" 
                  alt="Curierul Perfect Logo" 
                  width={36} 
                  height={36} 
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain relative z-10"
                />
              </div>
            </div>
            {/* Text - Hidden on mobile */}
            <div className="hidden sm:flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                <span className="group-hover:opacity-80 transition-opacity" style={{color: '#FF8C00'}}>CurierulPerfect</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium tracking-wider uppercase">Transport Europa</span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button className="relative p-2.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 active:bg-white/10">
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full text-[10px] sm:text-xs font-medium text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <Link href="/dashboard/client/profil" className="flex items-center gap-2 sm:gap-3 hover:bg-white/5 rounded-xl p-1.5 transition-all">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/25">
                <Image src="/img/default-avatar.png" alt="Avatar" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-emerald-400">Client verificat ✓</p>
              </div>
            </Link>

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
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 backdrop-blur-sm border border-orange-500/10 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-emerald-500/8 to-emerald-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-tr from-orange-500/8 to-amber-500/5 rounded-full blur-3xl" />

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

// Stats Section Component
function StatsSection({ totalOrders, statusCounts }: { totalOrders: number; statusCounts: { pending: number; inTransit: number; delivered: number } }) {
  const stats = [
    { icon: PackageIcon, label: 'Colete trimise', value: totalOrders.toString(), color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/20' },
    { icon: TruckIcon, label: 'În tranzit', value: statusCounts.inTransit.toString(), color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/20' },
    { icon: CheckCircleIcon, label: 'Livrate', value: statusCounts.delivered.toString(), color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/20' },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border ${stat.borderColor} hover:border-opacity-50 transition-all`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

// Main Navigation Grid
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
      <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Meniu rapid</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
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
              className={`group relative bg-gradient-to-br from-slate-800/90 via-slate-850/85 to-slate-900/90 backdrop-blur-xl rounded-xl border ${borderColor} p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 active:scale-95`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`}></div>
              
              {/* Badge */}
              {tile.badge && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full z-10">
                  {tile.badge}
                </span>
              )}
              
              {/* Notification Badge with Beam Effect */}
              {hasNotifications && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-lg shadow-orange-500/50">
                    {totalNotifications}
                  </span>
                </span>
              )}
              
              <div className="relative">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
                  <tile.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tile.color}`} />
                </div>
                <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5">{tile.title}</h3>
                <p className="text-gray-400 text-[10px] sm:text-xs truncate">{tile.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Orders Summary Component
function OrdersSummary({ totalOrders, statusCounts }: { totalOrders: number; statusCounts: { pending: number; inTransit: number; delivered: number } }) {
  return (
    <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-3.5 sm:p-6 border border-white/5 h-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <PackageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
          </div>
          Comenzile mele
        </h3>
        <Link href="/dashboard/client/comenzi" className="text-[11px] sm:text-sm text-orange-400 hover:text-orange-300 transition-colors">
          Vezi toate →
        </Link>
      </div>
      
      {totalOrders === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <PackageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400/50" />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Nu ai nicio comandă încă</p>
          <Link 
            href="/comanda"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm"
          >
            <BoxIcon className="w-4 h-4" />
            Trimite primul colet
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="text-center py-3 sm:py-4">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{totalOrders}</div>
            <p className="text-xs sm:text-sm text-gray-400">{totalOrders === 1 ? 'Comandă activă' : 'Comenzi active'}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-lg sm:text-xl font-bold text-orange-400">{statusCounts.pending}</div>
              <div className="text-[10px] sm:text-xs text-gray-400">Noi</div>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-lg sm:text-xl font-bold text-blue-400">{statusCounts.inTransit}</div>
              <div className="text-[10px] sm:text-xs text-gray-400">În curs</div>
            </div>
            <div className="text-center p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-lg sm:text-xl font-bold text-emerald-400">{statusCounts.delivered}</div>
              <div className="text-[10px] sm:text-xs text-gray-400">Livrate</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Recent Activity Component
function RecentActivity() {
  return (
    <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-3.5 sm:p-6 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/20 rounded-lg">
            <BellIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
          </div>
          Activitate
        </h3>
      </div>
      <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-center">
        {recentActivities.length === 0 ? (
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400/50" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Nicio activitate recentă</p>
          </div>
        ) : (
          recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${activity.color}`} />
              <span className="text-gray-300 text-[11px] sm:text-sm flex-1 truncate">{activity.message}</span>
              <span className="text-gray-500 text-[9px] sm:text-xs shrink-0">{activity.time}</span>
            </div>
          ))
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
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, inTransit: 0, delivered: 0 });

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
        let orderCount = 0;
        let pending = 0;
        let inTransit = 0;
        let delivered = 0;
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const nrOferte = data.nrOferte || 0;
          const nrMesajeNoi = data.nrMesajeNoi || 0;
          total += nrOferte + nrMesajeNoi;
          
          orderCount++;
          
          // Count by status
          const status = data.status || 'pending';
          if (status === 'pending' || status === 'noua') {
            pending++;
          } else if (status === 'in_tranzit' || status === 'acceptata' || status === 'colectata') {
            inTransit++;
          } else if (status === 'livrata' || status === 'finalizata') {
            delivered++;
          }
        });
        
        setTotalNotifications(total);
        setTotalOrders(orderCount);
        setStatusCounts({ pending, inTransit, delivered });
      } catch (error) {
        console.error('❌ Eroare la încărcarea notificărilor:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
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
        userName={userName} 
        notificationCount={0} 
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} />

        {/* Stats */}
        <StatsSection totalOrders={totalOrders} statusCounts={statusCounts} />

        {/* Main Navigation - Quick access to all sections */}
        <MainNavigation totalNotifications={totalNotifications} />

        {/* Orders and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-6">
          {/* Orders Summary - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <OrdersSummary totalOrders={totalOrders} statusCounts={statusCounts} />
          </div>
          
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Help Card */}
        <HelpCard />
      </main>
    </div>
  );
}




