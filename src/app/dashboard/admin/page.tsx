'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Order } from '@/types';
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
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
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
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-red-500/25">
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
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
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
            <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30">
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
              ? 'bg-linear-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25'
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
          {filteredUsers.map((u) => (
            <tr key={u.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                    u.role === 'admin' ? 'bg-linear-to-br from-red-400 to-red-600' :
                    u.role === 'curier' ? 'bg-linear-to-br from-orange-400 to-orange-600' :
                    'bg-linear-to-br from-emerald-400 to-emerald-600'
                  }`}>
                    {(u.nume || u.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{u.nume || u.displayName || '-'}</p>
                    <p className="text-gray-400 text-sm">{u.telefon || 'Telefon nesetat'}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-300">{u.email}</td>
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
              <td className="py-4 px-4 text-gray-400 text-sm">
                {u.createdAt ? formatDate(new Date(u.createdAt as unknown as string).getTime()) : '-'}
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
          ))}
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
function OrdersTable({ orders, onStatusChange }: {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
}) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    accepted: 'bg-blue-500/20 text-blue-400',
    in_transit: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const statusLabels: Record<string, string> = {
    pending: 'În așteptare',
    accepted: 'Acceptată',
    in_transit: 'În tranzit',
    delivered: 'Livrată',
    cancelled: 'Anulată',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Client</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rută</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Data ridicare</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-4 px-4">
                <div>
                  <p className="text-white font-medium">{order.nume}</p>
                  <p className="text-gray-400 text-sm">{order.email}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{order.tara_ridicare}</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-300">{order.tara_livrare}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-400 text-sm">{order.data_ridicare || '-'}</td>
              <td className="py-4 px-4">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id!, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}
                >
                  <option value="pending">{statusLabels.pending}</option>
                  <option value="accepted">{statusLabels.accepted}</option>
                  <option value="in_transit">{statusLabels.in_transit}</option>
                  <option value="delivered">{statusLabels.delivered}</option>
                  <option value="cancelled">{statusLabels.cancelled}</option>
                </select>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Vezi detalii"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {couriers.map((courier) => (
        <div key={courier.uid} className="bg-slate-800/50 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                {(courier.nume || courier.email || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{courier.nume || courier.displayName || 'Nume nesetat'}</p>
                <p className="text-gray-400 text-sm">{courier.email}</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
              Activ
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Telefon:</span>
              <span className="text-gray-300">{courier.telefon || '-'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2">
              <EyeIcon className="w-4 h-4" />
              Detalii
            </button>
            <button 
              onClick={() => onSuspend(courier.uid)}
              className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all"
              title="Suspendă curier"
            >
              <BanIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      {couriers.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-400">
          Nu există curieri înregistrați.
        </div>
      )}
    </div>
  );
}

// Stats Tab Content
function StatsContent({ users, orders }: { users: User[]; orders: Order[] }) {
  const clientsCount = users.filter(u => u.role === 'client').length;
  const couriersCount = users.filter(u => u.role === 'curier').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Statistici platformă</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
          <div className="text-3xl font-bold text-emerald-400 mb-1">{clientsCount}</div>
          <div className="text-gray-400 text-sm">Clienți activi</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
          <div className="text-3xl font-bold text-orange-400 mb-1">{couriersCount}</div>
          <div className="text-gray-400 text-sm">Curieri activi</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
          <div className="text-3xl font-bold text-blue-400 mb-1">{deliveredOrders}</div>
          <div className="text-gray-400 text-sm">Comenzi livrate</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{pendingOrders}</div>
          <div className="text-gray-400 text-sm">În așteptare</div>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl p-6 border border-white/5">
        <h4 className="text-white font-medium mb-4">Rata de conversie</h4>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${orders.length > 0 ? (deliveredOrders / orders.length) * 100 : 0}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0}% din comenzi livrate cu succes
        </p>
      </div>

      <div className="text-center py-8 text-gray-400">
        <ChartIcon className="w-12 h-12 mx-auto mb-3 text-gray-500" />
        <p>Grafice detaliate vor fi disponibile în curând.</p>
      </div>
    </div>
  );
}

// Settings Tab Content
function SettingsContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Setări platformă</h3>
      
      <div className="space-y-4">
        <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Notificări email</h4>
              <p className="text-gray-400 text-sm">Primește notificări pentru comenzi noi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Mod întreținere</h4>
              <p className="text-gray-400 text-sm">Dezactivează platforma temporar</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Înregistrări noi</h4>
              <p className="text-gray-400 text-sm">Permite înregistrări de utilizatori noi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="text-center py-8 text-gray-400">
        <CogIcon className="w-12 h-12 mx-auto mb-3 text-gray-500" />
        <p>Mai multe setări vor fi disponibile în curând.</p>
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

  // Auth guard
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, loading, router]);

  // Load data
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

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
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      loadData();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === user?.uid) {
      alert('Nu poți șterge propriul cont!');
      return;
    }
    if (confirm('Ești sigur că vrei să ștergi acest utilizator?')) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'comenzi', orderId), { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSuspendCourier = async (uid: string) => {
    if (confirm('Ești sigur că vrei să suspendi acest curier?')) {
      try {
        await updateDoc(doc(db, 'users', uid), { role: 'client' });
        loadData();
      } catch (error) {
        console.error('Error suspending courier:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Calculate stats
  const clientsCount = users.filter(u => u.role === 'client').length;
  const couriersCount = users.filter(u => u.role === 'curier').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const userName = user.displayName || user.email?.split('@')[0] || 'Admin';

  return (
    <div className="min-h-screen bg-slate-950">
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
            <OrdersTable orders={orders} onStatusChange={handleStatusChange} />
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
