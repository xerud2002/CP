'use client';

import React from 'react';
import Image from 'next/image';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import OrderChat from '@/components/orders/OrderChat';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { countries, serviceTypes } from '@/lib/constants';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  isNew: boolean;
  isExpanded: boolean;
  unreadCount: number;
  currentUserId?: string;
  onToggleChat: () => void;
  onViewDetails: () => void;
}

export default function OrderCard({
  order,
  isNew,
  isExpanded,
  unreadCount,
  currentUserId,
  onToggleChat,
  onViewDetails
}: OrderCardProps) {
  const serviceTypeConfig = serviceTypes.find(
    s => s.value.toLowerCase() === (order.tipColet || 'colete').toLowerCase()
  ) || serviceTypes[0];

  const getCountryCode = (countryName?: string) => {
    if (!countryName) return 'ro';
    const country = countryName.toLowerCase().trim();
    const matched = countries.find(c => 
      c.name.toLowerCase() === country || 
      c.code.toLowerCase() === country
    );
    return matched?.code || 'ro';
  };

  // Capitalize first letter of each word
  const capitalize = (str: string | undefined) => {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formatDateTime = () => {
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
  };

  const getServiceInfo = () => {
    if (order.tipColet === 'plicuri') {
      return `Plicuri: ${order.cantitate || 1} buc`;
    }
    if (order.tipColet === 'persoane') {
      return `Pasageri: ${order.cantitate || 1}`;
    }
    if (order.tipColet === 'masini') {
      return 'Transport auto';
    }
    if (order.greutate) {
      return `Colet: ${order.greutate}${String(order.greutate).includes('kg') ? '' : ' kg'}`;
    }
    if (order.cantitate) {
      return `Cantitate: ${order.cantitate}`;
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 hover:border-white/10 transition-all">
      <div className="flex items-start gap-4">
        {/* Service Icon */}
        <div className={`relative w-12 h-12 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center shrink-0 ${serviceTypeConfig.color}`}>
          <ServiceIcon service={order.tipColet || 'colete'} className="w-6 h-6" />
          {/* New Badge on Icon */}
          {isNew && (
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
                onClick={onToggleChat}
                className={`relative px-3 py-2 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isExpanded 
                    ? 'bg-green-500/30 border-green-500/50 text-green-300 hover:bg-green-500/40' 
                    : unreadCount > 0
                      ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30 animate-pulse'
                      : 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400'
                }`}
                title="Mesaje"
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 items-center justify-center text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  </span>
                )}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="hidden sm:inline">Mesaje</span>
              </button>
              <button
                onClick={onViewDetails}
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
                src={`/img/flag/${getCountryCode(order.expeditorTara)}.svg`}
                alt={order.expeditorTara || 'RO'}
                width={20} 
                height={15} 
                className="rounded"
              />
              <span className="text-gray-300">
                {capitalize(order.oras_ridicare || order.expeditorJudet)}, {capitalize(order.expeditorJudet)}
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex items-center gap-1.5">
              <Image 
                src={`/img/flag/${getCountryCode(order.destinatarTara)}.svg`}
                alt={order.destinatarTara || 'RO'}
                width={20} 
                height={15} 
                className="rounded"
              />
              <span className="text-gray-300">
                {capitalize(order.oras_livrare || order.destinatarJudet)}, {capitalize(order.destinatarJudet)}
              </span>
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
                {formatDateTime()}
              </span>
            )}
            {getServiceInfo() && <span>{getServiceInfo()}</span>}
          </div>
        </div>
      </div>

      {/* Expandable Chat Section */}
      {isExpanded && (
        <div className="mt-4 border-t border-white/5 pt-4 animate-in slide-in-from-top-2 duration-200">
          <OrderChat 
            orderId={order.id || ''} 
            orderNumber={order.orderNumber}
            courierId={currentUserId}
            clientId={order.uid_client}
          />
        </div>
      )}
    </div>
  );
}
