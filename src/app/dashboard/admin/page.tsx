'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Order } from '@/types';
import { showSuccess, showError, showWarning } from '@/lib/toast';
import { showConfirm } from '@/components/ui/ConfirmModal';
import {
  UsersIcon,
  TruckIcon,
  PackageIcon,
  ChartIcon,
  CogIcon,
  BellIcon,
  SearchIcon,
  RefreshIcon,
  TrashIcon,
  EyeIcon,
  BanIcon,
  UserIcon,
} from '@/components/icons/DashboardIcons';

// ============================================
// TYPES & INTERFACES
// ============================================
interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color: string;
  bgColor: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bună dimineața';
  if (hour < 18) return 'Bună ziua';
  return 'Bună seara';
}

function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Header Component
function AdminHeader({ userName, onLogout, onRefresh }: { 
  userName: string;
  onLogout: () => void;
  onRefresh: () => void;
}) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">Curierul Perfect</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Reîncarcă datele"
            >
              <RefreshIcon className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <BellIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-medium text-white flex items-center justify-center">
                5
              </span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-orange-500/25">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-red-400">Administrator</p>
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
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {greeting}, <span className="text-red-400">{userName}</span>! 🛡️
            </h1>
            <p className="text-gray-400">
              Panoul de administrare al platformei Curierul Perfect.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium border border-orange-500/30">
              ● Administrator
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Grid Component
function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
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
            {stat.trend && (
              <span className={`text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

// Tab Navigation Component
function TabNavigation({ tabs, activeTab, onTabChange }: {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 bg-slate-800/30 p-2 rounded-xl border border-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span className="hidden sm:inline">{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-red-500/20 text-red-400'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Search Bar Component
function SearchBar({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
      />
    </div>
  );
}

// Users Table Component
function UsersTable({ users, onRoleChange, onDelete, filter }: {
  users: User[];
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string) => void;
  filter: 'all' | 'client' | 'curier';
}) {
  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  // Helper to get display name (nume + prenume)
  const getDisplayName = (user: User) => {
    // If both nume and prenume exist, combine them
    if (user.nume && user.prenume) {
      return `${user.nume} ${user.prenume}`;
    }
    // If only nume exists
    if (user.nume) return user.nume;
    // If only prenume exists
    if (user.prenume) return user.prenume;
    // Fallback to displayName
    if (user.displayName) return user.displayName;
    // Last resort: extract from email
    if (user.email) return user.email.split('@')[0];
    return 'Utilizator';
  };

  // Helper to format phone
  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    return phone;
  };

  // Helper to format date more robustly
  const formatUserDate = (createdAt: Date | string | { seconds: number } | undefined) => {
    if (!createdAt) return null;
    try {
      let date: Date;
      if (typeof createdAt === 'object' && 'seconds' in createdAt) {
        date = new Date(createdAt.seconds * 1000);
      } else if (typeof createdAt === 'string') {
        date = new Date(createdAt);
      } else {
        date = createdAt as Date;
      }
      return date.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Utilizator</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rol</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Data înregistrării</th>
            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const displayName = getDisplayName(u);
            const phone = formatPhone(u.telefon);
            const regDate = formatUserDate(u.createdAt);
            
            return (
              <tr key={u.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg ${
                      u.role === 'admin' ? 'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/25' :
                      u.role === 'curier' ? 'bg-linear-to-br from-orange-400 to-orange-600 shadow-orange-500/25' :
                      'bg-linear-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25'
                    }`}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{displayName}</p>
                      {phone ? (
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {phone}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm italic">Telefon nesetat</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{u.email}</span>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => onRoleChange(u.uid, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-all ${
                      u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      u.role === 'curier' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <option value="client">Client</option>
                    <option value="curier">Curier</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  {regDate ? (
                    <span className="text-gray-400 text-sm">{regDate}</span>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Necunoscut</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Vezi detalii"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(u.uid)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Șterge utilizator"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nu există utilizatori în această categorie.
        </div>
      )}
    </div>
  );
}

// Orders Table Component
function OrdersTable({ orders, onStatusChange, onViewDetails }: {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
  onViewDetails: (order: Order) => void;
}) {
  const statusColors: Record<string, string> = {
    noua: 'bg-blue-500/20 text-blue-400',
    in_lucru: 'bg-amber-500/20 text-amber-400',
    acceptata: 'bg-cyan-500/20 text-cyan-400',
    in_tranzit: 'bg-purple-500/20 text-purple-400',
    livrata: 'bg-emerald-500/20 text-emerald-400',
    anulata: 'bg-red-500/20 text-red-400',
  };

  const statusLabels: Record<string, string> = {
    noua: 'Nouă',
    in_lucru: 'În Lucru',
    acceptata: 'Acceptată',
    in_tranzit: 'În tranzit',
    livrata: 'Livrată',
    anulata: 'Anulată',
  };

  // Service icons and colors
  const serviceConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
    colete: { icon: '📦', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    plicuri: { icon: '✉️', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    persoane: { icon: '👥', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    animale: { icon: '🐾', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
    masini: { icon: '🚗', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    platforma: { icon: '🚛', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    paleti: { icon: '📋', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
    electronice: { icon: '📺', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
    tractari: { icon: '🔧', color: 'text-red-400', bgColor: 'bg-red-500/20' },
    mutari: { icon: '🏠', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  };

  const formatOrderNumber = (orderNumber?: number) => {
    return orderNumber ? `CP${orderNumber}` : '-';
  };

  const getServiceConfig = (serviciu?: string) => {
    const key = serviciu?.toLowerCase() || '';
    return serviceConfig[key] || { icon: '📦', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
  };

  // Helper to get client display name
  const getClientName = (order: Order) => {
    if (order.nume) return order.nume;
    if (order.email) return order.email.split('@')[0];
    return 'Client necunoscut';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Comandă</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Client</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Serviciu</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rută</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Data ridicare</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const serviceConf = getServiceConfig(order.serviciu);
            const clientName = getClientName(order);
            
            return (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                      <span className="text-orange-400 text-xs font-bold">#</span>
                    </div>
                    <span className="text-white font-mono font-semibold">
                      {formatOrderNumber(order.orderNumber)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-semibold text-sm">
                      {clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{clientName}</p>
                      <p className="text-gray-500 text-xs">{order.email || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${serviceConf.bgColor} flex items-center justify-center text-sm`}>
                      {serviceConf.icon}
                    </span>
                    <span className={`capitalize font-medium ${serviceConf.color}`}>
                      {order.serviciu || '-'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-slate-700/50 text-white text-sm font-medium">
                      {order.tara_ridicare || '??'}
                    </span>
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="px-2 py-1 rounded bg-slate-700/50 text-white text-sm font-medium">
                      {order.tara_livrare || '??'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {order.data_ridicare ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300 text-sm">
                        {new Date(order.data_ridicare).toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Nesetat</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <select
                    value={order.status || 'noua'}
                    onChange={(e) => onStatusChange(order.id!, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-all ${statusColors[order.status || 'noua'] || 'bg-gray-500/20 text-gray-400'}`}
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="noua" className="bg-slate-800 text-white">{statusLabels.noua}</option>
                    <option value="in_lucru" className="bg-slate-800 text-white">{statusLabels.in_lucru}</option>
                    <option value="acceptata" className="bg-slate-800 text-white">{statusLabels.acceptata}</option>
                    <option value="in_tranzit" className="bg-slate-800 text-white">{statusLabels.in_tranzit}</option>
                    <option value="livrata" className="bg-slate-800 text-white">{statusLabels.livrata}</option>
                    <option value="anulata" className="bg-slate-800 text-white">{statusLabels.anulata}</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewDetails(order)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Vezi detalii"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nu există comenzi.
        </div>
      )}
    </div>
  );
}

// Couriers Grid Component
function CouriersGrid({ couriers, onSuspend }: {
  couriers: User[];
  onSuspend: (uid: string) => void;
}) {
  // Helper to get courier display name
  const getCourierName = (courier: User) => {
    if (courier.nume && courier.prenume) return `${courier.nume} ${courier.prenume}`;
    if (courier.nume) return courier.nume;
    if (courier.prenume) return courier.prenume;
    if (courier.displayName) return courier.displayName;
    if (courier.email) return courier.email.split('@')[0];
    return 'Curier';
  };

  // Helper to get services list
  const getServices = (courier: User) => {
    const courierData = courier as unknown as Record<string, unknown>;
    if (courierData.serviciiOferite && Array.isArray(courierData.serviciiOferite)) {
      return courierData.serviciiOferite as string[];
    }
    return [];
  };

  // Service emoji map
  const serviceEmojis: Record<string, string> = {
    colete: '📦',
    plicuri: '✉️',
    persoane: '👥',
    animale: '🐾',
    masini: '🚗',
    platforma: '🚛',
    paleti: '📋',
    electronice: '📺',
    tractari: '🔧',
    mutari: '🏠',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {couriers.map((courier) => {
        const courierName = getCourierName(courier);
        const services = getServices(courier);
        const courierData = courier as unknown as Record<string, unknown>;
        const rating = courierData.rating as number | undefined;
        const reviewCount = courierData.reviewCount as number | undefined;
        
        return (
          <div key={courier.uid} className="bg-linear-to-br from-slate-800/80 to-slate-800/40 rounded-xl p-5 border border-white/5 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/10 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  {courierName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{courierName}</p>
                  <p className="text-gray-500 text-xs">{courier.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Activ
              </span>
            </div>

            {/* Rating */}
            {rating !== undefined && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-yellow-400 font-semibold text-sm">{rating.toFixed(1)}</span>
                {reviewCount !== undefined && (
                  <span className="text-gray-500 text-xs">({reviewCount} recenzii)</span>
                )}
              </div>
            )}
            
            {/* Info Grid */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm p-2 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Telefon
                </span>
                {courier.telefon ? (
                  <span className="text-white font-medium">{courier.telefon}</span>
                ) : (
                  <span className="text-gray-500 italic text-xs">Nesetat</span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm p-2 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <TruckIcon className="w-4 h-4" />
                  Servicii
                </span>
                <span className="text-orange-400 font-bold">{services.length}</span>
              </div>
            </div>

            {/* Services Tags */}
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {services.slice(0, 5).map((service, idx) => {
                  const serviceKey = service.toLowerCase();
                  const emoji = serviceEmojis[serviceKey] || '📦';
                  return (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-slate-700/50 text-gray-300 rounded-md text-xs flex items-center gap-1"
                    >
                      <span>{emoji}</span>
                      <span className="capitalize">{service}</span>
                    </span>
                  );
                })}
                {services.length > 5 && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs font-medium">
                    +{services.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 border border-blue-500/20">
                <EyeIcon className="w-4 h-4" />
                Vezi Profil
              </button>
              <button 
                onClick={() => onSuspend(courier.uid)}
                className="px-3 py-2.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all border border-red-500/20"
                title="Suspendă curier"
              >
                <BanIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
      {couriers.length === 0 && (
        <div className="col-span-full text-center py-12">
          <TruckIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">Nu există curieri înregistrați.</p>
        </div>
      )}
    </div>
  );
}

// Stats Tab Content
function StatsContent({ users, orders }: { users: User[]; orders: Order[] }) {
  const clientsCount = users.filter(u => u.role === 'client').length;
  const couriersCount = users.filter(u => u.role === 'curier').length;
  const deliveredOrders = orders.filter(o => o.status === 'livrata').length;
  const pendingOrders = orders.filter(o => o.status === 'noua').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_lucru').length;
  const cancelledOrders = orders.filter(o => o.status === 'anulata').length;
  
  // Calculate order distribution by service type
  const serviceDistribution = orders.reduce((acc, order) => {
    const service = order.serviciu?.toLowerCase() || 'altele';
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate orders by country
  const countryDistribution = orders.reduce((acc, order) => {
    const country = order.tara_ridicare || 'Necunoscut';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top 5 countries
  const topCountries = Object.entries(countryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent 7 days orders
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentOrders = orders.filter(o => (o.timestamp || 0) > sevenDaysAgo).length;
  
  // Average orders per day (last 30 days)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const last30DaysOrders = orders.filter(o => (o.timestamp || 0) > thirtyDaysAgo).length;
  const avgOrdersPerDay = (last30DaysOrders / 30).toFixed(1);

  // Service type colors
  const serviceColors: Record<string, string> = {
    colete: 'bg-orange-500',
    paleti: 'bg-blue-500',
    persoane: 'bg-purple-500',
    masini: 'bg-emerald-500',
    animale: 'bg-pink-500',
    altele: 'bg-gray-500',
  };

  // Status distribution for chart
  const statusData = [
    { label: 'Noi', count: pendingOrders, color: 'bg-white/20', textColor: 'text-white' },
    { label: 'În Lucru', count: inProgressOrders, color: 'bg-amber-500', textColor: 'text-amber-400' },
    { label: 'Livrate', count: deliveredOrders, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
    { label: 'Anulate', count: cancelledOrders, color: 'bg-red-500', textColor: 'text-red-400' },
  ];

  const totalStatusOrders = statusData.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-linear-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <UsersIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-gray-400 text-xs">Clienți</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{clientsCount}</div>
        </div>
        <div className="bg-linear-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <TruckIcon className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-gray-400 text-xs">Curieri</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{couriersCount}</div>
        </div>
        <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <PackageIcon className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-gray-400 text-xs">Total Comenzi</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{orders.length}</div>
        </div>
        <div className="bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ChartIcon className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-gray-400 text-xs">Ultimele 7 zile</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{recentOrders}</div>
        </div>
        <div className="bg-linear-to-br from-pink-500/20 to-pink-600/10 rounded-xl p-4 border border-pink-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <ChartIcon className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-gray-400 text-xs">Media/zi (30d)</span>
          </div>
          <div className="text-2xl font-bold text-pink-400">{avgOrdersPerDay}</div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-orange-400" />
            Distribuție Status Comenzi
          </h4>
          
          {/* Visual bar chart */}
          <div className="space-y-3 mb-4">
            {statusData.map((status) => (
              <div key={status.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={status.textColor}>{status.label}</span>
                  <span className="text-gray-400">{status.count} ({totalStatusOrders > 0 ? Math.round((status.count / totalStatusOrders) * 100) : 0}%)</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${status.color} rounded-full transition-all duration-500`}
                    style={{ width: `${totalStatusOrders > 0 ? (status.count / totalStatusOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Success Rate */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Rată succes</span>
              <span className="text-emerald-400 font-bold text-lg">
                {orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Service Type Distribution */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-blue-400" />
            Comenzi pe Tip Serviciu
          </h4>
          
          <div className="space-y-3">
            {Object.entries(serviceDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => (
                <div key={service} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${serviceColors[service] || 'bg-gray-500'}`} />
                  <span className="text-gray-300 capitalize flex-1">{service}</span>
                  <span className="text-white font-medium">{count}</span>
                  <span className="text-gray-500 text-sm w-12 text-right">
                    {orders.length > 0 ? Math.round((count / orders.length) * 100) : 0}%
                  </span>
                </div>
              ))}
          </div>

          {Object.keys(serviceDistribution).length === 0 && (
            <p className="text-gray-500 text-center py-4">Nu există date</p>
          )}
        </div>

        {/* Top Countries */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Top 5 Țări (Ridicare)
          </h4>
          
          <div className="space-y-3">
            {topCountries.map(([country, count], idx) => (
              <div key={country} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                  idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                  'bg-slate-600/20 text-gray-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-gray-300 flex-1">{country}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>

          {topCountries.length === 0 && (
            <p className="text-gray-500 text-center py-4">Nu există date</p>
          )}
        </div>

        {/* Platform Health */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sănătate Platformă
          </h4>
          
          <div className="space-y-4">
            {/* User Activity */}
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Utilizatori Activi</p>
                  <p className="text-gray-400 text-xs">Total înregistrați</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-xl">{users.length}</span>
            </div>

            {/* Courier Ratio */}
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Raport Curier/Client</p>
                  <p className="text-gray-400 text-xs">Curieri per 10 clienți</p>
                </div>
              </div>
              <span className="text-orange-400 font-bold text-xl">
                {clientsCount > 0 ? ((couriersCount / clientsCount) * 10).toFixed(1) : '0'}
              </span>
            </div>

            {/* Order Completion */}
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <PackageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Comenzi Finalizate</p>
                  <p className="text-gray-400 text-xs">Livrate cu succes</p>
                </div>
              </div>
              <span className="text-blue-400 font-bold text-xl">{deliveredOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline - Recent Orders */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activitate Recentă (Ultimele 5 comenzi)
        </h4>
        
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, idx) => (
            <div key={order.id || idx} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                order.status === 'livrata' ? 'bg-emerald-500' :
                order.status === 'anulata' ? 'bg-red-500' :
                order.status === 'in_lucru' ? 'bg-amber-500' :
                'bg-white/50'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {order.orderNumber ? `CP${order.orderNumber}` : 'Fără număr'}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-sm capitalize">{order.serviciu || '-'}</span>
                </div>
                <p className="text-gray-500 text-xs truncate">
                  {order.tara_ridicare} → {order.tara_livrare}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                order.status === 'livrata' ? 'bg-emerald-500/20 text-emerald-400' :
                order.status === 'anulata' ? 'bg-red-500/20 text-red-400' :
                order.status === 'in_lucru' ? 'bg-amber-500/20 text-amber-400' :
                'bg-white/10 text-gray-300'
              }`}>
                {order.status === 'livrata' ? 'Livrată' :
                 order.status === 'anulata' ? 'Anulată' :
                 order.status === 'in_lucru' ? 'În Lucru' :
                 order.status === 'noua' ? 'Nouă' :
                 order.status || 'Nouă'}
              </span>
            </div>
          ))}
          
          {orders.length === 0 && (
            <p className="text-gray-500 text-center py-4">Nu există comenzi recente</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Settings Tab Content
function SettingsContent() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    maintenanceMode: false,
    newRegistrations: true,
    courierAutoApproval: false,
    orderNotifications: true,
    weeklyReports: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showSuccess('Setare actualizată!');
  };

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BellIcon className="w-5 h-5 text-blue-400" />
          Notificări
        </h3>
        
        <div className="space-y-3">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Notificări Email</h4>
                  <p className="text-gray-400 text-sm">Primește email pentru evenimente importante</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.emailNotifications}
                  onChange={() => toggleSetting('emailNotifications')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <PackageIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Notificări Comenzi Noi</h4>
                  <p className="text-gray-400 text-sm">Alertă la fiecare comandă nouă</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.orderNotifications}
                  onChange={() => toggleSetting('orderNotifications')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <ChartIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Rapoarte Săptămânale</h4>
                  <p className="text-gray-400 text-sm">Primește sumar săptămânal pe email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.weeklyReports}
                  onChange={() => toggleSetting('weeklyReports')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CogIcon className="w-5 h-5 text-orange-400" />
          Setări Platformă
        </h3>
        
        <div className="space-y-3">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Mod Întreținere</h4>
                  <p className="text-gray-400 text-sm">Dezactivează platforma pentru utilizatori</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.maintenanceMode}
                  onChange={() => toggleSetting('maintenanceMode')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Înregistrări Noi</h4>
                  <p className="text-gray-400 text-sm">Permite utilizatori noi să se înregistreze</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.newRegistrations}
                  onChange={() => toggleSetting('newRegistrations')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Aprobare Automată Curieri</h4>
                  <p className="text-gray-400 text-sm">Curieri noi devin activi instant</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.courierAutoApproval}
                  onChange={() => toggleSetting('courierAutoApproval')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Acțiuni Rapide
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all group text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Export Date</h4>
            <p className="text-gray-400 text-xs">Descarcă raport CSV</p>
          </button>

          <button className="p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all group text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Backup Date</h4>
            <p className="text-gray-400 text-xs">Salvare backup Firestore</p>
          </button>

          <button className="p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/10 transition-all group text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Curăță Cache</h4>
            <p className="text-gray-400 text-xs">Resetare date temporare</p>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/20 rounded-xl p-5 bg-red-500/5">
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Zona Periculoasă
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Șterge Comenzi Vechi</h4>
              <p className="text-gray-400 text-xs">Elimină comenzile mai vechi de 1 an</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all">
              Șterge
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Reset Statistici</h4>
              <p className="text-gray-400 text-xs">Resetează contoarele platformei</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Detalii Comandă {order.orderNumber ? `CP${order.orderNumber}` : ''}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-emerald-400 font-semibold mb-3">Informații Client</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Nume:</span>
                <p className="text-white font-medium">{order.nume || '-'}</p>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white">{order.email || '-'}</p>
              </div>
              <div>
                <span className="text-gray-400">Telefon:</span>
                <p className="text-white">{order.telefon || '-'}</p>
              </div>
              <div>
                <span className="text-gray-400">Serviciu:</span>
                <p className="text-white capitalize">{order.serviciu || '-'}</p>
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-3">Adresa Ridicare</h4>
            <div className="space-y-2 text-sm">
              <p className="text-white">{order.adresa_ridicare || '-'}</p>
              <p className="text-gray-400">
                {order.oras_ridicare}, {order.judet_ridicare}, {order.tara_ridicare}
              </p>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-orange-400 font-semibold mb-3">Adresa Livrare</h4>
            <div className="space-y-2 text-sm">
              <p className="text-white">{order.adresa_livrare || '-'}</p>
              <p className="text-gray-400">
                {order.oras_livrare}, {order.judet_livrare}, {order.tara_livrare}
              </p>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-purple-400 font-semibold mb-3">Detalii Colet</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {order.greutate && (
                <div>
                  <span className="text-gray-400">Greutate:</span>
                  <p className="text-white">{order.greutate}</p>
                </div>
              )}
              {order.cantitate && (
                <div>
                  <span className="text-gray-400">Cantitate:</span>
                  <p className="text-white">{order.cantitate}</p>
                </div>
              )}
              {order.lungime && (
                <div>
                  <span className="text-gray-400">Dimensiuni (L×W×H):</span>
                  <p className="text-white">{order.lungime} × {order.latime} × {order.inaltime}</p>
                </div>
              )}
            </div>
            {order.descriere && (
              <div className="mt-3">
                <span className="text-gray-400">Descriere:</span>
                <p className="text-white mt-1">{order.descriere}</p>
              </div>
            )}
          </div>

          {/* Options */}
          {order.optiuni && order.optiuni.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-4">
              <h4 className="text-pink-400 font-semibold mb-3">Opțiuni Suplimentare</h4>
              <div className="flex flex-wrap gap-2">
                {order.optiuni.map((opt, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm capitalize">
                    {opt.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'client' | 'curier'>('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth guard
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, loading, router]);

  // Load data function
  const loadData = async () => {
    setLoadingData(true);
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      usersSnapshot.forEach((doc) => {
        usersData.push({ uid: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData);

      // Load orders
      const ordersSnapshot = await getDocs(
        query(collection(db, 'comenzi'), orderBy('timestamp', 'desc'))
      );
      const ordersData: Order[] = [];
      ordersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        console.log('🔍 Order', doc.id, 'has status:', orderData.status, '| Full data:', orderData);
        ordersData.push({ id: doc.id, ...orderData } as Order);
      });
      console.log(`📊 Total orders loaded: ${ordersData.length} | Orders with status: ${ordersData.filter(o => o.status).length} | Orders WITHOUT status: ${ordersData.filter(o => !o.status).length}`);
      setOrders(ordersData);
      
      // Only show success message if not initial load
      if (!isInitialLoad) {
        showSuccess('Date încărcate cu succes!');
      }
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Eroare la încărcarea datelor.');
    } finally {
      setLoadingData(false);
    }
  };

  // Auto-load data when component mounts
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { 
        role: newRole,
        updatedAt: serverTimestamp()
      });
      showSuccess(`Rol actualizat cu succes la ${newRole}!`);
      loadData();
    } catch (error) {
      console.error('Error updating role:', error);
      showError('Eroare la actualizarea rolului.');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === user?.uid) {
      showWarning('Nu poți șterge propriul cont!');
      return;
    }
    const confirmed = await showConfirm({
      title: 'Șterge utilizator',
      message: 'Ești sigur că vrei să ștergi acest utilizator? Această acțiune este permanentă și nu poate fi anulată.',
      confirmText: 'Șterge',
      cancelText: 'Anulează',
      variant: 'danger'
    });
    if (!confirmed) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', uid));
      showSuccess('Utilizator șters cu succes!');
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Eroare la ștergerea utilizatorului.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'comenzi', orderId), { 
        status: newStatus,
        statusUpdatedAt: serverTimestamp()
      });
      showSuccess(`Status actualizat la ${newStatus}!`);
      loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Eroare la actualizarea statusului comenzii.');
    }
  };

  const handleSuspendCourier = async (uid: string) => {
    const confirmed = await showConfirm({
      title: 'Suspendă curier',
      message: 'Ești sigur că vrei să suspendi acest curier? Acesta va fi retrogradat la rol de client.',
      confirmText: 'Suspendă',
      cancelText: 'Anulează',
      variant: 'warning'
    });
    if (!confirmed) {
      return;
    }
    try {
      await updateDoc(doc(db, 'users', uid), { 
        role: 'client',
        suspendedAt: serverTimestamp()
      });
      showSuccess('Curier suspendat cu succes!');
      loadData();
    } catch (error) {
      console.error('Error suspending courier:', error);
      showError('Eroare la suspendarea curierului.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Calculate stats
  const clientsCount = users.filter(u => u.role === 'client').length;
  const couriersCount = users.filter(u => u.role === 'curier').length;
  const pendingOrders = orders.filter(o => o.status === 'noua').length;

  const stats: StatItem[] = [
    { icon: UsersIcon, label: 'Total utilizatori', value: users.length, trend: '+5 săptămâna aceasta', trendUp: true, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { icon: UserIcon, label: 'Clienți', value: clientsCount, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    { icon: TruckIcon, label: 'Curieri', value: couriersCount, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    { icon: PackageIcon, label: 'Comenzi noi', value: pendingOrders, trend: 'În așteptare', trendUp: false, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  ];

  const tabs: TabItem[] = [
    { id: 'users', label: 'Utilizatori', icon: UsersIcon, badge: users.length },
    { id: 'orders', label: 'Comenzi', icon: PackageIcon, badge: pendingOrders },
    { id: 'couriers', label: 'Curieri', icon: TruckIcon, badge: couriersCount },
    { id: 'stats', label: 'Statistici', icon: ChartIcon },
    { id: 'settings', label: 'Setări', icon: CogIcon },
  ];

  // Filter users by search
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.nume?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading State
  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  // Extract first name from displayName, fallback to email prefix or 'Admin'
  const getFirstName = () => {
    if (user.displayName) {
      const firstName = user.displayName.split(' ')[0];
      return firstName || 'Admin';
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Admin';
  };
  const userName = getFirstName();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Order Details Modal */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {/* Header */}
      <AdminHeader 
        userName={userName}
        onLogout={handleLogout}
        onRefresh={loadData}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Toți ({users.length})
                  </button>
                  <button
                    onClick={() => setUserFilter('client')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'client' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Clienți ({clientsCount})
                  </button>
                  <button
                    onClick={() => setUserFilter('curier')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'curier' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Curieri ({couriersCount})
                  </button>
                </div>
                <div className="w-full sm:w-64">
                  <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Caută utilizator..."
                  />
                </div>
              </div>
              <UsersTable 
                users={filteredUsers}
                onRoleChange={handleRoleChange}
                onDelete={handleDeleteUser}
                filter={userFilter}
              />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <OrdersTable 
              orders={orders} 
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrder}
            />
          )}

          {/* Couriers Tab */}
          {activeTab === 'couriers' && (
            <CouriersGrid 
              couriers={users.filter(u => u.role === 'curier')}
              onSuspend={handleSuspendCourier}
            />
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <StatsContent users={users} orders={orders} />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsContent />}
        </div>
      </main>
    </div>
  );
}
