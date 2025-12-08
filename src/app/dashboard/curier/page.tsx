'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import {
  MapIcon,
  CalendarIcon,
  CurrencyIcon,
  UserIcon,
  ChatIcon,
  BoxIcon,
  CreditCardIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  MoneyIcon,
  BellIcon,
  ArrowRightIcon,
  LogoIcon,
} from '@/components/icons/DashboardIcons';

// ============================================
// TYPES & INTERFACES
// ============================================
interface DashboardCard {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: string;
  bgColor: string;
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  color: string;
}

// ============================================
// CONFIGURATION DATA
// ============================================
const configurationCards: DashboardCard[] = [
  {
    href: '/dashboard/curier/zona-acoperire',
    icon: MapIcon,
    title: 'Zonă acoperire',
    description: 'Configurează zonele de livrare',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    href: '/dashboard/curier/calendar',
    icon: CalendarIcon,
    title: 'Calendar colectare',
    description: 'Setează zilele de colectare',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    href: '/dashboard/curier/tarife',
    icon: CurrencyIcon,
    title: 'Tarife',
    description: 'Gestionează prețurile',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    href: '/dashboard/curier/profil',
    icon: UserIcon,
    title: 'Profil curier',
    description: 'Actualizează informațiile',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
  },
];

const operationsCards: DashboardCard[] = [
  {
    href: '/dashboard/curier/comenzi',
    icon: BoxIcon,
    title: 'Comenzile mele',
    description: 'Gestionează comenzile active',
    gradient: 'from-orange-500/10 to-red-500/10',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    badge: 'Nou',
    badgeColor: 'bg-orange-500',
  },
  {
    href: '/dashboard/curier/plati',
    icon: CreditCardIcon,
    title: 'Plăți & Facturi',
    description: 'Vizualizează încasările',
    gradient: 'from-green-500/10 to-emerald-500/10',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
  },
  {
    href: '/dashboard/curier/comunicare',
    icon: ChatIcon,
    title: 'Comunicare',
    description: 'Mesaje și notificări',
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
    badge: '3',
    badgeColor: 'bg-pink-500',
  },
];

const statsData: StatItem[] = [
  { icon: PackageIcon, label: 'Comenzi noi', value: '12', trend: '+3 azi', trendUp: true, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { icon: TruckIcon, label: 'În tranzit', value: '8', trend: 'Active', trendUp: true, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { icon: CheckCircleIcon, label: 'Livrate', value: '156', trend: 'Luna aceasta', trendUp: true, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { icon: MoneyIcon, label: 'Câștig', value: '4,250 €', trend: '+12%', trendUp: true, color: 'text-green-400', bgColor: 'bg-green-500/20' },
];

const recentActivities: ActivityItem[] = [
  { type: 'order', message: 'Comandă nouă #1234 primită', time: 'Acum 5 min', color: 'bg-orange-500' },
  { type: 'delivery', message: 'Comandă #1231 livrată cu succes', time: 'Acum 1 oră', color: 'bg-emerald-500' },
  { type: 'payment', message: 'Plată de 150€ confirmată', time: 'Acum 3 ore', color: 'bg-blue-500' },
  { type: 'message', message: 'Mesaj nou de la client', time: 'Ieri', color: 'bg-pink-500' },
];

const quickActions = [
  { label: 'Verifică comenzi noi', color: 'bg-orange-500 hover:bg-orange-600', href: '/dashboard/curier/comenzi', emoji: '📦' },
  { label: 'Actualizează calendar', color: 'bg-emerald-500 hover:bg-emerald-600', href: '/dashboard/curier/calendar', emoji: '📅' },
  { label: 'Modifică tarife', color: 'bg-purple-500 hover:bg-purple-600', href: '/dashboard/curier/tarife', emoji: '💰' },
  { label: 'Solicită retragere', color: 'bg-blue-500 hover:bg-blue-600', href: '/dashboard/curier/plati', emoji: '💳' },
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/img/bird-icon.png"
              alt="Curierul Perfect"
              width={40}
              height={32}
              className="h-8 w-auto transition-all duration-300 group-hover:scale-105"
            />
            <span className="text-lg font-bold hidden sm:block">
              <span className="text-orange-500">CurierulPerfect</span>
              <span className="text-emerald-500">.ro</span>
            </span>
          </Link>

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
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-emerald-500/25">
                {userName.charAt(0).toUpperCase()}
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

// Welcome Section Component
function WelcomeSection({ userName }: { userName: string }) {
  const greeting = getGreeting();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-white/10 p-6 sm:p-8">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {greeting}, <span className="text-emerald-400">{userName}</span>! 👋
            </h1>
            <p className="text-gray-400">
              Bine ai venit în panoul tău de curier. Ai comenzi noi de procesat.
            </p>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30">
              ● Online
            </span>
            <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30 flex items-center gap-1">
              ⭐ 4.9
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Grid Component
function StatsGrid() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-gray-400 text-sm">{stat.label}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <span className={`text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

// Dashboard Card Component
function DashboardCard({ card }: { card: DashboardCard }) {
  const IconComponent = card.icon;

  return (
    <Link
      href={card.href}
      className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${card.gradient} border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-slate-800/50 backdrop-blur-sm`}
    >
      {/* Badge */}
      {card.badge && (
        <span className={`absolute top-4 right-4 px-2 py-1 ${card.badgeColor} rounded-full text-xs font-medium text-white`}>
          {card.badge}
        </span>
      )}

      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <IconComponent className={`w-7 h-7 ${card.iconColor}`} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
        {card.title}
      </h3>
      <p className="text-gray-400 text-sm">{card.description}</p>

      {/* Arrow Indicator */}
      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
        <ArrowRightIcon className="w-4 h-4 text-white" />
      </div>
    </Link>
  );
}

// Cards Section Component
function CardsSection({ title, icon, cards }: { title: string; icon: ReactNode; cards: DashboardCard[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <DashboardCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
}

// Quick Actions Component
function QuickActions() {
  return (
    <section className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>⚡</span> Acțiuni rapide
      </h3>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 ${action.color} text-white text-sm font-medium rounded-xl transition-colors shadow-lg`}
          >
            <span>{action.emoji}</span>
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

// Recent Activity Component
function RecentActivity() {
  return (
    <section className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📋</span> Activitate recentă
        </h3>
        <Link href="/dashboard/curier/comenzi" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
          Vezi tot →
        </Link>
      </div>
      <div className="space-y-3">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className={`w-2 h-2 rounded-full ${activity.color}`} />
            <span className="text-gray-300 text-sm flex-1">{activity.message}</span>
            <span className="text-gray-500 text-xs">{activity.time}</span>
          </div>
        ))}
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading State
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName = user.displayName || user.email?.split('@')[0] || 'Curier';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <DashboardHeader 
        userName={userName} 
        notificationCount={3} 
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} />

        {/* Stats Grid */}
        <StatsGrid />

        {/* Configuration Cards */}
        <CardsSection title="Configurare cont" icon="⚙️" cards={configurationCards} />

        {/* Operations Cards */}
        <CardsSection title="Operațiuni" icon="📦" cards={operationsCards} />

        {/* Bottom Grid: Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
