'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError, showWarning } from '@/lib/toast';
import { formatOrderNumber, normalizeStatus } from '@/utils/orderHelpers';
import { serviceNames, orderStatusConfig } from '@/lib/constants';
import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import { ArrowLeftIcon, PackageIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TruckIcon, StarIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';

interface Order {
  id: string;
  orderNumber?: number;
  serviciu: string;
  status: 'noua' | 'in_lucru' | 'livrata' | 'anulata' | 'pending' | 'accepted' | 'in_transit' | 'completed' | 'cancelled';
  tara_ridicare: string;
  judet_ridicare: string;
  oras_ridicare: string;
  tara_livrare: string;
  judet_livrare: string;
  oras_livrare: string;
  data_ridicare: string;
  greutate: string;
  createdAt: Timestamp;
  timestamp: number;
  nrOferte?: number;
  nrMesajeNoi?: number;
  hasNewNotifications?: boolean;
}

// Status icon mapping (with proper typing)
const statusIcons: Record<string, typeof ClockIcon> = {
  noua: ClockIcon,
  in_lucru: TruckIcon,
  livrata: CheckCircleIcon,
  anulata: XCircleIcon,
  // Old English statuses (for backwards compatibility)
  pending: ClockIcon,
  accepted: TruckIcon,
  in_transit: TruckIcon,
  completed: CheckCircleIcon,
  cancelled: XCircleIcon,
};

const getFlagPath = (code: string) => `/img/flag/${code.toLowerCase()}.svg`;

export default function ComenziClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    try {
      const q = query(
        collection(db, 'comenzi'),
        where('uid_client', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      console.log('Orders loaded:', ordersData.length, ordersData);
      console.log('Order statuses:', ordersData.map(o => ({ id: o.id, status: o.status, statusType: typeof o.status })));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderStatus: string) => {
    const normalizedStatus = normalizeStatus(orderStatus);
    console.log('Delete attempt:', { orderId, orderStatus, normalizedStatus });
    
    if (normalizedStatus !== 'noua') {
      showWarning('Poți șterge doar comenzile cu statusul "Nouă"!');
      return;
    }

    if (!confirm('Ești sigur că vrei să ștergi această comandă?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'comenzi', orderId));
      showSuccess('Comandă ștearsă cu succes!');
      loadOrders();
    } catch (error) {
      showError(error);
    }
  };

  const handleEditOrder = (orderId: string, orderStatus: string) => {
    const normalizedStatus = normalizeStatus(orderStatus);
    console.log('Edit attempt:', { orderId, orderStatus, normalizedStatus });
    
    if (normalizedStatus !== 'noua') {
      showWarning('Poți edita doar comenzile cu statusul "Nouă"!');
      return;
    }
    // Redirect to order page with edit mode
    router.push(`/comanda?edit=${orderId}`);
  };

  const handleFinalizeOrder = async (orderId: string, status: string) => {
    const normalizedStatus = normalizeStatus(status);
    console.log('Finalize attempt:', { orderId, status, normalizedStatus });
    
    if (!canFinalizeOrder(normalizedStatus)) {
      showWarning('Poți finaliza doar comenzile cu statusul "În Lucru"!');
      return;
    }
    
    const success = await transitionToFinalizata(orderId, normalizedStatus);
    if (success) {
      loadOrders();
    }
  };

  const handleLeaveReview = (orderId: string) => {
    router.push(`/dashboard/client/recenzii?orderId=${orderId}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => {
        const normalizedOrderStatus = normalizeStatus((o.status || '').toString().trim().toLowerCase());
        const filter = filterStatus.toString().trim().toLowerCase();
        const match = normalizedOrderStatus === filter;
        console.log(`Filtering: order.id='${o.id}', order.status='${o.status}' (normalized='${normalizedOrderStatus}'), filterStatus='${filterStatus}' (lower='${filter}'), match=${match}`);
        return match;
      });

  console.log(`Total orders: ${orders.length}, Filtered orders: ${filteredOrders.length}, Filter: ${filterStatus}`);

  // Calculate order counts by status
  const orderCounts = {
    all: orders.length,
    noua: orders.filter(o => normalizeStatus(o.status) === 'noua').length,
    in_lucru: orders.filter(o => normalizeStatus(o.status) === 'in_lucru').length,
    livrata: orders.filter(o => normalizeStatus(o.status) === 'livrata').length,
    anulata: orders.filter(o => normalizeStatus(o.status) === 'anulata').length,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/dashboard/client" 
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">Comenzile Tale</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Urmărește coletele</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
                {orders.length} {orders.length === 1 ? 'comandă' : 'comenzi'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`relative pl-4 pr-7 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="absolute top-1 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold bg-blue-600 text-white rounded-full border-2 border-slate-900">
              {orderCounts.all}
            </span>
            Toate
          </button>
          <button
            onClick={() => setFilterStatus('noua')}
            className={`relative pl-4 pr-7 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              filterStatus === 'noua'
                ? 'bg-white text-slate-900 shadow-lg shadow-white/25'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="absolute top-1 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold bg-white text-slate-900 rounded-full border-2 border-slate-900">
              {orderCounts.noua}
            </span>
            Nouă
          </button>
          <button
            onClick={() => setFilterStatus('in_lucru')}
            className={`relative pl-4 pr-7 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              filterStatus === 'in_lucru'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="absolute top-1 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold bg-orange-600 text-white rounded-full border-2 border-slate-900">
              {orderCounts.in_lucru}
            </span>
            În Lucru
          </button>
          <button
            onClick={() => setFilterStatus('livrata')}
            className={`relative pl-4 pr-7 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              filterStatus === 'livrata'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="absolute top-1 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full border-2 border-slate-900">
              {orderCounts.livrata}
            </span>
            Finalizată
          </button>
          <button
            onClick={() => setFilterStatus('anulata')}
            className={`relative pl-4 pr-7 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              filterStatus === 'anulata'
                ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/25'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="absolute top-1 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold bg-gray-600 text-white rounded-full border-2 border-slate-900">
              {orderCounts.anulata}
            </span>
            Arhivată
          </button>
        </div>

        {/* Orders List */}
        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Se încarcă comenzile...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <PackageIcon className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 mb-2">
              {filterStatus === 'all' 
                ? 'Nu ai nicio comandă încă' 
                : `Nu ai comenzi cu statusul "${orderStatusConfig[filterStatus as keyof typeof orderStatusConfig]?.label}"`
              }
            </p>
            <p className="text-gray-500 text-sm mb-4">Creează prima ta comandă pentru transport</p>
            <Link 
              href="/comanda" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25"
            >
              <PackageIcon className="w-5 h-5" />
              Comandă Transport
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const normalizedStatus = normalizeStatus(order.status) as keyof typeof orderStatusConfig;
              const StatusIcon = statusIcons[normalizedStatus] || ClockIcon;
              const statusConfig = orderStatusConfig[normalizedStatus] || orderStatusConfig.noua;
              return (
                <div 
                  key={order.id} 
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Service Icon with Notification Beam */}
                    <div className="relative w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                      <PackageIcon className="w-6 h-6 text-blue-400" />
                      {(order.nrOferte || order.nrMesajeNoi) && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 items-center justify-center text-[10px] font-bold text-white">
                            {(order.nrOferte || 0) + (order.nrMesajeNoi || 0)}
                          </span>
                        </span>
                      )}
                    </div>
                    
                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">
                              {serviceNames[order.serviciu] || order.serviciu}
                            </h3>
                            {/* Notification Badges */}
                            {(order.nrOferte ?? 0) > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {order.nrOferte} {order.nrOferte === 1 ? 'ofertă' : 'oferte'}
                              </span>
                            )}
                            {(order.nrMesajeNoi ?? 0) > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-medium border border-blue-500/30 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                {order.nrMesajeNoi} {order.nrMesajeNoi === 1 ? 'mesaj' : 'mesaje'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Comandă #{formatOrderNumber(order.orderNumber || order.id)}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                      
                      {/* Route + Action Buttons */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Image 
                              src={getFlagPath(order.tara_ridicare)} 
                              alt="" 
                              width={20} 
                              height={15} 
                              className="rounded-sm shrink-0"
                            />
                            <span className="text-xs sm:text-sm text-gray-300 truncate">
                              {order.oras_ridicare}, {order.judet_ridicare}
                            </span>
                          </div>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <div className="flex items-center gap-2">
                            <Image 
                              src={getFlagPath(order.tara_livrare)} 
                              alt="" 
                              width={20} 
                              height={15} 
                              className="rounded-sm shrink-0"
                            />
                            <span className="text-xs sm:text-sm text-gray-300 truncate">
                              {order.oras_livrare}, {order.judet_livrare}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          {/* Review Button - only for 'livrata' status */}
                          {order.status === 'livrata' && (
                            <button
                              onClick={() => handleLeaveReview(order.id)}
                              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400 text-xs font-medium transition-all flex items-center gap-1.5"
                              title="Lasă recenzie"
                            >
                              <StarIcon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Recenzie</span>
                            </button>
                          )}
                          {/* Finalizare Button - only for 'in_lucru' status */}
                          {order.status === 'in_lucru' && (
                            <button
                              onClick={() => handleFinalizeOrder(order.id, order.status)}
                              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-xs font-medium transition-all flex items-center gap-1.5"
                              title="Finalizează comanda"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="hidden sm:inline">Finalizează</span>
                            </button>
                          )}
                          {/* Edit Button - only for 'noua' status */}
                          {normalizedStatus === 'noua' && (
                            <button
                              onClick={() => handleEditOrder(order.id, order.status)}
                              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-medium transition-all flex items-center gap-1.5"
                              title="Modifică comanda"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="hidden sm:inline">Modifică</span>
                            </button>
                          )}
                          {/* Delete Button - only for 'noua' status */}
                          {normalizedStatus === 'noua' && (
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.status)}
                              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-medium transition-all flex items-center gap-1.5"
                              title="Șterge comanda"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="hidden sm:inline">Șterge</span>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Greutate: {order.greutate} kg</span>
                        <span>•</span>
                        <span>Data ridicare: {order.data_ridicare}</span>
                        <span>•</span>
                        <span>
                          Creat: {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('ro-RO') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Card */}
        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>
    </div>
  );
}
