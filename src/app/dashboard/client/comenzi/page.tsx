'use client';

import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PackageIcon } from '@/components/icons/DashboardIcons';
import ClientOrderFilters from '@/components/orders/client/filters/ClientOrderFilters';
import ClientOrderList from '@/components/orders/client/list/ClientOrderList';
import { useClientOrdersLoader } from '@/hooks/client/useClientOrdersLoader';
import { useClientOrderActions } from '@/hooks/client/useClientOrderActions';
import type { Order } from '@/types';

// Lazy load heavy components
const OrderDetailsModal = lazy(() => import('@/components/orders/shared/OrderDetailsModal'));
const HelpCard = lazy(() => import('@/components/HelpCard'));

// Wrapper component to handle Suspense for useSearchParams
export default function ComenziClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <ComenziClientContent />
    </Suspense>
  );
}

function ComenziClientContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countryFilter, setCountryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load filters from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('clientOrderFilter_country');
      const savedService = localStorage.getItem('clientOrderFilter_service');
      const savedSearch = localStorage.getItem('clientOrderFilter_search');
      const savedSort = localStorage.getItem('clientOrderFilter_sort');
      
      if (savedCountry) setCountryFilter(savedCountry);
      if (savedService) setServiceFilter(savedService);
      if (savedSearch) setSearchQuery(savedSearch);
      if (savedSort) setSortBy(savedSort);
    }
  }, []);

  // Save filters to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientOrderFilter_country', countryFilter);
    }
  }, [countryFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientOrderFilter_service', serviceFilter);
    }
  }, [serviceFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientOrderFilter_search', searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientOrderFilter_sort', sortBy);
    }
  }, [sortBy]);

  // Get orderId from URL params (for auto-expanding chat from recent messages click)
  const initialExpandedOrderId = searchParams.get('orderId');

  // Use custom hooks
  const { 
    orders, 
    loading: loadingOrders, 
    expandedChats, 
    toggleChat 
  } = useClientOrdersLoader({ 
    userId: user?.uid || '', 
    countryFilter, 
    serviceFilter,
    searchQuery,
    sortBy,
    initialExpandedOrderId 
  });
  
  const { handleDelete } = useClientOrderActions();

  // Check if any filter is active
  const hasActiveFilters = countryFilter !== 'all' || serviceFilter !== 'all' || searchQuery !== '';

  const clearAllFilters = useCallback(() => {
    setCountryFilter('all');
    setServiceFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/dashboard/client" 
              className="p-2 sm:p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/20">
                <PackageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Comenzile Tale</h1>
                <p className="text-xs text-gray-400 mt-0.5 sm:hidden">Urmărește coletele tale</p>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Urmărește și gestionează comenzile tale</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
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

        {/* Filters */}
        <ClientOrderFilters 
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
            <p className="text-gray-400 mb-6">
              {hasActiveFilters ? 'Nu există comenzi cu filtrele selectate' : 'Nu ai nici o comandă plasată încă'}
            </p>
            <Link
              href="/comanda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
            >
              <PackageIcon className="w-5 h-5" />
              Creează Prima Comandă
            </Link>
          </div>
        ) : (
          <ClientOrderList
            orders={orders}
            loading={loadingOrders}
            expandedChats={expandedChats}
            onToggleChat={toggleChat}
            onViewDetails={setSelectedOrder}
            onDelete={handleDelete}
          />
        )}

        {/* Order Details Modal - Lazy loaded */}
        {selectedOrder && (
          <Suspense fallback={<div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center"><div className="spinner" /></div>}>
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          </Suspense>
        )}
      </div>

      {/* Help Card - Lazy loaded */}
      <div className="relative z-0 max-w-7xl mx-auto px-3 sm:px-6 pb-4 sm:pb-8">
        <Suspense fallback={null}>
          <HelpCard />
        </Suspense>
      </div>
    </div>
  );
}
