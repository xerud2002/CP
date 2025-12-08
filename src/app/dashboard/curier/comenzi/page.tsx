'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
          where('curierId', '==', user.uid),
          orderBy('createdAt', 'desc')
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
    <div className="min-h-screen p-6 page-transition">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard/curier" className="text-gray-400 hover:text-white transition-colors mb-2 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">📦 Comenzile Mele</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total comenzi</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-blue-400">{stats.noi}</div>
            <div className="stat-label">Comenzi noi</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-orange-400">{stats.inTranzit}</div>
            <div className="stat-label">În tranzit</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-green-400">{stats.livrate}</div>
            <div className="stat-label">Livrate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
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
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === status 
                      ? `${bg} ${color} border border-current` 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="card">
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400">Nu ai nicio comandă {filter !== 'all' && `cu status "${statusLabels[filter].label}"`}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusLabels[order.status].bg} ${statusLabels[order.status].color}`}>
                          {statusLabels[order.status].label}
                        </span>
                        <span className="text-gray-500 text-sm">#{order.id}</span>
                      </div>
                      <h3 className="font-semibold text-white text-lg">{order.clientName}</h3>
                      <p className="text-gray-400 text-sm">{order.clientPhone}</p>
                    </div>

                    {/* Route */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">📍 {order.expeditorJudet}, {order.expeditorTara}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-orange-400">📍 {order.destinatarJudet}, {order.destinatarTara}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span>📦 {order.tipColet}</span>
                        <span>⚖️ {order.greutate} kg</span>
                        <span>📅 {order.dataColectare}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{order.pret} €</p>
                      <div className="flex gap-2 mt-2">
                        {order.status === 'noua' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'acceptata')}
                              className="btn-secondary text-sm px-3 py-1"
                            >
                              Acceptă
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'anulata')}
                              className="btn-danger text-sm px-3 py-1"
                            >
                              Refuză
                            </button>
                          </>
                        )}
                        {order.status === 'acceptata' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'in_tranzit')}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Marchează ridicat
                          </button>
                        )}
                        {order.status === 'in_tranzit' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'livrata')}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            Marchează livrat
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="btn-outline-green text-sm px-3 py-1"
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Detalii Comandă #{selectedOrder.id}</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusLabels[selectedOrder.status].bg} ${statusLabels[selectedOrder.status].color}`}>
                    {statusLabels[selectedOrder.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">Client</p>
                    <p className="text-white font-medium">{selectedOrder.clientName}</p>
                    <p className="text-gray-400 text-sm">{selectedOrder.clientPhone}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">Preț</p>
                    <p className="text-green-400 font-bold text-2xl">{selectedOrder.pret} €</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl">
                  <p className="text-gray-500 text-sm mb-2">Traseu</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-green-400 font-medium">📍 Expeditor</p>
                      <p className="text-white">{selectedOrder.expeditorJudet}</p>
                      <p className="text-gray-400 text-sm">{selectedOrder.expeditorTara}</p>
                    </div>
                    <div className="text-gray-500 text-2xl">→</div>
                    <div className="flex-1">
                      <p className="text-orange-400 font-medium">📍 Destinatar</p>
                      <p className="text-white">{selectedOrder.destinatarJudet}</p>
                      <p className="text-gray-400 text-sm">{selectedOrder.destinatarTara}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                    <p className="text-gray-500 text-sm mb-1">Tip</p>
                    <p className="text-white font-medium">{selectedOrder.tipColet}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                    <p className="text-gray-500 text-sm mb-1">Greutate</p>
                    <p className="text-white font-medium">{selectedOrder.greutate} kg</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                    <p className="text-gray-500 text-sm mb-1">Data colectare</p>
                    <p className="text-white font-medium">{selectedOrder.dataColectare}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedOrder.status === 'noua' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'acceptata')}
                        className="btn-secondary flex-1"
                      >
                        Acceptă comanda
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'anulata')}
                        className="btn-danger flex-1"
                      >
                        Refuză
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'acceptata' && (
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, 'in_tranzit')}
                      className="btn-primary flex-1"
                    >
                      Marchează ca ridicat
                    </button>
                  )}
                  {selectedOrder.status === 'in_tranzit' && (
                    <button 
                      onClick={() => handleStatusChange(selectedOrder.id, 'livrata')}
                      className="btn-secondary flex-1"
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
