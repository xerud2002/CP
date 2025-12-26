'use client';

import React, { lazy, Suspense, memo } from 'react';
import ClientOrderCard from './ClientOrderCard';
import type { Order } from '@/types';

// Lazy load heavy chat component
const OrderChatMulti = lazy(() => import('@/components/orders/OrderChatMulti'));

interface ClientOrderListProps {
  orders: Order[];
  loading: boolean;
  expandedChats: Set<string>;
  unreadCounts: Record<string, number>;
  onToggleChat: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
  onDelete: (order: Order) => void;
}

function ClientOrderList({
  orders,
  loading,
  expandedChats,
  unreadCounts,
  onToggleChat,
  onViewDetails,
  onDelete
}: ClientOrderListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-400 text-lg mb-2">Nu ai comenzi</p>
        <p className="text-gray-500 text-sm">Creează o comandă nouă pentru a o vedea aici</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id}>
          <ClientOrderCard
            order={order}
            onToggleChat={() => order.id && onToggleChat(order.id)}
            onViewDetails={() => onViewDetails(order)}
            onDelete={() => onDelete(order)}
          />
          
          {/* Expandable Chat - Lazy loaded */}
          {order.id && expandedChats.has(order.id) && (
            <div className="mt-2 sm:mt-4 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/5 p-2 sm:p-4">
              <Suspense fallback={<div className="flex justify-center py-8"><div className="spinner" /></div>}>
                <OrderChatMulti orderId={order.id} orderNumber={order.orderNumber} />
              </Suspense>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(ClientOrderList);
