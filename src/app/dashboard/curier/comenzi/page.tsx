'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, CloseIcon } from '@/components/icons/DashboardIcons';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  expeditorTara: string;
  expeditorJudet: string;
  destinatarTara: string;
  destinatarJudet: string;
  tipColet: string;
  greutate: number;
  status: 'noua' | 'acceptata' | 'in_tranzit' | 'livrata' | 'anulata';
  dataColectare: string;
  pret: number;
  createdAt: Date;
}

const statusLabels: Record<Order['status'], { label: string; color: string; bg: string }> = {
  noua: { label: 'Nouă', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  acceptata: { label: 'Acceptată', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  in_tranzit: { label: 'În Tranzit', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  livrata: { label: 'Livrată', color: 'text-green-400', bg: 'bg-green-500/20' },
  anulata: { label: 'Anulată', color: 'text-red-400', bg: 'bg-red-500/20' },
};

// Mock data for demo
const mockOrders: Order[] = [
  {
    id: '1',
    clientName: 'Maria Ionescu',
    clientPhone: '0722 123 456',
    expeditorTara: 'România',
    expeditorJudet: 'București',
    destinatarTara: 'Germania',
    destinatarJudet: 'München',
    tipColet: 'Standard',
    greutate: 5,
    status: 'noua',
    dataColectare: '28.01.2025',
    pret: 45,
    createdAt: new Date(),
  },
  {
    id: '2',
    clientName: 'Ion Popa',
    clientPhone: '0733 456 789',
    expeditorTara: 'România',
    expeditorJudet: 'Cluj',
    destinatarTara: 'Italia',
    destinatarJudet: 'Roma',
    tipColet: 'Door2Door',
    greutate: 12,
    status: 'acceptata',
    dataColectare: '30.01.2025',
    pret: 85,
    createdAt: new Date(),
  },
  {
    id: '3',
    clientName: 'Elena Vasile',
    clientPhone: '0744 789 012',
    expeditorTara: 'România',
    expeditorJudet: 'Timișoara',
    destinatarTara: 'Spania',
    destinatarJudet: 'Madrid',
    tipColet: 'Standard',
    greutate: 3,
    status: 'in_tranzit',
    dataColectare: '25.01.2025',
    pret: 35,
    createdAt: new Date(),
  },
];

export default function ComenziCurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders); // Using mock data for demo
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Load orders from Firebase (in production)
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      setLoadingOrders(true);
      try {
        const q = query(
          collection(db, 'comenzi'),
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const loadedOrders: Order[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedOrders.push({
            id: doc.id,
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            expeditorTara: data.expeditorTara,
            expeditorJudet: data.expeditorJudet,
            destinatarTara: data.destinatarTara,
            destinatarJudet: data.destinatarJudet,
            tipColet: data.tipColet,
            greutate: data.greutate,
            status: data.status,
            dataColectare: data.dataColectare,
            pret: data.pret,
            createdAt: data.createdAt?.toDate(),
          });
        });
        if (loadedOrders.length > 0) {
          setOrders(loadedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Update in Firebase (in production)
      // await updateDoc(doc(db, 'comenzi', orderId), { status: newStatus });
      
      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Eroare la actualizare. Încearcă din nou.');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    noi: orders.filter(o => o.status === 'noua').length,
    inTranzit: orders.filter(o => o.status === 'in_tranzit').length,
    livrate: orders.filter(o => o.status === 'livrata').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2 sm:p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-linear-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/20">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Comenzile Mele</h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Gestionează comenzile și livrările tale</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-emerald-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-gray-400">Total comenzi</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-blue-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-blue-400">{stats.noi}</p>
                <p className="text-xs text-gray-400">Comenzi noi</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-orange-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81M15 6a2 2 0 0 0 0-4M15 6a2 2 0 0 1 0-4m0 4V2m0 4v4m0-4h-4m4 0h4" />
                  <path d="M5 18v2" />
                  <path d="M19 18v2" />
                  <circle cx="5" cy="18" r="2" />
                  <circle cx="19" cy="18" r="2" />
                  <path d="M5 16V8h14v8" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-orange-400">{stats.inTranzit}</p>
                <p className="text-xs text-gray-400">În tranzit</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-green-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-green-400">{stats.livrate}</p>
                <p className="text-xs text-gray-400">Livrate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              Toate ({orders.length})
            </button>
            {Object.entries(statusLabels).map(([status, { label, bg, color }]) => {
              const count = orders.filter(o => o.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status as Order['status'])}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filter === status 
                      ? `${bg} ${color} shadow-lg` 
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
            Lista Comenzilor
          </h2>
          
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl sm:text-7xl mb-4">📭</div>
              <p className="text-gray-300 text-base sm:text-lg font-medium">Nu ai nicio comandă</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter !== 'all' ? `cu status "${statusLabels[filter].label}"` : 'Comenzile vor apărea aici când clienții plasează comenzi.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-3">
                    {/* Status & ID */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].bg} ${statusLabels[order.status].color}`}>
                        {statusLabels[order.status].label}
                      </span>
                      <span className="text-gray-500 text-xs">#{order.id}</span>
                    </div>
                    
                    {/* Client Info */}
                    <div>
                      <h3 className="font-semibold text-white">{order.clientName}</h3>
                      <p className="text-gray-400 text-sm">{order.clientPhone}</p>
                    </div>
                    
                    {/* Route */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-400 truncate">📍 {order.expeditorJudet}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-orange-400 truncate">📍 {order.destinatarJudet}</span>
                    </div>
                    
                    {/* Details Row */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{order.tipColet}</span>
                      <span>{order.greutate} kg</span>
                      <span>📅 {order.dataColectare}</span>
                    </div>
                    
                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <p className="text-xl font-bold text-green-400">{order.pret} €</p>
                      <div className="flex gap-2">
                        {order.status === 'noua' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'acceptata')}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg font-medium transition-colors"
                            >
                              Acceptă
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'anulata')}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-lg font-medium transition-colors"
                            >
                              Refuză
                            </button>
                          </>
                        )}
                        {order.status === 'acceptata' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'in_tranzit')}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-medium transition-colors"
                          >
                            Marchează ridicat
                          </button>
                        )}
                        {order.status === 'in_tranzit' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'livrata')}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg font-medium transition-colors"
                          >
                            Marchează livrat
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg font-medium transition-colors"
                        >
                          Detalii
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].bg} ${statusLabels[order.status].color}`}>
                          {statusLabels[order.status].label}
                        </span>
                        <span className="text-gray-500 text-xs">#{order.id}</span>
                      </div>
                      <h3 className="font-semibold text-white">{order.clientName}</h3>
                      <p className="text-gray-400 text-sm">{order.clientPhone}</p>
                    </div>

                    {/* Route */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">📍 {order.expeditorJudet}, {order.expeditorTara}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-orange-400">📍 {order.destinatarJudet}, {order.destinatarTara}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                        <span>{order.tipColet}</span>
                        <span>{order.greutate} kg</span>
                        <span>📅 {order.dataColectare}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-green-400 mb-2">{order.pret} €</p>
                      <div className="flex gap-2 justify-end">
                        {order.status === 'noua' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'acceptata')}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg font-medium transition-colors"
                            >
                              Acceptă
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'anulata')}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-lg font-medium transition-colors"
                            >
                              Refuză
                            </button>
                          </>
                        )}
                        {order.status === 'acceptata' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'in_tranzit')}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-medium transition-colors"
                          >
                            Marchează ridicat
                          </button>
                        )}
                        {order.status === 'in_tranzit' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'livrata')}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg font-medium transition-colors"
                          >
                            Marchează livrat
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg font-medium transition-colors"
                        >
                          Detalii
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Detalii Comandă #{selectedOrder.id}</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusLabels[selectedOrder.status].bg} ${statusLabels[selectedOrder.status].color}`}>
                    {statusLabels[selectedOrder.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-white/5">
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">Client</p>
                    <p className="text-white font-medium text-sm sm:text-base">{selectedOrder.clientName}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{selectedOrder.clientPhone}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-white/5">
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">Preț</p>
                    <p className="text-green-400 font-bold text-xl sm:text-2xl">{selectedOrder.pret} €</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-white/5">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">Traseu</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1">
                      <p className="text-green-400 font-medium text-sm">📍 Expeditor</p>
                      <p className="text-white text-sm">{selectedOrder.expeditorJudet}</p>
                      <p className="text-gray-400 text-xs">{selectedOrder.expeditorTara}</p>
                    </div>
                    <div className="text-gray-500 text-xl sm:text-2xl">→</div>
                    <div className="flex-1">
                      <p className="text-orange-400 font-medium text-sm">📍 Destinatar</p>
                      <p className="text-white text-sm">{selectedOrder.destinatarJudet}</p>
                      <p className="text-gray-400 text-xs">{selectedOrder.destinatarTara}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-slate-800/50 p-2.5 sm:p-4 rounded-xl text-center border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Tip</p>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedOrder.tipColet}</p>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 sm:p-4 rounded-xl text-center border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Greutate</p>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedOrder.greutate} kg</p>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 sm:p-4 rounded-xl text-center border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Data</p>
                    <p className="text-white font-medium text-xs sm:text-sm">{selectedOrder.dataColectare}</p>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {selectedOrder.status === 'noua' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'acceptata')}
                        className="flex-1 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base rounded-xl font-medium transition-colors"
                      >
                        Acceptă comanda
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'anulata')}
                        className="flex-1 py-2.5 sm:py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm sm:text-base rounded-xl font-medium transition-colors"
                      >
                        Refuză
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'acceptata' && (
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, 'in_tranzit')}
                      className="flex-1 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base rounded-xl font-medium transition-colors"
                    >
                      Marchează ca ridicat
                    </button>
                  )}
                  {selectedOrder.status === 'in_tranzit' && (
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, 'livrata')}
                      className="flex-1 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base rounded-xl font-medium transition-colors"
                    >
                      Marchează ca livrat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
