'use client';

import React, { memo } from 'react';
import OrderCard from './OrderCard';
import type { Order } from '@/types';

interface OrderListProps {
  orders: Order[];
  filteredOrders: Order[];
  viewedOrders: Set<string>;
  expandedChatOrderId: string | null;
  unreadCounts: Record<string, number>;
  hasActiveFilters: boolean;
  loadingOrders: boolean;
  currentUserId?: string;
  isCourierVerified?: boolean;
  onToggleChat: (orderId: string | null) => void;
  onViewDetails: (order: Order) => void;
  onClearFilters: () => void;
  onDismissOrder: (orderId: string) => void;
}

function OrderList({
  orders,
  filteredOrders,
  viewedOrders,
  expandedChatOrderId,
  unreadCounts,
  hasActiveFilters,
  loadingOrders,
  currentUserId,
  isCourierVerified = false,
  onToggleChat,
  onViewDetails,
  onClearFilters,
  onDismissOrder
}: OrderListProps) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg sm:rounded-2xl border border-white/5 overflow-hidden relative z-10">
      {/* Header */}
      <div className="bg-slate-800/50 px-3 sm:px-6 py-2 sm:py-4 border-b border-white/5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <span className="hidden xs:inline">Lista Comenzilor</span>
            <span className="xs:hidden">Comenzi</span>
          </h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <span className="text-[10px] sm:text-xs text-purple-400 bg-purple-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                Filtrate
              </span>
            )}
            <span className="text-[10px] sm:text-sm text-gray-500 whitespace-nowrap">
              {filteredOrders.length} {filteredOrders.length !== orders.length && `din ${orders.length}`} comenzi
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-2 sm:p-6">
        {loadingOrders ? (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-20">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-300 text-sm sm:text-lg font-semibold mb-1">
              {hasActiveFilters ? 'Nicio comandă găsită' : 'Nu ai nicio comandă'}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xs mx-auto px-4">
              {hasActiveFilters
                ? 'Încearcă să modifici filtrele pentru a vedea mai multe comenzi.' 
                : 'Comenzile vor apărea aici când clienții plasează comenzi.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
              >
                Resetează filtrele
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-4">
            {filteredOrders.map((order) => {
              const isNew = order.id && !viewedOrders.has(order.id);
              const isExpanded = expandedChatOrderId === order.id;
              const unreadCount = order.id ? (unreadCounts[order.id] || 0) : 0;

              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  isNew={!!isNew}
                  isExpanded={isExpanded}
                  unreadCount={unreadCount}
                  currentUserId={currentUserId}
                  isCourierVerified={isCourierVerified}
                  onToggleChat={() => onToggleChat(isExpanded ? null : order.id || null)}
                  onViewDetails={() => onViewDetails(order)}
                  onDismiss={() => order.id && onDismissOrder(order.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OrderList);
