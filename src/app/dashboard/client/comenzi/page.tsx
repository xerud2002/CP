'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PackageIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import OrderDetailsModal from '@/components/orders/shared/OrderDetailsModal';
import ClientOrderFilters from '@/components/orders/client/filters/ClientOrderFilters';
import ClientOrderList from '@/components/orders/client/list/ClientOrderList';
import { useClientOrdersLoader } from '@/hooks/client/useClientOrdersLoader';
import { useClientOrderActions } from '@/hooks/client/useClientOrderActions';
import type { Order } from '@/types';

export default function ComenziClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [serviceFilter, setServiceFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Use custom hooks
  const { 
    orders, 
    loading: loadingOrders, 
    expandedChats, 
    unreadCounts, 
    toggleChat 
  } = useClientOrdersLoader({ userId: user?.uid || '', serviceFilter });
  
  const { handleDelete } = useClientOrderActions();

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
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-900/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
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
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
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
          className="group block mb-6 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-green-500/10 hover:from-orange-500/20 hover:via-amber-500/10 hover:to-green-500/20 backdrop-blur-sm rounded-xl border border-orange-500/20 hover:border-orange-500/40 p-4 sm:p-5 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
          serviceFilter={serviceFilter}
          onServiceFilterChange={setServiceFilter}
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
              {serviceFilter ? 'Nu există comenzi pentru acest serviciu' : 'Nu ai nici o comandă plasată încă'}
            </p>
            <Link
              href="/comanda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
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
            unreadCounts={unreadCounts}
            onToggleChat={toggleChat}
            onViewDetails={setSelectedOrder}
            onDelete={handleDelete}
          />
        )}

        {/* Help Section */}
        <div className="mt-8">
          <HelpCard />
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
