'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { logError } from '@/lib/errorMessages';
import { useEffect, useState, useMemo, useRef } from 'react';
import { ArrowLeftIcon, CloseIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import OrderChat from '@/components/orders/OrderChat';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatOrderNumber, formatClientName } from '@/utils/orderHelpers';
import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import { showSuccess, showWarning, showError } from '@/lib/toast';
import { countries, serviceTypes } from '@/lib/constants';
import { ServiceIcon, getServiceIconMetadata } from '@/components/icons/ServiceIcons';
import type { Order } from '@/types';

export default function ComenziCurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewedOrders, setViewedOrders] = useState<Set<string>>(new Set());
  const [expandedChatOrderId, setExpandedChatOrderId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  // Filters
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Custom dropdown states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Mark page as visited when loaded
  useEffect(() => {
    if (user) {
      localStorage.setItem('curier_comenzi_last_visit', Date.now().toString());
      
      // Load viewed orders from localStorage
      const storedViewed = localStorage.getItem(`curier_${user.uid}_viewed_orders`);
      if (storedViewed) {
        try {
          const viewedArray = JSON.parse(storedViewed);
          setViewedOrders(new Set(viewedArray));
        } catch (error) {
          console.error('Error loading viewed orders:', error);
        }
      }
    }
  }, [user]);

  // Load orders from Firebase (in production)
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      setLoadingOrders(true);
      try {
        // First, load courier's active services
        const userQuery = query(
          collection(db, 'users'),
          where('uid', '==', user.uid)
        );
        const userSnapshot = await getDocs(userQuery);
        let activeServices: string[] = [];
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          activeServices = userData.serviciiOferite || [];
        }
        
        // Query 1: Get all new orders (not assigned to any courier yet)
        const qNew = query(
          collection(db, 'comenzi'),
          where('status', '==', 'noua'),
          orderBy('createdAt', 'desc')
        );
        
        // Query 2: Get orders assigned to or accepted by this courier
        const qMine = query(
          collection(db, 'comenzi'),
          where('courierId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const [snapshotNew, snapshotMine] = await Promise.all([
          getDocs(qNew),
          getDocs(qMine)
        ]);
        
        const loadedOrders: Order[] = [];
        const orderIds = new Set<string>();
        
        // Add new orders (filter by active services)
        snapshotNew.forEach((doc) => {
          if (!orderIds.has(doc.id)) {
            const data = doc.data();
            const orderService = data.serviciu || data.tipColet || 'Colete';
            
            // Normalize service names for comparison (case-insensitive)
            const normalizedOrderService = orderService.toLowerCase().trim();
            const normalizedActiveServices = activeServices.map(s => s.toLowerCase().trim());
            
            // Only show orders for services the courier has activated
            if (activeServices.length === 0 || normalizedActiveServices.includes(normalizedOrderService)) {
              orderIds.add(doc.id);
              loadedOrders.push({
                id: doc.id,
                orderNumber: data.orderNumber,
                uid_client: data.uid_client,
                clientName: data.nume || data.clientName || 'Client',
                clientPhone: data.telefon || data.clientPhone || '',
                expeditorTara: data.tara_ridicare || data.expeditorTara || '',
                expeditorJudet: data.judet_ridicare || data.expeditorJudet || '',
                oras_ridicare: data.oras_ridicare || '',
                destinatarTara: data.tara_livrare || data.destinatarTara || '',
                destinatarJudet: data.judet_livrare || data.destinatarJudet || '',
                oras_livrare: data.oras_livrare || '',
                tipColet: orderService,
                greutate: String(data.greutate || ''),
                status: 'noua',
                dataColectare: data.data_ridicare || data.dataColectare || '',
                ora: data.ora_ridicare || data.ora || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                optiuni: data.optiuni || [],
                observatii: data.observatii || '',
              });
            }
          }
        });
        
        // Add courier's own orders
        snapshotMine.forEach((doc) => {
          if (!orderIds.has(doc.id)) {
            orderIds.add(doc.id);
            const data = doc.data();
            loadedOrders.push({
              id: doc.id,
              orderNumber: data.orderNumber,
              uid_client: data.uid_client,
              clientName: data.nume || data.clientName || 'Client',
              clientPhone: data.telefon || data.clientPhone || '',
              expeditorTara: data.tara_ridicare || data.expeditorTara || '',
              expeditorJudet: data.judet_ridicare || data.expeditorJudet || '',
              oras_ridicare: data.oras_ridicare || '',
              destinatarTara: data.tara_livrare || data.destinatarTara || '',
              destinatarJudet: data.judet_livrare || data.destinatarJudet || '',
              oras_livrare: data.oras_livrare || '',
              tipColet: data.serviciu || data.tipColet || 'Colete',
              greutate: String(data.greutate || ''),
              status: data.status || 'noua',
              dataColectare: data.data_ridicare || data.dataColectare || '',
              ora: data.ora_ridicare || data.ora || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              optiuni: data.optiuni || [],
              observatii: data.observatii || '',
            });
          }
        });
        
        if (loadedOrders.length > 0) {
          setOrders(loadedOrders);
        }
      } catch (error) {
        logError(error, 'Error loading orders for courier');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  // Listen for unread messages count
  useEffect(() => {
    if (!user || orders.length === 0) return;

    const unsubscribers: (() => void)[] = [];

    orders.forEach((order) => {
      if (!order.id || !order.uid_client) return;

      const messagesRef = collection(db, 'mesaje');
      const q = query(
        messagesRef,
        where('orderId', '==', order.id),
        where('clientId', '==', order.uid_client),
        where('courierId', '==', user.uid),
        where('read', '==', false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        // Filter out messages sent by current user (client-side filtering)
        const unreadCount = snapshot.docs.filter(doc => doc.data().senderId !== user.uid).length;
        setUnreadCounts((prev) => ({
          ...prev,
          [order.id!]: unreadCount,
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user, orders]);

  // Mark order as viewed
  const markOrderAsViewed = (orderId: string) => {
    if (!user || !orderId) return;
    
    const newViewedOrders = new Set(viewedOrders);
    newViewedOrders.add(orderId);
    setViewedOrders(newViewedOrders);
    
    // Save to localStorage
    localStorage.setItem(`curier_${user.uid}_viewed_orders`, JSON.stringify(Array.from(newViewedOrders)));
  };

  // Handle opening order details
  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    if (order.id) {
      markOrderAsViewed(order.id);
    }
  };

  // Finalize order (change status to 'livrata')
  const handleFinalizeOrder = async (orderId: string, status: string) => {
    if (!canFinalizeOrder(status)) {
      showWarning('Poți finaliza doar comenzile cu statusul "În Lucru"!');
      return;
    }
    
    const success = await transitionToFinalizata(orderId, status);
    if (success) {
      // Reload orders to reflect the change
      const loadOrders = async () => {
        if (!user) return;
        setLoadingOrders(true);
        try {
          const userQuery = query(
            collection(db, 'users'),
            where('uid', '==', user.uid)
          );
          const userSnapshot = await getDocs(userQuery);
          let activeServices: string[] = [];
          
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            activeServices = userData.serviciiOferite || [];
          }

          const ordersQuery = query(
            collection(db, 'comenzi'),
            orderBy('timestamp', 'desc')
          );
          
          const ordersSnapshot = await getDocs(ordersQuery);
          const allOrders: Order[] = [];
          
          ordersSnapshot.forEach((doc) => {
            const data = doc.data();
            allOrders.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date()
            } as Order);
          });

          const userServices = activeServices.map(s => s.toLowerCase().trim());
          const filtered = allOrders.filter(order => {
            const orderService = order.tipColet?.toLowerCase().trim() || '';
            return userServices.includes(orderService);
          });
          
          setOrders(filtered);
        } catch (error) {
          showError(error);
        } finally {
          setLoadingOrders(false);
        }
      };
      loadOrders();
    }
  };

  // Request review from client (placeholder - not yet implemented)
  const handleRequestReview = (_orderId: string) => {
    void _orderId; // Parameter reserved for future implementation
    // TODO: Implement actual notification system (email/push/in-app)
    // This will require:
    // 1. Email service integration (SendGrid/AWS SES)
    // 2. In-app notification collection in Firestore
    // 3. Client-side notification UI
    showWarning('Funcția de cerere recenzie va fi disponibilă în curând!');
  };

  // Apply all filters (optimized)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Country filter (checks both expeditor and destinatar)
      if (countryFilter !== 'all') {
        // Find the country code from the selected country name
        const selectedCountry = countries.find(c => c.name === countryFilter);
        const selectedCountryCode = selectedCountry?.code.toLowerCase();
        
        const orderExpeditorCode = (order.expeditorTara || '').toLowerCase().trim();
        const orderDestinatarCode = (order.destinatarTara || '').toLowerCase().trim();
        
        // Check if either expeditor or destinatar country matches
        if (selectedCountryCode && orderExpeditorCode !== selectedCountryCode && orderDestinatarCode !== selectedCountryCode) {
          return false;
        }
      }
      
      // Service filter
      if (serviceFilter !== 'all') {
        const normalizedServiceFilter = serviceFilter.toLowerCase().trim();
        const normalizedOrderService = (order.tipColet || '').toLowerCase().trim();
        
        if (normalizedOrderService !== normalizedServiceFilter) {
          return false;
        }
      }
      
      // Date filter
      if (dateFilter && order.dataColectare) {
        const inputDate = new Date(dateFilter);
        const orderDate = new Date(order.dataColectare);
        
        if (inputDate.toDateString() !== orderDate.toDateString()) {
          if (order.dataColectare !== dateFilter) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [orders, countryFilter, serviceFilter, dateFilter]);

  // Check if any filter is active
  const hasActiveFilters = countryFilter !== 'all' || serviceFilter !== 'all' || dateFilter !== '';

  const clearAllFilters = () => {
    setCountryFilter('all');
    setServiceFilter('all');
    setDateFilter('');
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-white/5 sticky top-0 z-70 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2 sm:p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-xl border border-orange-500/20">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Comenzile Mele</h1>
                <p className="text-xs text-gray-400 mt-0.5 sm:hidden">Gestionează comenzile tale</p>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Gestionează comenzile și livrările tale</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Filters */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 p-2 sm:p-3 mb-4 sm:mb-6 relative z-40">
          {/* Filters panel */}
          <div className="relative z-40">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {/* Country filter with flags */}
                <div ref={countryDropdownRef} className="relative z-40">
                  <label className="block text-xs text-gray-400 mb-1.5">Țară</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left text-sm"
                    >
                      {countryFilter !== 'all' ? (
                        <>
                          <Image
                            src={`/img/flag/${countries.find(c => c.name === countryFilter)?.code || 'ro'}.svg`}
                            alt={countryFilter}
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="flex-1 truncate">{countryFilter}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                          <span className="flex-1 text-gray-400">Toate țările</span>
                        </>
                      )}
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isCountryDropdownOpen && (
                      <div className="absolute z-200 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-2 border-b border-white/10">
                          <input
                            type="text"
                            placeholder="Caută țara..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto dropdown-scrollbar">
                          <button
                            type="button"
                            onClick={() => {
                              setCountryFilter('all');
                              setIsCountryDropdownOpen(false);
                              setCountrySearch('');
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors ${
                              countryFilter === 'all' ? 'bg-purple-500/20' : ''
                            }`}
                          >
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M2 12h20" />
                            </svg>
                            <span className="text-white text-sm">Toate țările</span>
                            {countryFilter === 'all' && (
                              <svg className="w-4 h-4 text-purple-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountryFilter(country.name);
                                setIsCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors ${
                                countryFilter === country.name ? 'bg-purple-500/20' : ''
                              }`}
                            >
                              <Image
                                src={`/img/flag/${country.code}.svg`}
                                alt={country.name}
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-white text-sm">{country.name}</span>
                              {countryFilter === country.name && (
                                <svg className="w-4 h-4 text-purple-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Service filter with icons */}
                <div ref={serviceDropdownRef} className="relative z-70">
                  <label className="block text-xs text-gray-400 mb-1.5">Tip serviciu</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left text-sm"
                    >
                      {serviceFilter !== 'all' ? (
                        <>
                          <div className={`p-1 rounded-lg ${serviceTypes.find(s => s.value === serviceFilter)?.bgColor}`}>
                            <ServiceIcon service={serviceFilter} className={`w-4 h-4 ${serviceTypes.find(s => s.value === serviceFilter)?.color}`} />
                          </div>
                          <span className="flex-1 truncate">{serviceTypes.find(s => s.value === serviceFilter)?.label}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                          </svg>
                          <span className="flex-1 text-gray-400">Toate serviciile</span>
                        </>
                      )}
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isServiceDropdownOpen && (
                      <div className="absolute z-200 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="max-h-72 overflow-y-auto dropdown-scrollbar">
                          <button
                            type="button"
                            onClick={() => {
                              setServiceFilter('all');
                              setIsServiceDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors border-b border-white/5 ${
                              serviceFilter === 'all' ? 'bg-purple-500/20' : ''
                            }`}
                          >
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            </svg>
                            <span className="text-white text-sm">Toate serviciile</span>
                            {serviceFilter === 'all' && (
                              <svg className="w-4 h-4 text-purple-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          {serviceTypes.map((service) => (
                            <button
                              key={service.value}
                              type="button"
                              onClick={() => {
                                setServiceFilter(service.value);
                                setIsServiceDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors border-b border-white/5 last:border-b-0 ${
                                serviceFilter === service.value ? 'bg-purple-500/20' : ''
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${service.bgColor}`}>
                                <ServiceIcon service={service.value} className={`w-4 h-4 ${service.color}`} />
                              </div>
                              <span className="text-white text-sm">{service.label}</span>
                              {serviceFilter === service.value && (
                                <svg className="w-4 h-4 text-purple-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Date filter */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Data colectare</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 scheme-dark"
                  />
                </div>
              </div>
              
              {/* Clear filters button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-3 px-4 py-2 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Resetează filtrele
                </button>
              )}
            </div>
        </div>

        {/* Orders List - Improved */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden relative z-10">
          {/* Header */}
          <div className="bg-slate-800/50 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                Lista Comenzilor
              </h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">
                    Filtrate
                  </span>
                )}
                <span className="text-xs sm:text-sm text-gray-500">
                  {filteredOrders.length} {filteredOrders.length !== orders.length && `din ${orders.length}`} comenzi
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-6">
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-300 text-base sm:text-lg font-semibold mb-1">
                {hasActiveFilters ? 'Nicio comandă găsită' : 'Nu ai nicio comandă'}
              </p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {hasActiveFilters
                  ? 'Încearcă să modifici filtrele pentru a vedea mai multe comenzi.' 
                  : 'Comenzile vor apărea aici când clienții plasează comenzi.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  Resetează filtrele
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const serviceTypeConfig = serviceTypes.find(s => s.value.toLowerCase() === (order.tipColet || 'colete').toLowerCase()) || serviceTypes[0];
                const isNewOrder = order.id && !viewedOrders.has(order.id);

                return (
                <div 
                  key={order.id} 
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div className={`relative w-12 h-12 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center shrink-0 ${serviceTypeConfig.color}`}>
                      <ServiceIcon service={order.tipColet || 'colete'} className="w-6 h-6" />
                      {/* New Badge on Icon */}
                      {isNewOrder && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 items-center justify-center">
                            <span className="text-white text-[9px] font-bold">N</span>
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
                              {serviceTypeConfig.label}
                            </h3>
                          </div>
                          {order.orderNumber && (
                            <p className="text-xs text-gray-400">
                              #{formatOrderNumber(order.orderNumber)}
                            </p>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() => setExpandedChatOrderId(expandedChatOrderId === order.id ? null : order.id || null)}
                            className={`relative px-3 py-2 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                              expandedChatOrderId === order.id 
                                ? 'bg-green-500/30 border-green-500/50 text-green-300 hover:bg-green-500/40' 
                                : order.id && unreadCounts[order.id] > 0
                                  ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30 animate-pulse'
                                  : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400'
                            }`}
                            title="Mesaje"
                          >
                            {order.id && unreadCounts[order.id] > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 items-center justify-center text-[10px] font-bold text-white">
                                  {unreadCounts[order.id]}
                                </span>
                              </span>
                            )}
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="hidden sm:inline">Mesaje</span>
                          </button>
                          <button
                            onClick={() => handleOpenOrder(order)}
                            className="px-3 py-2 sm:px-3 sm:py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-medium transition-all flex items-center gap-1.5"
                            title="Vezi detalii"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">Vezi</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Route */}
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = order.expeditorTara?.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={order.expeditorTara || 'RO'}
                            width={20} 
                            height={15} 
                            className="rounded"
                          />
                          <span className="text-gray-300">{order.expeditorJudet}, {order.oras_ridicare || order.expeditorJudet}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="flex items-center gap-1.5">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = order.destinatarTara?.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={order.destinatarTara || 'RO'}
                            width={20} 
                            height={15} 
                            className="rounded"
                          />
                          <span className="text-gray-300">{order.destinatarJudet}, {order.oras_livrare || order.destinatarJudet}</span>
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                        {/* Order creation date/time */}
                        {(order.timestamp || order.createdAt) && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {(() => {
                              const createdAt = order.createdAt as Date | { toDate: () => Date } | string | number | undefined;
                              const date = order.timestamp 
                                ? new Date(order.timestamp) 
                                : createdAt && typeof createdAt === 'object' && 'toDate' in createdAt
                                  ? createdAt.toDate() 
                                  : new Date(createdAt as string | number | Date);
                              const day = String(date.getDate()).padStart(2, '0');
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const year = date.getFullYear();
                              const hours = String(date.getHours()).padStart(2, '0');
                              const minutes = String(date.getMinutes()).padStart(2, '0');
                              return `${day}/${month}/${year} • ${hours}:${minutes}`;
                            })()}
                          </span>
                        )}
                        {/* Show different info based on service type */}
                        {order.tipColet === 'plicuri' ? (
                          <span>Plicuri: {order.cantitate || 1} buc</span>
                        ) : order.tipColet === 'persoane' ? (
                          <span>Pasageri: {order.cantitate || 1}</span>
                        ) : order.tipColet === 'masini' ? (
                          <span>Transport auto</span>
                        ) : order.greutate ? (
                          <span>Colet: {order.greutate}{String(order.greutate).includes('kg') ? '' : ' kg'}</span>
                        ) : order.cantitate ? (
                          <span>Cantitate: {order.cantitate}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Chat Section */}
                  {expandedChatOrderId === order.id && (
                    <div className="mt-4 border-t border-white/5 pt-4 animate-in slide-in-from-top-2 duration-200">
                      <OrderChat 
                        orderId={order.id || ''} 
                        orderNumber={order.orderNumber}
                        courierId={user?.uid}
                        clientId={order.uid_client}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm print:hidden"
              style={{ top: '72px' }}
              onClick={() => setSelectedOrder(null)}
            />
            
            {/* Modal Container */}
            <div id="print-modal-container" className="fixed inset-0 z-65 flex items-center justify-center p-4 print:p-0 print:static print:flex print:items-start" style={{ top: '72px' }} onClick={() => setSelectedOrder(null)}>
              {/* Modal */}
              <div id="print-modal" className="relative bg-slate-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden print:max-w-full print:max-h-full print:rounded-none print:border-0 print:shadow-none print:bg-white" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex items-center justify-between print:bg-white print:border-gray-300 print:static">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const serviceTypeConfig = serviceTypes.find(s => s.value.toLowerCase() === (selectedOrder.tipColet || 'colete').toLowerCase()) || serviceTypes[0];
                      return (
                        <div className={`w-10 h-10 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center ${serviceTypeConfig.color}`}>
                          <ServiceIcon service={selectedOrder.tipColet || 'colete'} className="w-6 h-6" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {serviceTypes.find(s => s.value.toLowerCase() === (selectedOrder.tipColet || 'colete').toLowerCase())?.label || selectedOrder.tipColet || 'Colete'}
                      </h2>
                      {(selectedOrder.orderNumber || selectedOrder.id) && (
                        <p className="text-xs text-gray-400">#{formatOrderNumber(selectedOrder.orderNumber || selectedOrder.id || 1)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                      title="Printează detalii comandă"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <CloseIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6 space-y-6 custom-scrollbar">
                  {/* Route Section */}
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Rută Transport</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-medium uppercase">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Ridicare
                        </div>
                        <div className="flex items-center gap-2">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = selectedOrder.expeditorTara?.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={selectedOrder.expeditorTara || 'RO'}
                            width={20}
                            height={15}
                            className="rounded"
                          />
                          <span className="text-white font-medium">
                            {(() => {
                              const country = selectedOrder.expeditorTara?.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.name || selectedOrder.expeditorTara || 'România';
                            })()}
                          </span>
                        </div>
                        {selectedOrder.oras_ridicare && (
                          <div>
                            <p className="text-xs text-gray-500">Oraș</p>
                            <p className="text-gray-300 font-medium">{selectedOrder.oras_ridicare}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500">Județ / Regiune</p>
                          <p className="text-gray-300 font-medium">{selectedOrder.expeditorJudet}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-400 text-xs font-medium uppercase">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Livrare
                        </div>
                        <div className="flex items-center gap-2">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = selectedOrder.destinatarTara?.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={selectedOrder.destinatarTara || 'RO'}
                            width={20}
                            height={15}
                            className="rounded"
                          />
                          <span className="text-white font-medium">
                            {(() => {
                              const country = selectedOrder.destinatarTara?.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.name || selectedOrder.destinatarTara || 'România';
                            })()}
                          </span>
                        </div>
                        {selectedOrder.oras_livrare && (
                          <div>
                            <p className="text-xs text-gray-500">Oraș</p>
                            <p className="text-gray-300 font-medium">{selectedOrder.oras_livrare}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500">Județ / Regiune</p>
                          <p className="text-gray-300 font-medium">{selectedOrder.destinatarJudet}</p>
                        </div>
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
                          <p className="text-white font-medium">{selectedOrder.greutate}{String(selectedOrder.greutate).includes('kg') ? '' : ' kg'}</p>
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
                          <p className="text-xs text-gray-500 mb-1">
                            {selectedOrder.serviciu?.toLowerCase().trim() === 'persoane' ? 'Număr pasageri' : 'Cantitate'}
                          </p>
                          <p className="text-white font-medium">
                            {selectedOrder.cantitate}
                            {selectedOrder.serviciu?.toLowerCase().trim() === 'persoane' ? ' persoane' : ''}
                          </p>
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
                  {selectedOrder.dataColectare && (
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Programare</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Data ridicare</p>
                          <p className="text-white font-medium">
                            {(() => {
                              const [y, m, d] = selectedOrder.dataColectare.split('-');
                              return `${d}/${m}/${y}`;
                            })()}
                            {selectedOrder.ora && ` • ${selectedOrder.ora}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  {selectedOrder.optiuni && selectedOrder.optiuni.length > 0 && (
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Opțiuni Suplimentare</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrder.optiuni.map((opt, idx) => {
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
                            <span key={idx} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/20">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Observații</h3>
                    <p className="text-gray-300 text-sm">{selectedOrder.observatii || 'Fără observații'}</p>
                  </div>

                  {/* Contact Info */}
                  {(selectedOrder.clientName || selectedOrder.clientPhone) && (
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Date Contact</h3>
                      <div className="space-y-3">
                        {selectedOrder.clientName && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500">Nume</p>
                              <p className="text-white font-medium truncate">{formatClientName(selectedOrder.clientName)}</p>
                            </div>
                          </div>
                        )}
                        {selectedOrder.clientPhone && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500">Telefon</p>
                              <p className="text-white font-medium">{selectedOrder.clientPhone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Chat Section */}
                  <div className="bg-slate-700/30 rounded-xl border border-white/5 overflow-hidden">
                    <OrderChat 
                      orderId={selectedOrder.id || ''} 
                      orderNumber={selectedOrder.orderNumber}
                      courierId={user?.uid}
                      clientId={selectedOrder.uid_client}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2 print:hidden">
                    {selectedOrder.status === 'in_lucru' && (
                      <button 
                        onClick={() => {
                          setSelectedOrder(null);
                          if (selectedOrder.id && selectedOrder.status) {
                            handleFinalizeOrder(selectedOrder.id, selectedOrder.status);
                          }
                        }}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-base rounded-xl font-medium transition-colors"
                      >
                        Finalizează comanda
                      </button>
                    )}
                    {selectedOrder.status === 'livrata' && (
                      <button 
                        onClick={() => {
                          setSelectedOrder(null);
                          if (selectedOrder.id) {
                            handleRequestReview(selectedOrder.id);
                          }
                        }}
                        className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-base rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        Cere recenzie
                      </button>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="text-center text-xs text-gray-500 pt-2">
                    Comandă creată la {(() => {
                      const date = selectedOrder.createdAt instanceof Date 
                        ? selectedOrder.createdAt 
                        : selectedOrder.createdAt?.toDate?.() || new Date();
                      return date.toLocaleDateString('ro-RO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Help Card - Same width as other sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8">
        <HelpCard />
      </div>
    </div>
  );
}
