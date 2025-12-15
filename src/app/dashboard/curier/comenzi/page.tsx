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
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatOrderNumber, formatClientName } from '@/utils/orderHelpers';
import { transitionToFinalizata, canFinalizeOrder } from '@/utils/orderStatusHelpers';
import { showSuccess, showWarning, showError } from '@/lib/toast';
import { countries, serviceTypes } from '@/lib/constants';

interface Order {
  id: string;
  orderNumber?: number;
  clientName: string;
  clientPhone: string;
  expeditorTara: string;
  expeditorJudet: string;
  oras_ridicare?: string;
  destinatarTara: string;
  destinatarJudet: string;
  oras_livrare?: string;
  tipColet: string;
  greutate: number;
  status: 'noua' | 'in_lucru' | 'livrata' | 'anulata';
  dataColectare: string;
  pret: number;
  createdAt: Date;
  // Optional fields
  valoare_marfa?: string;
  optiuni?: string[];
  observatii?: string;
}

const statusLabels: Record<Order['status'], { label: string; color: string; bg: string }> = {
  noua: { label: 'Nouă', color: 'text-white', bg: 'bg-white/10' },
  in_lucru: { label: 'În Lucru', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  livrata: { label: 'Livrată', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  anulata: { label: 'Anulată', color: 'text-gray-400', bg: 'bg-gray-500/20' },
};

// Service Icon component - Reusable with inline icon definitions
const ServiceIcon = ({ service, className = "w-5 h-5" }: { service: string; className?: string }) => {
  const iconMap: Record<string, React.JSX.Element> = {
    'Colete': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Plicuri': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Persoane': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    'Electronice': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Animale': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3.5-2c-.83 0-1.5.67-1.5 1.5S8.67 7 9.5 7s1.5-.67 1.5-1.5S10.33 4 9.5 4zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2.5 9c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    'Platforma': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="16" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="20" r="1" />
        <circle cx="16" cy="20" r="1" />
        <path d="M12 16V4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Tractari': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M5 17h-2a1 1 0 0 1-1-1v-5l3-3h14l3 3v5a1 1 0 0 1-1 1h-2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 17 6-6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m15 11 4 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Aeroport': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    ),
    'Mobila': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 18v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 18v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Paleti': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 6v12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return iconMap[service] || iconMap['Colete']; // Default to Colete icon
};

export default function ComenziCurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messageModalOrder, setMessageModalOrder] = useState<Order | null>(null);
  const [offerModalOrder, setOfferModalOrder] = useState<Order | null>(null);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerNotes, setOfferNotes] = useState<string>('');
  
  // Expanded orders state
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
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
                clientName: data.nume || data.clientName || 'Client',
                clientPhone: data.telefon || data.clientPhone || '',
                expeditorTara: data.tara_ridicare || data.expeditorTara || '',
                expeditorJudet: data.judet_ridicare || data.expeditorJudet || '',
                oras_ridicare: data.oras_ridicare || '',
                destinatarTara: data.tara_livrare || data.destinatarTara || '',
                destinatarJudet: data.judet_livrare || data.destinatarJudet || '',
                oras_livrare: data.oras_livrare || '',
                tipColet: orderService,
                greutate: parseFloat(data.greutate) || 0,
                status: 'noua',
                dataColectare: data.data_ridicare || data.dataColectare || '',
                pret: data.pret || 0,
                createdAt: data.createdAt?.toDate() || new Date(),
                valoare_marfa: data.valoare_marfa || '',
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
              clientName: data.nume || data.clientName || 'Client',
              clientPhone: data.telefon || data.clientPhone || '',
              expeditorTara: data.tara_ridicare || data.expeditorTara || '',
              expeditorJudet: data.judet_ridicare || data.expeditorJudet || '',
              oras_ridicare: data.oras_ridicare || '',
              destinatarTara: data.tara_livrare || data.destinatarTara || '',
              destinatarJudet: data.judet_livrare || data.destinatarJudet || '',
              oras_livrare: data.oras_livrare || '',
              tipColet: data.serviciu || data.tipColet || 'Colete',
              greutate: parseFloat(data.greutate) || 0,
              status: data.status || 'noua',
              dataColectare: data.data_ridicare || data.dataColectare || '',
              pret: data.pret || 0,
              createdAt: data.createdAt?.toDate() || new Date(),
              valoare_marfa: data.valoare_marfa || '',
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
      logError(error, 'Error updating order status');
      alert('Eroare la actualizare. Încearcă din nou.');
    }
  };

  // Toggle expand/collapse for order card
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
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

  // Request review from client
  const handleRequestReview = (_orderId: string) => {
    void _orderId; // Parameter reserved for future use (email/push notification)
    // In a real implementation, this would send a notification to the client
    // For now, we'll just show a success message
    showSuccess('Cerere de recenzie trimisă către client!');
    // Could also send email notification or push notification here
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
      if (dateFilter) {
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
      <div className="bg-slate-900/60 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
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
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 p-2 sm:p-3 mb-4 sm:mb-6 relative z-40">
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
                        <div className="max-h-60 overflow-y-auto">
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
                        <div className="max-h-72 overflow-y-auto">
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
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  {/* Mobile Layout - Optimized */}
                  <div className="sm:hidden space-y-2.5">
                    {/* Header Row: Order ID + Service + Weight */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/40 rounded-lg border border-white/10">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span className="text-gray-400 text-[10px] font-mono">#{formatOrderNumber(order.orderNumber || order.id)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <ServiceIcon service={order.tipColet} className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 text-[9px] font-semibold capitalize">{order.tipColet}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 4V2h10v2h3c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-.88l-1.62 12.16c-.07.54-.52.92-1.06.92H7.56c-.54 0-.99-.38-1.06-.92L4.88 9H4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h3zm2 0h6V2H9v2zm-3.5 5h13l-1.5 11h-10l-1.5-11z"/>
                          </svg>
                          <span className="text-blue-300 text-[9px] font-semibold">{order.greutate} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Route Section - Compact */}
                    <div className="p-2.5 bg-linear-to-br from-slate-800/40 to-slate-800/20 rounded-xl border border-white/10">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                        </svg>
                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Traseu Transport</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = order.expeditorTara.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={order.expeditorTara}
                            width={20}
                            height={15}
                            className="rounded shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-green-300 font-semibold text-xs truncate">{order.oras_ridicare || order.expeditorJudet}</p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <svg className="w-4 h-4 text-gray-500 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                          </svg>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = order.destinatarTara.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={order.destinatarTara}
                            width={20}
                            height={15}
                            className="rounded shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-orange-300 font-semibold text-xs truncate">{order.oras_livrare || order.destinatarJudet}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Client & Date Info */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span className="text-emerald-300 font-semibold text-[10px]">{formatClientName(order.clientName)}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="text-purple-300 text-[9px] font-semibold">
                          {order.createdAt ? order.createdAt.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleOrderExpand(order.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800/40 hover:bg-slate-800/60 rounded-lg border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300">
                        {expandedOrders.has(order.id) ? 'Ascunde detalii' : 'Vezi detalii'}
                      </span>
                      <svg 
                        className={`w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-transform ${expandedOrders.has(order.id) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {/* Package Details - Only show when expanded */}
                    {expandedOrders.has(order.id) && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-slate-800/30 rounded-lg border border-white/5">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <ServiceIcon service={order.tipColet} className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[9px] font-semibold text-gray-400 uppercase">Serviciu</span>
                          </div>
                          <p className="text-xs font-bold text-white capitalize">{order.tipColet}</p>
                        </div>
                        <div className="p-2.5 bg-slate-800/30 rounded-lg border border-white/5">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                            <span className="text-[9px] font-semibold text-gray-400 uppercase">Greutate</span>
                          </div>
                          <p className="text-lg font-bold text-white">{order.greutate} <span className="text-xs text-gray-400">kg</span></p>
                        </div>
                        <div className="p-2.5 bg-slate-800/30 rounded-lg border border-white/5">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span className="text-[9px] font-semibold text-gray-400 uppercase">Data</span>
                          </div>
                          <p className="text-xs font-semibold text-white truncate">
                            {order.dataColectare ? order.dataColectare : <span className="text-blue-400">Flexibil</span>}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Extra Services & Instructions */}
                    {expandedOrders.has(order.id) && ((order.optiuni && order.optiuni.length > 0) || order.observatii) && (
                      <div className="space-y-2.5">
                        {order.optiuni && order.optiuni.length > 0 && (
                          <div className="p-3 bg-slate-800/20 rounded-xl border border-white/5">
                            <div className="flex items-center gap-1.5 mb-2">
                              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                              </svg>
                              <span className="text-[9px] font-semibold text-gray-300 uppercase tracking-wide">Servicii Extra</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {order.optiuni.map((opt, idx) => {
                                const optionConfig = {
                                  asigurare: { 
                                    label: 'Asigurare completă', 
                                    color: 'emerald',
                                    icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                  },
                                  tracking: { 
                                    label: 'Tracking GPS', 
                                    color: 'blue',
                                    icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                                  },
                                  semnatura: { 
                                    label: 'Semnătură livrare', 
                                    color: 'purple',
                                    icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                                  }
                                };
                                const config = optionConfig[opt as keyof typeof optionConfig] || { label: opt, color: 'gray', icon: null };
                                return (
                                  <span key={idx} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-${config.color}-500/10 border border-${config.color}-500/30 rounded-lg text-[10px] text-${config.color}-300 font-medium`}>
                                    {config.icon}
                                    {config.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {order.observatii && (
                          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-blue-400 text-[9px] font-semibold uppercase tracking-wide mb-1">Instrucțiuni Speciale</p>
                                <p className="text-gray-200 text-xs leading-relaxed">{order.observatii}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleOrderExpand(order.id)}
                      className="w-full py-2.5 px-3 bg-slate-800/30 hover:bg-slate-800/50 border border-white/5 rounded-lg text-gray-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
                    >
                      {expandedOrders.has(order.id) ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 15l7-7 7 7"/>
                          </svg>
                          Ascunde Detalii
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7"/>
                          </svg>
                          Vezi Mai Multe Detalii
                        </>
                      )}
                    </button>

                    {/* Action Buttons - Full Width */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold text-xs transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Trimite Ofertă
                      </button>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold text-xs transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Mesaj
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout - Optimized 2-Column Grid */}
                  <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
                    {/* Left Column - Main Info (2/3 width) */}
                    <div className="col-span-2 space-y-4">
                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleOrderExpand(order.id)}
                        className="w-full flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/60 rounded-lg border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-300">
                          {expandedOrders.has(order.id) ? 'Ascunde detalii' : 'Vezi toate detaliile'}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-transform ${expandedOrders.has(order.id) ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>

                      {/* Header: Order ID, Service & Weight */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/30 rounded-lg border border-white/5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          <span className="text-gray-400 text-sm font-mono">#{formatOrderNumber(order.orderNumber || order.id)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <ServiceIcon service={order.tipColet} className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 text-xs font-semibold capitalize">{order.tipColet}</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7 4V2h10v2h3c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1h-.88l-1.62 12.16c-.07.54-.52.92-1.06.92H7.56c-.54 0-.99-.38-1.06-.92L4.88 9H4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h3zm2 0h6V2H9v2zm-3.5 5h13l-1.5 11h-10l-1.5-11z"/>
                            </svg>
                            <span className="text-blue-300 text-xs font-semibold">{order.greutate} kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Route Section - Vertical Stacked */}
                      <div className="p-4 bg-linear-to-br from-slate-800/40 to-slate-800/20 rounded-xl border border-white/10 space-y-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                          </svg>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Traseu Transport</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = order.expeditorTara.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={order.expeditorTara}
                            width={24}
                            height={18}
                            className="rounded shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-green-400/70 font-medium uppercase">Oraș/localitate</p>
                            <p className="text-green-300 font-semibold text-sm truncate">{order.oras_ridicare || order.expeditorJudet}</p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <svg className="w-6 h-6 text-gray-500 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                          </svg>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <Image 
                            src={`/img/flag/${(() => {
                              const country = order.destinatarTara.toLowerCase().trim();
                              const matched = countries.find(c => 
                                c.name.toLowerCase() === country || 
                                c.code.toLowerCase() === country
                              );
                              return matched?.code || 'ro';
                            })()}.svg`}
                            alt={order.destinatarTara}
                            width={24}
                            height={18}
                            className="rounded shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-orange-400/70 font-medium uppercase">Oraș/localitate</p>
                            <p className="text-orange-300 font-semibold text-sm truncate">{order.oras_livrare || order.destinatarJudet}</p>
                          </div>
                        </div>
                      </div>

                      {/* Client & Date Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          <span className="text-emerald-300 font-semibold text-sm">{formatClientName(order.clientName)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span className="text-purple-300 text-xs font-semibold">
                            {order.createdAt ? order.createdAt.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Package Details - Only show when expanded */}
                      {expandedOrders.has(order.id) && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <ServiceIcon service={order.tipColet} className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-semibold text-gray-400 uppercase">Serviciu</span>
                            </div>
                            <p className="text-base font-bold text-white capitalize">{order.tipColet}</p>
                          </div>
                          <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                              </svg>
                              <span className="text-xs font-semibold text-gray-400 uppercase">Greutate Colet</span>
                            </div>
                            <p className="text-xl font-bold text-white">{order.greutate} <span className="text-sm text-gray-400">kg</span></p>
                          </div>
                          <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                              <span className="text-xs font-semibold text-gray-400 uppercase">Data Colectare</span>
                            </div>
                            <p className="text-base font-semibold text-white">
                              {order.dataColectare ? order.dataColectare : <span className="text-blue-400">Flexibil</span>}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Extra Services & Instructions */}
                      {expandedOrders.has(order.id) && ((order.optiuni && order.optiuni.length > 0) || order.observatii) && (
                        <div className="space-y-3">
                          {order.optiuni && order.optiuni.length > 0 && (
                            <div className="p-4 bg-slate-800/20 rounded-xl border border-white/5">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                </svg>
                                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Servicii Suplimentare Solicitate</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {order.optiuni.map((opt, idx) => {
                                  const optionConfig = {
                                    asigurare: { 
                                      label: 'Asigurare completă transport', 
                                      color: 'emerald',
                                      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    },
                                    tracking: { 
                                      label: 'Tracking GPS în timp real', 
                                      color: 'blue',
                                      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    },
                                    semnatura: { 
                                      label: 'Semnătură și confirmare la livrare', 
                                      color: 'purple',
                                      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                                    }
                                  };
                                  const config = optionConfig[opt as keyof typeof optionConfig] || { label: opt, color: 'gray', icon: null };
                                  return (
                                    <span key={idx} className={`inline-flex items-center gap-2 px-3 py-2 bg-${config.color}-500/10 border border-${config.color}-500/30 rounded-lg text-sm text-${config.color}-300 font-medium`}>
                                      {config.icon}
                                      {config.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {order.observatii && (
                            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-2">Instrucțiuni Speciale de la Client</p>
                                  <p className="text-gray-200 text-sm leading-relaxed">{order.observatii}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Column - Actions & Quick Info (1/3 width) */}
                    <div className="space-y-4">
                      {/* Action Buttons - Prominent */}
                      <div className="space-y-3 p-4 bg-linear-to-br from-slate-800/50 to-slate-800/30 rounded-xl border border-white/10">
                        <button 
                          onClick={() => {
                            setOfferModalOrder(order);
                            setOfferPrice(order.pret.toString());
                            setOfferNotes('');
                          }}
                          className="w-full px-4 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 group"
                        >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Trimite Ofertă
                        </button>
                        <button 
                          onClick={() => setMessageModalOrder(order)}
                          className="w-full px-4 py-3.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group"
                        >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                          </svg>
                          Trimite Mesaj
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Detalii Comandă #{formatOrderNumber(selectedOrder.orderNumber || selectedOrder.id)}</h2>
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
                    <p className="text-white font-medium text-sm sm:text-base">{formatClientName(selectedOrder.clientName)}</p>
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
                        onClick={() => handleStatusChange(selectedOrder.id, 'anulata')}
                        className="flex-1 py-2.5 sm:py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm sm:text-base rounded-xl font-medium transition-colors"
                      >
                        Refuză
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'in_lucru' && (
                    <>
                      <button 
                        onClick={() => handleFinalizeOrder(selectedOrder.id, selectedOrder.status)}
                        className="flex-1 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base rounded-xl font-medium transition-colors"
                      >
                        Finalizează comanda
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'livrata' && (
                    <button 
                      onClick={() => handleRequestReview(selectedOrder.id)}
                      className="flex-1 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Cere recenzie de la client
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModalOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Trimite Mesaj Client</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">Comandă #{formatOrderNumber(messageModalOrder.orderNumber || messageModalOrder.id)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMessageModalOrder(null)}
                  className="text-gray-400 hover:text-white p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Order Info Summary */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-4 sm:p-5 border border-white/10 mb-4 sm:mb-6">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informații Comandă
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Client</p>
                    <p className="text-white font-medium text-sm">{formatClientName(messageModalOrder.clientName)}</p>
                    <p className="text-blue-400 text-xs mt-1">{messageModalOrder.clientPhone}</p>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Traseu</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-400">📍 {messageModalOrder.expeditorJudet}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-orange-400">📍 {messageModalOrder.destinatarJudet}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{messageModalOrder.expeditorTara.toUpperCase()}</span>
                      <span>→</span>
                      <span>{messageModalOrder.destinatarTara.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Serviciu</p>
                    <div className="flex items-center gap-2">
                      <ServiceIcon service={messageModalOrder.tipColet} className="w-4 h-4 text-blue-400" />
                      <p className="text-white font-medium text-sm">{messageModalOrder.tipColet}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{messageModalOrder.greutate} kg</p>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Data Colectare</p>
                    <p className="text-white font-medium text-sm">{messageModalOrder.dataColectare}</p>
                    <p className="text-green-400 text-xs mt-1 font-semibold">{messageModalOrder.pret} €</p>
                  </div>
                </div>

                {messageModalOrder.optiuni && messageModalOrder.optiuni.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-500 text-xs mb-2">Opțiuni suplimentare:</p>
                    <div className="flex flex-wrap gap-2">
                      {messageModalOrder.optiuni.map((opt, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {messageModalOrder.observatii && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-500 text-xs mb-1">Observații client:</p>
                    <p className="text-gray-300 text-xs italic">{messageModalOrder.observatii}</p>
                  </div>
                )}
              </div>

              {/* Contact Methods */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-3">Alege metoda de contact:</h3>
                
                <a
                  href={`https://wa.me/${messageModalOrder.clientPhone.replace(/[^0-9+]/g, '')}?text=Bună ziua! Sunt curier de la Curierul Perfect. Am văzut comanda dumneavoastră #${formatOrderNumber(messageModalOrder.orderNumber || messageModalOrder.id)} și aș dori să discut detaliile transportului.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-linear-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border-2 border-green-500/30 hover:border-green-500/50 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm sm:text-base">WhatsApp</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Trimite mesaj direct pe WhatsApp</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href={`tel:${messageModalOrder.clientPhone}`}
                  className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm sm:text-base">Apel Telefonic</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{messageModalOrder.clientPhone}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Offer Modal */}
        {offerModalOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-5 sm:p-8 max-w-4xl w-full border border-white/10 my-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Trimite Ofertă Transport</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">Comandă #{formatOrderNumber(offerModalOrder.orderNumber || offerModalOrder.id)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setOfferModalOrder(null);
                    setOfferPrice('');
                    setOfferNotes('');
                  }}
                  className="text-gray-400 hover:text-white p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Order Info Summary */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-4 sm:p-5 border border-white/10 mb-4 sm:mb-6">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Detalii Comandă
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Client</p>
                    <p className="text-white font-medium text-sm">{formatClientName(offerModalOrder.clientName)}</p>
                    <p className="text-orange-400 text-xs mt-1">{offerModalOrder.clientPhone}</p>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Traseu</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-400">📍 {offerModalOrder.expeditorJudet}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-orange-400">📍 {offerModalOrder.destinatarJudet}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{offerModalOrder.expeditorTara.toUpperCase()}</span>
                      <span>→</span>
                      <span>{offerModalOrder.destinatarTara.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Serviciu</p>
                    <div className="flex items-center gap-2">
                      <ServiceIcon service={offerModalOrder.tipColet} className="w-4 h-4 text-orange-400" />
                      <p className="text-white font-medium text-sm">{offerModalOrder.tipColet}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{offerModalOrder.greutate} kg</p>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Data Colectare</p>
                    <p className="text-white font-medium text-sm">{offerModalOrder.dataColectare}</p>
                    <p className="text-gray-400 text-xs mt-1">Preț inițial: {offerModalOrder.pret} €</p>
                  </div>
                </div>

                {offerModalOrder.optiuni && offerModalOrder.optiuni.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-500 text-xs mb-2">Opțiuni suplimentare solicitate:</p>
                    <div className="flex flex-wrap gap-2">
                      {offerModalOrder.optiuni.map((opt, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {offerModalOrder.observatii && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-500 text-xs mb-1">Observații client:</p>
                    <p className="text-gray-300 text-xs italic">{offerModalOrder.observatii}</p>
                  </div>
                )}
              </div>

              {/* Offer Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    Prețul Tău (EUR) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Introdu prețul"
                      className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Propune un preț competitiv pentru a atrage clientul</p>
                </div>

                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    Notițe / Detalii ofertă (opțional)
                  </label>
                  <textarea
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    placeholder="Ex: Pot ridica în următoarele 2 zile, am experiență cu transporturi fragile, asigurare inclusă..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none"
                    rows={4}
                  />
                  <p className="text-gray-500 text-xs mt-1">Adaugă detalii care îți fac oferta mai atractivă</p>
                </div>

                {/* Send Offer Actions */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-white font-semibold text-sm mb-3">Trimite oferta prin:</h3>
                  
                  <a
                    href={`https://wa.me/${offerModalOrder.clientPhone.replace(/[^0-9+]/g, '')}?text=Bună ziua! Sunt curier de la Curierul Perfect.%0A%0A✅ Ofertă pentru comanda %23${formatOrderNumber(offerModalOrder.orderNumber || offerModalOrder.id)}%0A%0A📦 Traseu: ${offerModalOrder.expeditorJudet} (${offerModalOrder.expeditorTara.toUpperCase()}) → ${offerModalOrder.destinatarJudet} (${offerModalOrder.destinatarTara.toUpperCase()})%0A%0A💰 Prețul meu: ${offerPrice} EUR%0A%0A${offerNotes ? `📝 Detalii: ${offerNotes}%0A%0A` : ''}Vă rog să-mi confirmați dacă sunteți interesat. Mulțumesc!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (!offerPrice || parseFloat(offerPrice) <= 0) {
                        alert('Te rog introdu un preț valid pentru ofertă!');
                        return;
                      }
                    }}
                    className="flex items-center gap-3 p-4 bg-linear-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border-2 border-green-500/30 hover:border-green-500/50 rounded-xl transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm sm:text-base">WhatsApp</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Trimite oferta pe WhatsApp</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <button
                    onClick={() => {
                      if (!offerPrice || parseFloat(offerPrice) <= 0) {
                        alert('Te rog introdu un preț valid pentru ofertă!');
                        return;
                      }
                      const phoneNumber = offerModalOrder.clientPhone;
                      const message = `Bună ziua! Sunt curier de la Curierul Perfect.\n\n✅ Ofertă pentru comanda #${formatOrderNumber(offerModalOrder.orderNumber || offerModalOrder.id)}\n\n📦 Traseu: ${offerModalOrder.expeditorJudet} (${offerModalOrder.expeditorTara.toUpperCase()}) → ${offerModalOrder.destinatarJudet} (${offerModalOrder.destinatarTara.toUpperCase()})\n\n💰 Prețul meu: ${offerPrice} EUR\n\n${offerNotes ? `📝 Detalii: ${offerNotes}\n\n` : ''}Vă rog să-mi confirmați dacă sunteți interesat. Mulțumesc!`;
                      
                      // Copy to clipboard and show call option
                      navigator.clipboard.writeText(message).then(() => {
                        alert('Oferta a fost copiată în clipboard! Poți să suni clientul și să citești oferta.');
                        window.location.href = `tel:${phoneNumber}`;
                      });
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-linear-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border-2 border-orange-500/30 hover:border-orange-500/50 rounded-xl transition-all group"
                  >
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold text-sm sm:text-base">Apel Telefonic</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Copiază oferta și sună clientul</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Card - Same width as other sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8">
        <HelpCard />
      </div>
    </div>
  );
}
