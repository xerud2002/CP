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
  onToggleChat: (orderId: string | null) => void;
  onViewDetails: (order: Order) => void;
  onClearFilters: () => void;
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
  onToggleChat,
  onViewDetails,
  onClearFilters
}: OrderListProps) {
  return (
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
                onClick={onClearFilters}
                className="mt-4 px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
              >
                Resetează filtrele
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
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
                  onToggleChat={() => onToggleChat(isExpanded ? null : order.id || null)}
                  onViewDetails={() => onViewDetails(order)}
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
