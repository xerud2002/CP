'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { logError } from '@/lib/errorMessages';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import OrderFilters from '@/components/orders/courier/filters/OrderFilters';
import OrderList from '@/components/orders/courier/list/OrderList';
import OrderDetailsModal from '@/components/orders/courier/details/OrderDetailsModal';
import { useOrdersLoader } from '@/hooks/courier/useOrdersLoader';
import { useUnreadMessages } from '@/hooks/courier/useUnreadMessages';
import { useOrderHandlers } from '@/hooks/courier/useOrderHandlers';
import { countries } from '@/lib/constants';
import type { Order } from '@/types';

export default function ComenziCurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Use custom hooks
  const { orders, loading: loadingOrders, reload: reloadOrders } = useOrdersLoader(user?.uid);
  const unreadCounts = useUnreadMessages(user?.uid, orders);
  const { handleFinalizeOrder, handleRequestReview } = useOrderHandlers(reloadOrders);
  
  // Local UI state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewedOrders, setViewedOrders] = useState<Set<string>>(new Set());
  const [expandedChatOrderId, setExpandedChatOrderId] = useState<string | null>(null);
  
  // Filters
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

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
          logError(error, 'Error loading viewed orders');
        }
      }
    }
  }, [user]);



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

  // Apply all filters (optimized)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Country filter (checks both expeditor and destinatar)
      if (countryFilter !== 'all') {
        // countryFilter is already a country code (GB, RO, IT, etc.)
        const selectedCountryCode = countryFilter.toLowerCase();
        
        const orderExpeditorCode = (order.expeditorTara || '').toLowerCase().trim();
        const orderDestinatarCode = (order.destinatarTara || '').toLowerCase().trim();
        
        // Check if either expeditor or destinatar country matches
        if (orderExpeditorCode !== selectedCountryCode && orderDestinatarCode !== selectedCountryCode) {
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
      
      return true;
    });
  }, [orders, countryFilter, serviceFilter]);

  // Check if any filter is active
  const hasActiveFilters = countryFilter !== 'all' || serviceFilter !== 'all';

  const clearAllFilters = () => {
    setCountryFilter('all');
    setServiceFilter('all');
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
      <div className="bg-slate-900/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl shadow-lg">
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
        <OrderFilters
          countryFilter={countryFilter}
          serviceFilter={serviceFilter}
          onCountryChange={setCountryFilter}
          onServiceChange={setServiceFilter}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />

        {/* Orders List */}
        <OrderList
          orders={orders}
          filteredOrders={filteredOrders}
          viewedOrders={viewedOrders}
          expandedChatOrderId={expandedChatOrderId}
          unreadCounts={unreadCounts}
          hasActiveFilters={hasActiveFilters}
          loadingOrders={loadingOrders}
          currentUserId={user?.uid}
          onToggleChat={setExpandedChatOrderId}
          onViewDetails={handleOpenOrder}
          onClearFilters={clearAllFilters}
        />

        {/* Order Details Modal */}
        {selectedOrder && (
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
        )}
      </div>

      {/* Help Card - Same width as other sections */}
      <div className="relative z-0 max-w-7xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8">
        <HelpCard />
      </div>
    </div>
  );
}
