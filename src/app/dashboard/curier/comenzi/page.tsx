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
import { countries, serviceTypes, orderStatusConfig } from '@/lib/constants';

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
  titlu?: string;
  ora?: string;
}

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
                orderNumber: data.orderNumber,
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
                ora: data.ora_ridicare || data.ora || '',
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
              orderNumber: data.orderNumber,
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
              ora: data.ora_ridicare || data.ora || '',
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
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const serviceTypeConfig = serviceTypes.find(s => s.value.toLowerCase() === order.tipColet.toLowerCase()) || serviceTypes[0];

                return (
                <div 
                  key={order.id} 
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div className={`relative w-12 h-12 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center shrink-0`}>
                      <ServiceIcon service={order.tipColet} className={`w-6 h-6 ${serviceTypeConfig.color}`} />
                    </div>
                    
                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">
                              {order.tipColet}
                            </h3>
                            <span className={`px-2 py-0.5 ${orderStatusConfig[order.status as keyof typeof orderStatusConfig]?.bg || 'bg-gray-500/20'} ${orderStatusConfig[order.status as keyof typeof orderStatusConfig]?.border || 'border-gray-500/30'} border ${orderStatusConfig[order.status as keyof typeof orderStatusConfig]?.color || 'text-gray-400'} text-xs font-medium rounded-full`}>
                              {orderStatusConfig[order.status as keyof typeof orderStatusConfig]?.label || order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            #{formatOrderNumber(order.orderNumber || order.id)}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-medium transition-all flex items-center gap-1.5"
                            title="Vezi detalii"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">Detalii</span>
                          </button>
                          {order.status === 'in_lucru' && (
                            <button
                              onClick={() => handleFinalizeOrder(order.id, order.status)}
                              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-xs font-medium transition-all flex items-center gap-1.5"
                              title="Finalizează"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="hidden sm:inline">Finalizează</span>
                            </button>
                          )}
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
                          <span className="text-gray-300">{order.expeditorJudet}</span>
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
                          <span className="text-gray-300">{order.destinatarJudet}</span>
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                        {order.greutate && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                            </svg>
                            {order.greutate} kg
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {order.dataColectare}
                        </span>
                        {order.ora && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {order.ora}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
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
                  <span className={`px-3 py-1 rounded-full text-sm ${orderStatusConfig[selectedOrder.status].bg} ${orderStatusConfig[selectedOrder.status].color}`}>
                    {orderStatusConfig[selectedOrder.status].label}
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
      </div>

      {/* Help Card - Same width as other sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8">
        <HelpCard />
      </div>
    </div>
  );
}
