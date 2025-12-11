'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  MapIcon,
  CalendarIcon,
  CurrencyIcon,
  UserIcon,
  ChatIcon,
  BoxIcon,
  CreditCardIcon,
  CheckCircleIcon,
  BellIcon,
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

const getSetupSteps = (profileComplete: boolean, zonesComplete: boolean, servicesComplete: boolean, calendarComplete: boolean): SetupStep[] => [
  { id: 'profile', title: 'Completează profilul', description: 'Adaugă informațiile tale', href: '/dashboard/curier/profil', icon: UserIcon, completed: profileComplete },
  { id: 'zones', title: 'Setează zonele', description: 'Unde livrezi?', href: '/dashboard/curier/zona-acoperire', icon: MapIcon, completed: zonesComplete },
  { id: 'services', title: 'Adaugă servicii', description: 'Ce oferi clienților?', href: '/dashboard/curier/tarife', icon: CurrencyIcon, completed: servicesComplete },
  { id: 'calendar', title: 'Configurează calendarul', description: 'Când ești disponibil?', href: '/dashboard/curier/calendar', icon: CalendarIcon, completed: calendarComplete },
];

const recentActivities: ActivityItem[] = [
  { type: 'order', message: 'Comandă nouă #1234 primită', time: 'Acum 5 min', color: 'bg-orange-500' },
  { type: 'delivery', message: 'Comandă #1231 livrată cu succes', time: 'Acum 1 oră', color: 'bg-emerald-500' },
  { type: 'payment', message: 'Plată de 150€ confirmată', time: 'Acum 3 ore', color: 'bg-blue-500' },
  { type: 'message', message: 'Mesaj nou de la client', time: 'Ieri', color: 'bg-pink-500' },
];

// Navigation tiles for main menu
interface NavTile {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const mainNavTiles: NavTile[] = [
  {
    href: '/dashboard/curier/comenzi',
    icon: BoxIcon,
    title: 'Comenzi',
    description: '12 comenzi noi',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
  },
  {
    href: '/dashboard/curier/plati',
    icon: CreditCardIcon,
    title: 'Plăți',
    description: '4,250 € luna aceasta',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  {
    href: '/dashboard/curier/calendar',
    icon: CalendarIcon,
    title: 'Calendar',
    description: 'Program de lucru',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    href: '/dashboard/curier/zona-acoperire',
    icon: MapIcon,
    title: 'Zone',
    description: 'Zonele tale de livrare',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
    borderColor: 'border-purple-500/20 hover:border-purple-500/40',
  },
  {
    href: '/dashboard/curier/tarife',
    icon: CurrencyIcon,
    title: 'Tarife',
    description: 'Servicii și prețuri',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40',
  },
  {
    href: '/dashboard/curier/profil',
    icon: UserIcon,
    title: 'Profil',
    description: 'Setările contului',
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
function DashboardHeader({ userName, notificationCount, onLogout }: { 
  userName: string; 
  notificationCount: number;
  onLogout: () => void;
}) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <BellIcon className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs font-medium text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden shadow-lg shadow-orange-500/25">
                <Image src="/img/default-avatar.png" alt="Avatar" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-emerald-400">Curier verificat ✓</p>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Ieșire
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
    <section className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-white/10 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {greeting}, <span className="text-emerald-400 truncate">{userName}</span>!
            </h1>
            {hasNewOrders ? (
              <p className="text-orange-400 text-sm sm:text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Ai comenzi noi de procesat
              </p>
            ) : (
              <p className="text-gray-400 text-sm sm:text-base">Bine ai revenit în panoul tău</p>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium border border-emerald-500/30">
              ● Online
            </span>
            <span className="hidden sm:flex px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium border border-amber-500/30 items-center gap-1">
              ⭐ 4.9
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Setup Progress Component for new couriers
function SetupProgress({ setupComplete, completedSteps, totalSteps }: { setupComplete: boolean; completedSteps: number; totalSteps: number }) {
  if (setupComplete) return null;
  
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  const steps = getSetupSteps(completedSteps >= 1, completedSteps >= 2, completedSteps >= 3, completedSteps >= 4);
  
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
function MainNavigation() {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Meniu rapid</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {mainNavTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`group p-3 sm:p-4 rounded-xl border ${tile.bgColor} ${tile.borderColor} transition-all`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
              <tile.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tile.color}`} />
            </div>
            <h3 className="text-white font-medium text-xs sm:text-sm text-center truncate">{tile.title}</h3>
            <p className="text-gray-500 text-[10px] sm:text-xs text-center truncate hidden sm:block">{tile.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Orders Summary Component - Replaces Quick Actions
function OrdersSummary() {
  return (
    <section className="bg-slate-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/20 rounded-lg">
            <BoxIcon className="w-4 h-4 text-orange-400" />
          </div>
          Sumar comenzi
        </h3>
        <Link href="/dashboard/curier/comenzi" className="text-xs sm:text-sm text-orange-400 hover:text-orange-300 transition-colors">
          Vezi toate →
        </Link>
      </div>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
        <div className="text-center p-2 sm:p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <p className="text-lg sm:text-2xl font-bold text-orange-400">12</p>
          <p className="text-[10px] sm:text-xs text-gray-400">Noi</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-lg sm:text-2xl font-bold text-blue-400">8</p>
          <p className="text-[10px] sm:text-xs text-gray-400">În tranzit</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <p className="text-lg sm:text-2xl font-bold text-emerald-400">156</p>
          <p className="text-[10px] sm:text-xs text-gray-400">Livrate</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-lg sm:text-2xl font-bold text-green-400">4.2k €</p>
          <p className="text-[10px] sm:text-xs text-gray-400">Câștig</p>
        </div>
      </div>
      
      <Link 
        href="/dashboard/curier/comenzi"
        className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors text-sm"
      >
        <BoxIcon className="w-4 h-4" />
        Verifică comenzile noi
      </Link>
    </section>
  );
}

// Recent Activity Component - Improved
function RecentActivity() {
  return (
    <section className="bg-slate-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/20 rounded-lg">
            <BellIcon className="w-4 h-4 text-purple-400" />
          </div>
          Activitate recentă
        </h3>
      </div>
      <div className="space-y-2">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className={`w-2 h-2 rounded-full shrink-0 ${activity.color}`} />
            <span className="text-gray-300 text-xs sm:text-sm flex-1 truncate">{activity.message}</span>
            <span className="text-gray-500 text-[10px] sm:text-xs shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Help Card Component
function HelpCard() {
  return (
    <section className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-500/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
          <ChatIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-1">Ai nevoie de ajutor?</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3">Contactează echipa noastră de suport</p>
          <div className="flex flex-wrap gap-2">
            <a href="mailto:support@curierulperfect.ro" className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
              📧 Email
            </a>
            <a href="https://wa.me/40700000000" className="text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
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
  const [userNume, setUserNume] = useState<string | null>(null);

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
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
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
  const isNewUser = hasNoServices; // Use this to show setup progress

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <DashboardHeader 
        userName={userName} 
        notificationCount={3} 
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} hasNewOrders={true} />

        {/* Setup Progress - Only for new users */}
        <SetupProgress setupComplete={!isNewUser} completedSteps={isNewUser ? 1 : 4} totalSteps={4} />

        {/* Main Navigation - Quick access to all sections */}
        <MainNavigation />

        {/* Stats and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
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




