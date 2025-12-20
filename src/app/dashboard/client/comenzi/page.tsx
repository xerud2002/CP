'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, orderBy, Timestamp, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { serviceNames, countries } from '@/lib/constants';

// Helper to get country name from code
const getCountryName = (code: string): string => {
  const country = countries.find(c => c.code === code);
  return country?.name || code;
};
import { ArrowLeftIcon, PackageIcon } from '@/components/icons/DashboardIcons';
import { ServiceIcon, getServiceIconMetadata } from '@/components/icons/ServiceIcons';
import HelpCard from '@/components/HelpCard';
import OrderChatMulti from '@/components/orders/OrderChatMulti';

interface Order {
  id: string;
  orderNumber?: number;
  serviciu: string;
  tara_ridicare: string;
  judet_ridicare: string;
  oras_ridicare: string;
  adresa_ridicare?: string;
  tara_livrare: string;
  judet_livrare: string;
  oras_livrare: string;
  adresa_livrare?: string;
  data_ridicare: string;
  data_ridicare_end?: string;
  tip_programare?: string;
  greutate: string;
  lungime?: string;
  latime?: string;
  inaltime?: string;
  cantitate?: string;
  descriere?: string;
  observatii?: string;
  optiuni?: string[];
  tip_ofertanti?: string[];
  nume?: string;
  email?: string;
  telefon?: string;
  courierId?: string;
  createdAt: Timestamp;
  timestamp: number;
  nrOferte?: number;
  nrMesajeNoi?: number;
}

const getFlagPath = (code: string) => `/img/flag/${code.toLowerCase()}.svg`;

