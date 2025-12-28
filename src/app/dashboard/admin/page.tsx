'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Order } from '@/types';
import { showSuccess, showError, showWarning } from '@/lib/toast';
import { showConfirm } from '@/components/ui/ConfirmModal';
import { useAdminMessageThreads } from '@/hooks/useAdminMessageThreads';
import {
  UsersIcon,
  TruckIcon,
  PackageIcon,
  ChartIcon,
  CogIcon,
  UserIcon,
  MoneyIcon,
  DocumentCheckIcon,
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
  StatsContent,
  SettingsContent,
  MonetizareContent,
  DocumentVerificationContent,
  OrderDetailsModal,
  UserDetailsModal,
  AdminMessageModal,
  AdminMessagesListModal,
  StatItem,
  TabItem,
} from '@/components/admin';
import ArchivedOrdersContent from '@/components/admin/ArchivedOrdersContent';

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
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageModalUser, setMessageModalUser] = useState<User | null>(null);
  const [showMessagesListModal, setShowMessagesListModal] = useState(false);
  const [pendingDocsCount, setPendingDocsCount] = useState(0);

  // Track admin message threads
  const { totalUnread } = useAdminMessageThreads();

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
      let pendingDocuments = 0;
      courierProfilesSnapshot.forEach((doc) => {
        const data = doc.data();
        courierProfiles.set(doc.id, data);
        // Count pending documents
        if (data.documents) {
          Object.values(data.documents).forEach((docData: unknown) => {
            const document = docData as { status?: string };
            if (document.status === 'pending') {
              pendingDocuments++;
            }
          });
        }
      });
      setPendingDocsCount(pendingDocuments);

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
        ordersData.push({ id: doc.id, ...orderData } as Order);
      });
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

  const handleToggleVerification = async (uid: string, currentStatus: boolean | undefined) => {
    const newStatus = !currentStatus;
    try {
      // Update verification status in both users and profil_curier collections
      await updateDoc(doc(db, 'users', uid), { 
        verified: newStatus,
        verifiedAt: serverTimestamp()
      });
      
      // Also update profil_curier for consistency
      try {
        await updateDoc(doc(db, 'profil_curier', uid), { 
          verificationStatus: newStatus ? 'verified' : 'unverified',
          verified: newStatus,
          verifiedAt: serverTimestamp()
        });
      } catch {
        // profil_curier might not exist yet, ignore error
        console.log('profil_curier not found for uid:', uid);
      }
      
      showSuccess(newStatus ? 'Curier marcat ca verificat!' : 'Verificare anulată!');
      loadData();
    } catch (error) {
      console.error('Error toggling verification:', error);
      showError('Eroare la modificarea statusului de verificare.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSendMessage = (user: User) => {
    setMessageModalUser(user);
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
    { id: 'archived', label: 'Arhivă', icon: PackageIcon },
    { id: 'documents', label: 'Documente', icon: DocumentCheckIcon, badge: pendingDocsCount > 0 ? pendingDocsCount : undefined },
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
        notificationCount={totalUnread}
        onBellClick={() => setShowMessagesListModal(true)}
      />

      {/* Admin Messages List Modal */}
      {showMessagesListModal && (
        <AdminMessagesListModal 
          onClose={() => setShowMessagesListModal(false)}
          onSelectUser={(user) => setMessageModalUser(user)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-slate-800/30 rounded-2xl p-4 sm:p-6 border border-white/5">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Header row with filters and search */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                {/* Role filter tabs */}
                <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl">
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'all' 
                        ? 'bg-white/10 text-white shadow-inner' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Toți <span className="text-gray-500">({users.length})</span>
                  </button>
                  <button
                    onClick={() => setUserFilter('client')}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'client' 
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-inner shadow-emerald-500/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Clienți <span className="opacity-70">({clientsCount})</span>
                  </button>
                  <button
                    onClick={() => setUserFilter('curier')}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'curier' 
                        ? 'bg-orange-500/20 text-orange-400 shadow-inner shadow-orange-500/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Curieri <span className="opacity-70">({couriersCount})</span>
                  </button>
                </div>
                
                {/* Search */}
                <div className="w-full lg:w-72">
                  <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Caută utilizator..."
                  />
                </div>
              </div>
              
              {/* Secondary filters row */}
              <div className="flex flex-wrap items-center gap-3 pb-2 border-b border-white/5">
                {/* Status filter */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs uppercase tracking-wide">Status:</span>
                  <div className="flex gap-1 bg-slate-900/30 p-0.5 rounded-lg">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Toți
                    </button>
                    <button
                      onClick={() => setStatusFilter('online')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                        statusFilter === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online
                    </button>
                    <button
                      onClick={() => setStatusFilter('offline')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                        statusFilter === 'offline' ? 'bg-gray-600/30 text-gray-300' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                      Offline
                    </button>
                  </div>
                </div>
                
                {/* Verification filter - Only show for couriers */}
                {userFilter === 'curier' && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs uppercase tracking-wide">Verificare:</span>
                    <div className="flex gap-1 bg-slate-900/30 p-0.5 rounded-lg">
                      <button
                        onClick={() => setVerificationFilter('all')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                          verificationFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Toți
                      </button>
                      <button
                        onClick={() => setVerificationFilter('verified')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                          verificationFilter === 'verified' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificați
                      </button>
                      <button
                        onClick={() => setVerificationFilter('unverified')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                          verificationFilter === 'unverified' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Neverificați
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Table */}
              <UsersTable 
                users={filteredUsers}
                onRoleChange={handleRoleChange}
                onDelete={handleDeleteUser}
                onViewDetails={setSelectedUser}
                onSendMessage={handleSendMessage}
                onToggleVerification={handleToggleVerification}
                filter={userFilter}
                statusFilter={statusFilter}
                verificationFilter={verificationFilter}
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

          {/* Archived Orders Tab */}
          {activeTab === 'archived' && <ArchivedOrdersContent />}

          {/* Documents Verification Tab */}
          {activeTab === 'documents' && <DocumentVerificationContent />}

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

      {/* Admin Message Modal */}
      {messageModalUser && (
        <AdminMessageModal
          user={messageModalUser}
          onClose={() => setMessageModalUser(null)}
        />
      )}
    </div>
  );
}
