'use client';

import { Suspense, lazy } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { logError } from '@/lib/errorMessages';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import OrderFilters from '@/components/orders/courier/filters/OrderFilters';
import OrderList from '@/components/orders/courier/list/OrderList';
import { useOrdersLoader } from '@/hooks/courier/useOrdersLoader';
import { useUnreadMessages } from '@/hooks/courier/useUnreadMessages';
import { useOrderHandlers } from '@/hooks/courier/useOrderHandlers';
import type { Order } from '@/types';

// Lazy load heavy components
const OrderDetailsModal = lazy(() => import('@/components/orders/shared/OrderDetailsModal'));
const HelpCard = lazy(() => import('@/components/HelpCard'));

// Wrapper component to handle Suspense for useSearchParams
export default function ComenziCurierPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <ComenziCurierContent />
    </Suspense>
  );
}

function ComenziCurierContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Filters - initialize from localStorage first, then URL params, then default
  const [countryFilter, setCountryFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('courierOrderFilter_country') || searchParams.get('country') || 'all';
    }
    return searchParams.get('country') || 'all';
  });
  const [serviceFilter, setServiceFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('courierOrderFilter_service') || searchParams.get('service') || 'all';
    }
    return searchParams.get('service') || 'all';
  });
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('courierOrderFilter_search') || searchParams.get('search') || '';
    }
    return searchParams.get('search') || '';
  });
  const [sortBy, setSortBy] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('courierOrderFilter_sort') || searchParams.get('sort') || 'newest';
    }
    return searchParams.get('sort') || 'newest';
  });
  
  // Save filters to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courierOrderFilter_country', countryFilter);
    }
  }, [countryFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courierOrderFilter_service', serviceFilter);
    }
  }, [serviceFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courierOrderFilter_search', searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courierOrderFilter_sort', sortBy);
    }
  }, [sortBy]);
  
  // Use custom hooks with filter options
  const { orders, loading: loadingOrders, reload: reloadOrders } = useOrdersLoader(user?.uid, {
    countryFilter: countryFilter === 'all' ? '' : countryFilter,
    serviceFilter: serviceFilter === 'all' ? '' : serviceFilter,
    searchQuery,
    sortBy
  });
  const unreadCounts = useUnreadMessages(user?.uid, orders);
  const { handleFinalizeOrder, handleRequestReview, handleDismissOrder } = useOrderHandlers(reloadOrders);
  
  // Local UI state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewedOrders, setViewedOrders] = useState<Set<string>>(new Set());
  const [expandedChatOrderId, setExpandedChatOrderId] = useState<string | null>(null);

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    
    // Update or remove country param
    if (countryFilter !== 'all') {
      params.set('country', countryFilter);
    } else {
      params.delete('country');
    }
    
    // Update or remove service param
    if (serviceFilter !== 'all') {
      params.set('service', serviceFilter);
    } else {
      params.delete('service');
    }
    
    // Update or remove search param
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    
    // Update or remove sort param
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    
    // Update URL without causing navigation
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [countryFilter, serviceFilter, searchQuery, sortBy]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Auto-expand chat when orderId is in URL params (from recent messages click)
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId && !loadingOrders && orders.length > 0) {
      // Check if order exists in the list
      const orderExists = orders.some(o => o.id === orderId);
      if (orderExists) {
        setExpandedChatOrderId(orderId);
        // Scroll to the order after a short delay to ensure DOM is ready
        setTimeout(() => {
          const orderElement = document.getElementById(`order-${orderId}`);
          if (orderElement) {
            orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams, orders, loadingOrders]);

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
          logError(error, 'Error loading viewed orders');
        }
      }
    }
  }, [user]);



  // Mark order as viewed - memoized
  const markOrderAsViewed = useCallback((orderId: string) => {
    if (!user || !orderId) return;
    
    setViewedOrders(prev => {
      const newViewedOrders = new Set(prev);
      newViewedOrders.add(orderId);
      // Save to localStorage
      localStorage.setItem(`curier_${user.uid}_viewed_orders`, JSON.stringify(Array.from(newViewedOrders)));
      return newViewedOrders;
    });
  }, [user]);

  // Check if any filter is active
  const hasActiveFilters = countryFilter !== 'all' || serviceFilter !== 'all' || searchQuery.trim() !== '' || sortBy !== 'newest';

  // Memoized clear filters
  const clearAllFilters = useCallback(() => {
    setCountryFilter('all');
    setServiceFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  }, []);

  // Memoized toggle chat handler - also marks order as viewed
  const handleToggleChat = useCallback((orderId: string | null) => {
    setExpandedChatOrderId(orderId);
    // Mark order as viewed when opening chat
    if (orderId) {
      markOrderAsViewed(orderId);
    }
  }, [markOrderAsViewed]);

  // Memoized view details handler - marks order as viewed
  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    if (order.id) {
      markOrderAsViewed(order.id);
    }
  }, [markOrderAsViewed]);

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
      <div className="bg-slate-900/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-xl border border-orange-500/20">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-2xl font-bold text-white">Comenzile Mele</h1>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Gestioneaza comenzile tale</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-3 sm:py-8">
        {/* Filters */}
        <OrderFilters
          countryFilter={countryFilter}
          serviceFilter={serviceFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCountryChange={setCountryFilter}
          onServiceChange={setServiceFilter}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />

        {/* Orders List */}
        <OrderList
          orders={orders}
          filteredOrders={orders}
          viewedOrders={viewedOrders}
          expandedChatOrderId={expandedChatOrderId}
          unreadCounts={unreadCounts}
          hasActiveFilters={hasActiveFilters}
          loadingOrders={loadingOrders}
          currentUserId={user?.uid}
          onToggleChat={handleToggleChat}
          onViewDetails={handleViewDetails}
          onDismissOrder={handleDismissOrder}
          onClearFilters={clearAllFilters}
        />

        {/* Order Details Modal - Lazy loaded */}
        {selectedOrder && (
          <Suspense fallback={<div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center"><div className="spinner" /></div>}>
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onFinalize={
                selectedOrder.status === 'in_lucru' && selectedOrder.id && selectedOrder.status
                  ? () => handleFinalizeOrder(selectedOrder.id!, selectedOrder.status!)
                  : undefined
              }
              onRequestReview={
                selectedOrder.status === 'livrata' && selectedOrder.id
                  ? () => handleRequestReview(selectedOrder.id!)
                  : undefined
              }
            />
          </Suspense>
        )}
      </div>

      {/* Help Card - Lazy loaded */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 pb-3 sm:pb-8">
        <Suspense fallback={null}>
          <HelpCard />
        </Suspense>
      </div>
    </div>
  );
}