export default function ComenziClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedChatOrderId, setExpandedChatOrderId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

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

  // Listen for unread messages count
  useEffect(() => {
    if (!user || orders.length === 0) return;

    const unsubscribers: (() => void)[] = [];

    orders.forEach((order) => {
      if (!order.id || !order.courierId) return; // Skip if no courier assigned

      const messagesRef = collection(db, 'mesaje');
      const q = query(
        messagesRef,
        where('orderId', '==', order.id),
        where('clientId', '==', user.uid),
        where('courierId', '==', order.courierId),
        where('read', '==', false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        // Filter out messages sent by current user (client-side filtering)
        const unreadCount = snapshot.docs.filter(doc => doc.data().senderId !== user.uid).length;
        setUnreadCounts((prev) => ({
          ...prev,
          [order.id]: unreadCount,
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user, orders]);

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
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
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

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-900/90 border-b border-white/5 sticky top-0 z-60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/dashboard/client" 
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
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
        {/* Add New Order CTA */}
        <Link
          href="/comanda"
          className="group block mb-6 bg-linear-to-r from-orange-500/10 via-amber-500/5 to-green-500/10 hover:from-orange-500/20 hover:via-amber-500/10 hover:to-green-500/20 backdrop-blur-sm rounded-xl border border-orange-500/20 hover:border-orange-500/40 p-4 sm:p-5 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">Comandă nouă</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Plasează o cerere de transport</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Orders List */}
        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Se încarcă comenzile...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <PackageIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nicio comandă</h3>
            <p className="text-gray-400 mb-6">Nu ai nici o comandă plasată încă</p>
            <Link
              href="/comanda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
            >
              <PackageIcon className="w-5 h-5" />
              Creează Prima Comandă
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const serviceConfig = getServiceIconMetadata(order.serviciu);
              
              return (
                <div 
                  key={order.id} 
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div className={`relative w-12 h-12 rounded-xl ${serviceConfig.bg} flex items-center justify-center shrink-0 ${serviceConfig.color}`}>
                      <ServiceIcon service={order.serviciu} />
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
                            {(order.nrOferte ?? 0) > 0 && (
                              <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium rounded-full">
                                {order.nrOferte} {order.nrOferte === 1 ? 'ofertă' : 'oferte'}
                              </span>
                            )}
                            {(order.nrMesajeNoi ?? 0) > 0 && (
                              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium rounded-full">
                                {order.nrMesajeNoi} {order.nrMesajeNoi === 1 ? 'mesaj nou' : 'mesaje noi'}
                              </span>
                            )}
                          </div>
                          {order.orderNumber && (
                            <p className="text-xs text-gray-400">
                              #{formatOrderNumber(order.orderNumber)}
                            </p>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setExpandedChatOrderId(expandedChatOrderId === order.id ? null : order.id || null)}
                            className={`relative p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                              expandedChatOrderId === order.id 
                                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30' 
                                : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/40 text-blue-400'
                            }`}
                            title="Mesaje"
                          >
                            {order.id && unreadCounts[order.id] > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 items-center justify-center text-[9px] font-bold text-white">
                                  {unreadCounts[order.id]}
                                </span>
                              </span>
                            )}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="hidden sm:inline">Chat</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-medium transition-all flex items-center gap-1.5"
                            title="Vezi detalii"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">Vezi</span>
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-medium transition-all flex items-center gap-1.5"
                            title="Șterge comanda"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Șterge</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Route */}
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Image 
                            src={getFlagPath(order.tara_ridicare)} 
                            alt={order.tara_ridicare} 
                            width={20} 
                            height={15} 
                            className="rounded"
                          />
                          <span className="text-gray-300">{order.judet_ridicare}, {order.oras_ridicare}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="flex items-center gap-1.5">
                          <Image 
                            src={getFlagPath(order.tara_livrare)} 
                            alt={order.tara_livrare} 
                            width={20} 
                            height={15} 
                            className="rounded"
                          />
                          <span className="text-gray-300">{order.judet_livrare}, {order.oras_livrare}</span>
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                        {/* Show different info based on service type */}
                        {order.serviciu === 'plicuri' ? (
                          <span>Plicuri: {order.cantitate || 1} buc</span>
                        ) : order.serviciu === 'persoane' ? (
                          <span>Pasageri: {order.cantitate || 1}</span>
                        ) : order.serviciu === 'masini' ? (
                          <span>Transport auto</span>
                        ) : order.greutate ? (
                          <span>Colet: {order.greutate}{!order.greutate.includes('kg') ? ' kg' : ''}</span>
                        ) : order.cantitate ? (
                          <span>Cantitate: {order.cantitate}</span>
                        ) : null}
                        <span>Data aprox: {(() => {
                          const [year, month, day] = order.data_ridicare.split('-');
                          return `${day}/${month}/${year}`;
                        })()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Chat Section */}
                  {expandedChatOrderId === order.id && (
                    <div className="mt-4 border-t border-white/5 pt-4 animate-in slide-in-from-top-2 duration-200">
                      <OrderChatMulti 
                        orderId={order.id || ''} 
                        orderNumber={order.orderNumber}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8">
          <HelpCard />
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          {/* Backdrop - only visible on screen */}
          <div 
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm print:hidden"
            onClick={() => setSelectedOrder(null)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden" onClick={() => setSelectedOrder(null)}>
            {/* Modal */}
            <div className="relative bg-slate-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex items-center justify-between print:static print:bg-gray-100 print:border-gray-300">
                <div className="flex items-center gap-3">
                {(() => {
                  const config = getServiceIconMetadata(selectedOrder.serviciu);
                  return (
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
                      <ServiceIcon service={selectedOrder.serviciu} className="w-6 h-6" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {serviceNames[selectedOrder.serviciu] || selectedOrder.serviciu}
                  </h2>
                  {selectedOrder.orderNumber && (
                    <p className="text-xs text-gray-400">#{formatOrderNumber(selectedOrder.orderNumber)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Printează comanda"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6 print:overflow-visible print:max-h-none print:p-4">
              {/* Route Section */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5 print:bg-gray-50 print:border-gray-300">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 print:text-gray-700">Rută Transport</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-400 text-xs font-medium uppercase print:text-green-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Ridicare
                    </div>
                    <div className="flex items-center gap-2">
                      <Image src={getFlagPath(selectedOrder.tara_ridicare)} alt="" width={20} height={15} className="rounded print:border print:border-gray-300" />
                      <span className="text-white font-medium print:text-gray-900">{getCountryName(selectedOrder.tara_ridicare)}</span>
                    </div>
                    <p className="text-gray-300 text-sm print:text-gray-700">{selectedOrder.judet_ridicare}, {selectedOrder.oras_ridicare}</p>
                    {selectedOrder.adresa_ridicare && (
                      <p className="text-gray-400 text-sm">{selectedOrder.adresa_ridicare}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-medium uppercase">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Livrare
                    </div>
                    <div className="flex items-center gap-2">
                      <Image src={getFlagPath(selectedOrder.tara_livrare)} alt="" width={20} height={15} className="rounded" />
                      <span className="text-white font-medium">{getCountryName(selectedOrder.tara_livrare)}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{selectedOrder.judet_livrare}, {selectedOrder.oras_livrare}</p>
                    {selectedOrder.adresa_livrare && (
                      <p className="text-gray-400 text-sm">{selectedOrder.adresa_livrare}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transport Details */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalii Transport</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedOrder.greutate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Greutate</p>
                      <p className="text-white font-medium">{selectedOrder.greutate}{!selectedOrder.greutate.includes('kg') ? ' kg' : ''}</p>
                    </div>
                  )}
                  {(selectedOrder.lungime || selectedOrder.latime || selectedOrder.inaltime) && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dimensiuni (L×l×h)</p>
                      <p className="text-white font-medium">
                        {selectedOrder.lungime || '-'} × {selectedOrder.latime || '-'} × {selectedOrder.inaltime || '-'} cm
                      </p>
                    </div>
                  )}
                  {selectedOrder.cantitate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cantitate</p>
                      <p className="text-white font-medium">{selectedOrder.cantitate}</p>
                    </div>
                  )}
                </div>
                {selectedOrder.descriere && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Descriere</p>
                    <p className="text-gray-300 text-sm">{selectedOrder.descriere}</p>
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Programare</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {selectedOrder.tip_programare === 'range' ? 'Interval ridicare' : 
                       selectedOrder.tip_programare === 'flexibil' ? 'Program flexibil' : 'Data ridicare'}
                    </p>
                    <p className="text-white font-medium">
                      {selectedOrder.tip_programare === 'flexibil' ? 'Flexibil - oricând' : (
                        <>
                          {(() => {
                            const [y, m, d] = selectedOrder.data_ridicare.split('-');
                            return `${d}/${m}/${y}`;
                          })()}
                          {selectedOrder.data_ridicare_end && (
                            <> → {(() => {
                              const [y, m, d] = selectedOrder.data_ridicare_end.split('-');
                              return `${d}/${m}/${y}`;
                            })()}</>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              {(selectedOrder.tip_ofertanti?.length || selectedOrder.optiuni?.length) && (
                <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Preferințe</h3>
                  {selectedOrder.tip_ofertanti && selectedOrder.tip_ofertanti.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Tip ofertanți</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrder.tip_ofertanti.map((tip) => (
                          <span key={tip} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                            {tip === 'firme' ? 'Firme de Transport' : 'Persoane Private'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedOrder.optiuni && selectedOrder.optiuni.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Opțiuni suplimentare</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrder.optiuni.map((opt) => {
                          const optionLabels: Record<string, string> = {
                            'asigurare': 'Asigurare transport',
                            'incarcare_descarcare': 'Încărcare/Descărcare inclusă',
                            'montaj_demontaj': 'Montaj/Demontaj mobilier',
                            'ambalare': 'Ambalare profesională',
                            'ambalare_speciala': 'Ambalare specială electronice',
                            'frigo': 'Transport frigorific',
                            'bagaje_extra': 'Bagaje suplimentare',
                            'animale': 'Transport animale de companie',
                            'cusca_transport': 'Cușcă transport profesională',
                            'fragil': 'Manipulare fragil',
                            'express': 'Livrare express',
                            'temperatura_controlata': 'Temperatură controlată'
                          };
                          const label = optionLabels[opt] || opt;
                          return (
                            <span key={opt} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Observations */}
              {selectedOrder.observatii && (
                <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Observații</h3>
                  <p className="text-gray-300 text-sm">{selectedOrder.observatii}</p>
                </div>
              )}

              {/* Contact Info */}
              {(selectedOrder.nume || selectedOrder.email || selectedOrder.telefon) && (
                <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Date Contact</h3>
                  <div className="space-y-3">
                    {selectedOrder.nume && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Nume</p>
                          <p className="text-white font-medium truncate">{selectedOrder.nume}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-white font-medium break-all">{selectedOrder.email}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.telefon && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Telefon</p>
                          <p className="text-white font-medium">{selectedOrder.telefon}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Section */}
              <div className="bg-slate-700/30 rounded-xl border border-white/5 overflow-hidden">
                <OrderChatMulti 
                  orderId={selectedOrder.id || ''} 
                  orderNumber={selectedOrder.orderNumber}
                />
              </div>

              {/* Created Date */}
              <div className="text-center text-xs text-gray-500 pt-2 print:text-gray-600 print:border-t print:border-gray-300 print:mt-4 print:pt-4">
                Comandă creată la {selectedOrder.createdAt?.toDate?.()?.toLocaleDateString('ro-RO', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) || new Date(selectedOrder.timestamp).toLocaleDateString('ro-RO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              {/* Print footer */}
              <div className="hidden print:block text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-300">
                <p>© {new Date().getFullYear()} Curierul Perfect - www.curierulperfect.ro</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Print-only version - separate container for printing */}
        <div className="hidden print:block" id="print-modal-container">
          <div id="print-modal" className="p-4">
            {/* Print Header */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Curierul Perfect</h1>
              <p className="text-sm text-gray-600">Detalii Comandă - #{selectedOrder.orderNumber ? formatOrderNumber(selectedOrder.orderNumber) : ''}</p>
            </div>
            
            {/* Service & Status */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">{serviceNames[selectedOrder.serviciu] || selectedOrder.serviciu}</span>
              </div>
            </div>
            
            {/* Route */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Rută Transport</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-700 font-medium uppercase mb-1">Ridicare</p>
                  <p className="text-gray-900 font-medium">{getCountryName(selectedOrder.tara_ridicare)}</p>
                  <p className="text-gray-700 text-sm">{selectedOrder.judet_ridicare}, {selectedOrder.oras_ridicare}</p>
                  {selectedOrder.adresa_ridicare && <p className="text-gray-600 text-sm">{selectedOrder.adresa_ridicare}</p>}
                </div>
                <div>
                  <p className="text-xs text-orange-700 font-medium uppercase mb-1">Livrare</p>
                  <p className="text-gray-900 font-medium">{getCountryName(selectedOrder.tara_livrare)}</p>
                  <p className="text-gray-700 text-sm">{selectedOrder.judet_livrare}, {selectedOrder.oras_livrare}</p>
                  {selectedOrder.adresa_livrare && <p className="text-gray-600 text-sm">{selectedOrder.adresa_livrare}</p>}
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Detalii Transport</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {selectedOrder.greutate && (
                  <div>
                    <p className="text-gray-500 text-xs">Greutate</p>
                    <p className="text-gray-900 font-medium">{selectedOrder.greutate}{!selectedOrder.greutate.includes('kg') ? ' kg' : ''}</p>
                  </div>
                )}
                {(selectedOrder.lungime || selectedOrder.latime || selectedOrder.inaltime) && (
                  <div>
                    <p className="text-gray-500 text-xs">Dimensiuni</p>
                    <p className="text-gray-900 font-medium">{selectedOrder.lungime || '-'} × {selectedOrder.latime || '-'} × {selectedOrder.inaltime || '-'} cm</p>
                  </div>
                )}
                {selectedOrder.cantitate && (
                  <div>
                    <p className="text-gray-500 text-xs">
                      {selectedOrder.serviciu?.toLowerCase().trim() === 'persoane' ? 'Număr pasageri' : 'Cantitate'}
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedOrder.cantitate}
                      {selectedOrder.serviciu?.toLowerCase().trim() === 'persoane' ? ' persoane' : ''}
                    </p>
                  </div>
                )}
              </div>
              {selectedOrder.descriere && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-gray-500 text-xs">Descriere</p>
                  <p className="text-gray-700 text-sm">{selectedOrder.descriere}</p>
                </div>
              )}
            </div>
            
            {/* Options */}
            {selectedOrder.optiuni && selectedOrder.optiuni.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Opțiuni</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.optiuni.map((opt: string) => {
                    const optionLabels: Record<string, string> = {
                      'asigurare': 'Asigurare transport',
                      'incarcare_descarcare': 'Încărcare/Descărcare inclusă',
                      'montaj_demontaj': 'Montaj/Demontaj mobilier',
                      'ambalare': 'Ambalare profesională',
                      'ambalare_speciala': 'Ambalare specială electronice',
                      'frigo': 'Transport frigorific',
                      'bagaje_extra': 'Bagaje suplimentare',
                      'animale': 'Transport animale de companie',
                      'cusca_transport': 'Cușcă transport profesională',
                      'fragil': 'Manipulare fragil',
                      'express': 'Livrare express',
                      'temperatura_controlata': 'Temperatură controlată'
                    };
                    const label = optionLabels[opt] || opt;
                    return (
                      <span key={opt} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700 border border-gray-300">{label}</span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Contact */}
            {(selectedOrder.nume || selectedOrder.email || selectedOrder.telefon) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Date Contact</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {selectedOrder.nume && (
                    <div>
                      <p className="text-gray-500 text-xs">Nume</p>
                      <p className="text-gray-900 font-medium">{selectedOrder.nume}</p>
                    </div>
                  )}
                  {selectedOrder.email && (
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="text-gray-900">{selectedOrder.email}</p>
                    </div>
                  )}
                  {selectedOrder.telefon && (
                    <div>
                      <p className="text-gray-500 text-xs">Telefon</p>
                      <p className="text-gray-900 font-medium">{selectedOrder.telefon}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 mt-4 border-t border-gray-300">
              <p>Comandă creată la {selectedOrder.createdAt?.toDate?.()?.toLocaleDateString('ro-RO', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              }) || ''}</p>
              <p className="mt-2">© {new Date().getFullYear()} Curierul Perfect - www.curierulperfect.ro</p>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
