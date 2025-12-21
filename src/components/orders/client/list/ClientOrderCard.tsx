'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { ServiceIcon, getServiceIconMetadata } from '@/components/icons/ServiceIcons';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { serviceNames } from '@/lib/constants';
import type { Order } from '@/types';

interface ClientOrderCardProps {
  order: Order;
  unreadCount?: number;
  chatExpanded: boolean;
  onToggleChat: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
}

const getFlagPath = (code: string) => `/img/flag/${code.toLowerCase()}.svg`;

// Capitalize first letter of each word and replace underscores with spaces
const capitalize = (str: string | undefined) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

function ClientOrderCard({
  order,
  unreadCount = 0,
  chatExpanded,
  onToggleChat,
  onViewDetails,
  onDelete
}: ClientOrderCardProps) {
  const serviceConfig = getServiceIconMetadata(order.serviciu || 'colete');
  
  const getServiceInfo = () => {
    if (order.serviciu === 'plicuri') {
      return `Plicuri: ${order.cantitate || 1} buc`;
    }
    if (order.serviciu === 'persoane') {
      return `Pasageri: ${order.cantitate || 1}`;
    }
    if (order.serviciu === 'masini') {
      return 'Transport auto';
    }
    if (order.greutate) {
      const label = order.serviciu === 'paleti' ? 'Palet' : 'Colet';
      return `${label}: ${order.greutate}${!String(order.greutate).includes('kg') ? ' kg' : ''}`;
    }
    if (order.cantitate) {
      return `Cantitate: ${order.cantitate}`;
    }
    return null;
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

  return (
    <div 
      id={`order-${order.id}`}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/5 p-3 sm:p-6 hover:border-white/10 transition-all"
    >
      <div className="flex items-start gap-2.5 sm:gap-4">
        {/* Service Icon */}
        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${serviceConfig.bg} flex items-center justify-center shrink-0 ${serviceConfig.color}`}>
          <ServiceIcon service={order.serviciu || 'colete'} />
          {((order.nrOferte ?? 0) > 0 || (order.nrMesajeNoi ?? 0) > 0) && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 items-center justify-center text-[10px] font-bold text-white">
                {(order.nrOferte || 0) + (order.nrMesajeNoi || 0)}
              </span>
            </span>
          )}
        </div>
        
        {/* Order Details */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {order.serviciu ? (serviceNames[order.serviciu as keyof typeof serviceNames] || order.serviciu) : 'Colete'}
                </h3>
                {(order.nrOferte ?? 0) > 0 && (
                  <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-medium rounded-full">
                    {order.nrOferte} {order.nrOferte === 1 ? 'ofertă' : 'oferte'}
                  </span>
                )}
                {(order.nrMesajeNoi ?? 0) > 0 && (
                  <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium rounded-full">
                    {order.nrMesajeNoi} {order.nrMesajeNoi === 1 ? 'mesaj nou' : 'mesaje noi'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {order.orderNumber && (
                  <span>#{formatOrderNumber(order.orderNumber)}</span>
                )}
                {(order.timestamp || order.createdAt) && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDateTime()}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onToggleChat}
                className={`relative px-3 py-2 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                  chatExpanded 
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
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
              <button
                onClick={onDelete}
                className="px-3 py-2 sm:px-3 sm:py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-medium transition-all flex items-center gap-1.5"
                title="Șterge comanda"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Șterge</span>
              </button>
            </div>
          </div>
          
          {/* Route */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <Image 
                src={getFlagPath(order.expeditorTara || order.tara_ridicare || '')} 
                alt={order.expeditorTara || order.tara_ridicare || ''} 
                width={20} 
                height={15} 
                className="rounded shrink-0"
              />
              <span className="text-gray-300 text-sm sm:text-base truncate">
                {capitalize(order.oras_ridicare)}, {capitalize(order.expeditorJudet || order.judet_ridicare)}
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex items-center gap-1.5 min-w-0">
              <Image 
                src={getFlagPath(order.destinatarTara || order.tara_livrare || '')} 
                alt={order.destinatarTara || order.tara_livrare || ''} 
                width={20} 
                height={15} 
                className="rounded shrink-0"
              />
              <span className="text-gray-300 text-sm sm:text-base truncate">
                {capitalize(order.oras_livrare)}, {capitalize(order.destinatarJudet || order.judet_livrare)}
              </span>
            </div>
          </div>
          
          {/* Meta Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
              {getServiceInfo() && <span>{getServiceInfo()}</span>}
              {order.descriere && <span>Descriere: {order.descriere}</span>}
            </div>
            {order.optiuni && order.optiuni.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {order.optiuni.map((option, index) => (
                  <span key={index} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-xs border border-emerald-500/20">
                    {capitalize(option)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ClientOrderCard, (prevProps, nextProps) => {
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.order.status === nextProps.order.status &&
    prevProps.unreadCount === nextProps.unreadCount &&
    prevProps.chatExpanded === nextProps.chatExpanded
  );
});
