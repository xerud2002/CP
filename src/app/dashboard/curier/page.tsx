'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import HelpCard from '@/components/HelpCard';
import { logError } from '@/lib/errorMessages';
import {
  UserIcon,
  BoxIcon,
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

// Setup steps for new couriers
interface SetupStep {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

// Setup steps - Only active features: Profile and Services
// Zone and Calendar are disabled and removed from setup flow
const getSetupSteps = (profileComplete: boolean, servicesComplete: boolean): SetupStep[] => [
  { id: 'profile', title: 'Completează profilul', description: 'Date personale și business', href: '/dashboard/curier/profil', icon: UserIcon, completed: profileComplete },
  { id: 'services', title: 'Adaugă servicii', description: 'Ce oferi clienților?', href: '/dashboard/curier/servicii', icon: StarIcon, completed: servicesComplete },
];

// Activities will be loaded from Firebase
const recentActivities: ActivityItem[] = [];

// Navigation tiles for main menu
interface NavTile {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeKey?: 'services' | 'profile';
}

const mainNavTiles: NavTile[] = [
  {
    href: '/dashboard/curier/comenzi',
    icon: BoxIcon,
    title: 'Comenzi',
    description: 'Gestionează comenzi',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
  },
  {
    href: '/dashboard/curier/servicii',
    icon: StarIcon,
    title: 'Servicii',
    description: 'Servicii active',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40',
    badgeKey: 'services',
  },
  {
    href: '/dashboard/curier/verificare',
    icon: CheckCircleIcon,
    title: 'Verificare',
    description: 'Documente și verificare',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 hover:bg-green-500/20',
    borderColor: 'border-green-500/20 hover:border-green-500/40',
  },
  {
    href: '/dashboard/curier/profil',
    icon: UserIcon,
    title: 'Profil',
    description: 'Setările contului',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
    borderColor: 'border-pink-500/20 hover:border-pink-500/40',
    badgeKey: 'profile',
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
            <Link href="/dashboard/curier/profil" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden shadow-lg shadow-orange-500/25">
                <Image src="/img/default-avatar.png" alt="Avatar" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-emerald-400">Partener verificat ✓</p>
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

// Welcome Section Component - Simplified
function WelcomeSection({ userName, hasNewOrders }: { userName: string; hasNewOrders: boolean }) {
  const greeting = getGreeting();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 backdrop-blur-sm border border-orange-500/10 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-linear-to-br from-orange-500/8 to-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-linear-to-tr from-emerald-500/8 to-emerald-600/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
              {greeting}, <span className="text-emerald-400">{userName}</span>!
            </h1>
            {hasNewOrders ? (
              <p className="text-orange-400 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Comenzi noi de procesat
              </p>
            ) : (
              <p className="text-gray-400 text-xs sm:text-base">Bine ai revenit în panoul tău</p>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-sm font-medium border border-emerald-500/30">
              ● Online
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] sm:text-sm font-medium border border-amber-500/30 flex items-center gap-0.5 sm:gap-1">
              ⭐ 4.9
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Setup Progress Component for new couriers
// Shows only 2 active steps: Profile and Services (Zones and Calendar are disabled)
function SetupProgress({ setupComplete, completedSteps, totalSteps }: { setupComplete: boolean; completedSteps: number; totalSteps: number }) {
  if (setupComplete) return null;
  
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  const steps = getSetupSteps(completedSteps >= 1, completedSteps >= 2);
  
  return (
    <section className="bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl border border-amber-500/20 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">Configurează contul</h3>
            <p className="text-gray-400 text-xs sm:text-sm">{completedSteps} din {totalSteps} pași completați</p>
          </div>
        </div>
        <span className="text-amber-400 font-bold text-lg sm:text-xl">{percentage}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Steps */}
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={`p-3 rounded-lg border transition-all ${step.completed 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {step.completed ? (
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
              <span className="text-xs font-medium truncate">{step.title}</span>
            </div>
            <p className="text-[10px] text-gray-500 truncate">{step.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Main Navigation Grid
function MainNavigation({ badges, newOrdersCount }: { badges: Record<string, boolean>; newOrdersCount: number }) {
  // Color mappings for hover gradients
  const gradientMap: Record<string, string> = {
    'text-orange-400': 'from-orange-500/20 to-amber-500/20',
    'text-amber-400': 'from-amber-500/20 to-yellow-500/20',
    'text-purple-400': 'from-purple-500/20 to-pink-500/20',
    'text-blue-400': 'from-blue-500/20 to-cyan-500/20',
    'text-emerald-400': 'from-emerald-500/20 to-green-500/20',
    'text-pink-400': 'from-pink-500/20 to-rose-500/20',
  };
  
  const borderColorMap: Record<string, string> = {
    'text-orange-400': 'border-orange-500/30 hover:border-orange-400/50',
    'text-amber-400': 'border-amber-500/30 hover:border-amber-400/50',
    'text-purple-400': 'border-purple-500/30 hover:border-purple-400/50',
    'text-blue-400': 'border-blue-500/30 hover:border-blue-400/50',
    'text-emerald-400': 'border-emerald-500/30 hover:border-emerald-400/50',
    'text-pink-400': 'border-pink-500/30 hover:border-pink-400/50',
  };
  
  const iconBgMap: Record<string, string> = {
    'text-orange-400': 'bg-orange-500/20',
    'text-amber-400': 'bg-amber-500/20',
    'text-purple-400': 'bg-purple-500/20',
    'text-blue-400': 'bg-blue-500/20',
    'text-emerald-400': 'bg-emerald-500/20',
    'text-pink-400': 'bg-pink-500/20',
  };

  return (
    <section>
      <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Meniu rapid</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {mainNavTiles.map((tile) => {
          const needsAttention = tile.badgeKey && badges[tile.badgeKey];
          const isComenziCard = tile.href === '/dashboard/curier/comenzi';
          const hasNewOrders = isComenziCard && newOrdersCount > 0;
          const gradient = gradientMap[tile.color] || 'from-slate-500/20 to-slate-500/20';
          const borderColor = borderColorMap[tile.color] || 'border-white/10 hover:border-white/20';
          const iconBg = iconBgMap[tile.color] || 'bg-slate-500/20';
          
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className={`group relative bg-linear-to-br from-slate-800/90 via-slate-850/85 to-slate-900/90 backdrop-blur-xl rounded-xl border ${borderColor} p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 active:scale-95`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`}></div>
              
              {/* New Orders Badge - only for Comenzi card */}
              {hasNewOrders && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 sm:h-6 sm:w-6 bg-orange-500 items-center justify-center border-2 border-slate-900">
                    <span className="text-[10px] sm:text-xs font-bold text-white">{newOrdersCount}</span>
                  </span>
                </span>
              )}
              
              {/* Setup Badge indicator - for other cards */}
              {!isComenziCard && needsAttention && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-5 sm:w-5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-5 sm:w-5 bg-orange-500 items-center justify-center">
                    <span className="text-[7px] sm:text-[10px] font-bold text-white">!</span>
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

// Orders Summary Component - Replaces Quick Actions
function OrdersSummary() {
  return (
    <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-3.5 sm:p-6 border border-white/5 h-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/20 rounded-lg">
            <BoxIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
          </div>
          Sumar comenzi
        </h3>
        <Link href="/dashboard/curier/comenzi" className="text-[11px] sm:text-sm text-orange-400 hover:text-orange-300 transition-colors">
          Vezi toate →
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center p-2 sm:p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
          <p className="text-base sm:text-2xl font-bold text-orange-400">0</p>
          <p className="text-[9px] sm:text-xs text-gray-400">Noi</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-base sm:text-2xl font-bold text-blue-400">0</p>
          <p className="text-[9px] sm:text-xs text-gray-400">În tranzit</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <p className="text-base sm:text-2xl font-bold text-emerald-400">0</p>
          <p className="text-[9px] sm:text-xs text-gray-400">Livrate</p>
        </div>
      </div>
      
      <Link 
        href="/dashboard/curier/comenzi"
        className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm"
      >
        <BoxIcon className="w-4 h-4" />
        Vezi comenzile
      </Link>
    </section>
  );
}

// Recent Activity Component - Improved
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
export default function CurierDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [hasNoServices, setHasNoServices] = useState(false);
  const [hasNoProfile, setHasNoProfile] = useState(false);
  const [userNume, setUserNume] = useState<string | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Check if user has selected services and get user name from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // First, try to get name from profil_curier collection
        const profilRef = doc(db, 'profil_curier', user.uid);
        const profilSnap = await getDoc(profilRef);
        
        if (profilSnap.exists()) {
          const profilData = profilSnap.data();
          if (profilData.nume) {
            setUserNume(profilData.nume);
          }
          // Check if profile is complete (has name and phone at minimum)
          setHasNoProfile(!profilData.nume || !profilData.telefon);
        } else {
          setHasNoProfile(true);
        }
        
        // Check services from users collection
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const services = userData.serviciiOferite;
          setHasNoServices(!services || !Array.isArray(services) || services.length === 0);
          
          // Fallback: if no name from profil_curier, try users collection
          if (!userNume && userData.nume) {
            setUserNume(userData.nume);
          }
        } else {
          setHasNoServices(true);
        }

      } catch (error) {
        logError(error, 'Error fetching curier user data');
      }
    };

    if (user) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch new orders count
  useEffect(() => {
    const fetchNewOrdersCount = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'comenzi'),
          where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);
        setNewOrdersCount(snapshot.size);
      } catch (error) {
        logError(error, 'Error loading new orders count for courier');
      }
    };

    if (user) {
      fetchNewOrdersCount();
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

  // Extract first name: prioritize Firestore 'nume', then displayName, then email prefix
  const getFirstName = () => {
    // First check Firestore 'nume' field (from profile)
    if (userNume) {
      const firstName = userNume.split(' ')[0];
      return firstName || 'Curier';
    }
    // Then check Firebase Auth displayName
    if (user.displayName) {
      const firstName = user.displayName.split(' ')[0];
      return firstName || 'Curier';
    }
    // Fallback to email prefix or 'Curier'
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Curier';
  };
  const userName = getFirstName();

  // Calculate setup progress based on actual completion state (only 2 active steps: Profile & Services)
  const completedStepsCount = [!hasNoProfile, !hasNoServices].filter(Boolean).length;
  const setupComplete = completedStepsCount === 2;

  // Badges for quick menu (only active features)
  const menuBadges = {
    services: hasNoServices,
    profile: hasNoProfile,
  };

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
        <WelcomeSection userName={userName} hasNewOrders={false} />

        {/* Setup Progress - Only 2 steps: Profile and Services (Zones/Calendar disabled) */}
        <SetupProgress setupComplete={setupComplete} completedSteps={completedStepsCount} totalSteps={2} />

        {/* Main Navigation - Quick access to all sections */}
        <MainNavigation badges={menuBadges} newOrdersCount={newOrdersCount} />

        {/* Stats and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-6">
          {/* Orders Summary - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <OrdersSummary />
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
