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
  UserIcon,
  MoneyIcon,
} from '@/components/icons/DashboardIcons';

// Import Admin Components
import {
  AdminHeader,
  WelcomeSection,
  StatsGrid,
  TabNavigation,
  SearchBar,
  UsersTable,
  OrdersTable,
  CouriersGrid,
  StatsContent,
  SettingsContent,
  MonetizareContent,
  OrderDetailsModal,
  UserDetailsModal,
  StatItem,
  TabItem,
} from '@/components/admin';

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminActiveTab') || 'users';
    }
    return 'users';
  });
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'client' | 'curier'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Persist active tab to localStorage
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

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

      // Load client profiles to get nume/prenume
      const clientProfilesSnapshot = await getDocs(collection(db, 'profil_client'));
      const clientProfiles = new Map();
      clientProfilesSnapshot.forEach((doc) => {
        clientProfiles.set(doc.id, doc.data());
      });

      // Load courier profiles to get nume/prenume
      const courierProfilesSnapshot = await getDocs(collection(db, 'profil_curier'));
      const courierProfiles = new Map();
      courierProfilesSnapshot.forEach((doc) => {
        courierProfiles.set(doc.id, doc.data());
      });

      // Merge profile data with users
      usersData.forEach(user => {
        if (user.role === 'client' && clientProfiles.has(user.uid)) {
          const profile = clientProfiles.get(user.uid);
          user.nume = profile.nume || user.nume;
          user.prenume = profile.prenume || user.prenume;
          user.telefon = profile.telefon || user.telefon;
        } else if (user.role === 'curier' && courierProfiles.has(user.uid)) {
          const profile = courierProfiles.get(user.uid);
          user.nume = profile.nume || user.nume;
          user.prenume = profile.prenume || user.prenume;
          user.telefon = profile.telefon || user.telefon;
        }
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
    { id: 'monetizare', label: 'Monetizare', icon: MoneyIcon },
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
        notificationCount={0}
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
              <div className="flex flex-col gap-4">
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
                <div className="flex gap-2">
                  <span className="text-gray-400 text-sm flex items-center">Status:</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Toți
                  </button>
                  <button
                    onClick={() => setStatusFilter('online')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      statusFilter === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </button>
                  <button
                    onClick={() => setStatusFilter('offline')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      statusFilter === 'offline' ? 'bg-gray-500/20 text-gray-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    Offline
                  </button>
                </div>
              </div>
              <UsersTable 
                users={filteredUsers}
                onRoleChange={handleRoleChange}
                onDelete={handleDeleteUser}
                onViewDetails={setSelectedUser}
                filter={userFilter}
                statusFilter={statusFilter}
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

          {/* Monetizare Tab */}
          {activeTab === 'monetizare' && (
            <MonetizareContent users={users} orders={orders} />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsContent />}
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}
