'use client';

import React, { memo, lazy, Suspense } from 'react';
import Image from 'next/image';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { countries, serviceTypes } from '@/lib/constants';
import { MessageButton, ViewButton, ActionButtonsGroup } from '@/components/ui/ActionButtons';
import type { Order } from '@/types';

// Lazy load OrderChat - it's heavy and only shown when expanded
const OrderChat = lazy(() => import('@/components/orders/OrderChat'));

interface OrderCardProps {
  order: Order;
  isNew: boolean;
  isExpanded: boolean;
  unreadCount: number;
  currentUserId?: string;
  onToggleChat: () => void;
  onViewDetails: () => void;
}

function OrderCard({
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
    return matched?.code.toLowerCase() || 'ro';
  };

  // Capitalize first letter of each word and replace underscores with spaces
  const capitalize = (str: string | undefined) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
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
    if (order.tipColet === 'animale') {
      const animalLabels: Record<string, string> = {
        'caine': 'Câine',
        'pisica': 'Pisică',
        'pasare': 'Pasăre',
        'rozator': 'Rozător',
        'alt': 'Alt animal'
      };
      const normalizedType = order.tip_animal?.toLowerCase().trim();
      const animalType = normalizedType && animalLabels[normalizedType] ? animalLabels[normalizedType] : (order.tip_animal || 'Animal');
      return `Tip animal: ${animalType}`;
    }
    // Show vehicle type if available
    if (order.tip_vehicul) {
      const vehicleText = `Vehicul: ${order.tip_vehicul}`;
      return order.descriere ? `${vehicleText} - ${order.descriere}` : vehicleText;
    }
    if (order.greutate) {
      const label = order.tipColet === 'paleti' ? 'Palet' : 'Greutate';
      return `${label}: ${order.greutate}${String(order.greutate).includes('kg') ? '' : ' kg'}`;
    }
    if (order.cantitate) {
      return `Cantitate: ${order.cantitate}`;
    }
    return null;
  };

  return (
    <div 
      id={`order-${order.id}`}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 sm:p-6 hover:border-white/10 transition-all"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Service Icon */}
        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center shrink-0 ${serviceTypeConfig.color}`}>
          <ServiceIcon service={order.tipColet || 'colete'} className="w-5 h-5 sm:w-6 sm:h-6" />
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2 sm:gap-0">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {serviceTypeConfig.label}
                </h3>
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
                    <span className="hidden xs:inline">{formatDateTime()}</span>
                    <span className="xs:hidden">{formatDateTime().split(' • ')[0]}</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <ActionButtonsGroup>
              <MessageButton
                onClick={onToggleChat}
                title="Mesaje"
              />
              <ViewButton
                onClick={onViewDetails}
                title="Vezi detalii"
              />
            </ActionButtonsGroup>
          </div>
          
          {/* Route */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 shrink-0">
              <Image 
                src={`/img/flag/${getCountryCode(order.expeditorTara)}.svg`}
                alt={order.expeditorTara || 'RO'}
                width={20} 
                height={15} 
                className="rounded shrink-0"
              />
              <span className="text-gray-300">
                {capitalize(order.oras_ridicare || order.expeditorJudet)}
                <span className="hidden sm:inline">, {capitalize(order.expeditorJudet)}</span>
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex items-center gap-1.5 shrink-0">
              <Image 
                src={`/img/flag/${getCountryCode(order.destinatarTara)}.svg`}
                alt={order.destinatarTara || 'RO'}
                width={20} 
                height={15} 
                className="rounded shrink-0"
              />
              <span className="text-gray-300">
                {capitalize(order.oras_livrare || order.destinatarJudet)}
                <span className="hidden sm:inline">, {capitalize(order.destinatarJudet)}</span>
              </span>
            </div>
          </div>
          
          {/* Meta Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-400">
              {getServiceInfo() && <span className="font-medium">{getServiceInfo()}</span>}
              {/* Show descriere for non-vehicle orders (vehicle includes it in getServiceInfo) */}
              {order.descriere && !order.tip_vehicul && (
                <span className="truncate max-w-full">Descriere: {order.descriere}</span>
              )}
            </div>
            {order.optiuni && order.optiuni.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {order.optiuni.map((option, index) => (
                  <span key={index} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] sm:text-xs border border-emerald-500/20 font-medium">
                    {capitalize(option)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Chat Section - Lazy loaded */}
      {isExpanded && (
        <div className="mt-4 border-t border-white/5 pt-4 animate-in slide-in-from-top-2 duration-200">
          <Suspense fallback={<div className="flex justify-center py-8"><div className="spinner" /></div>}>
            <OrderChat 
              orderId={order.id || ''} 
              orderNumber={order.orderNumber}
              courierId={currentUserId}
              clientId={order.uid_client}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

// Memoize to prevent re-renders when parent state changes
export default memo(OrderCard, (prevProps, nextProps) => {
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.isNew === nextProps.isNew &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.unreadCount === nextProps.unreadCount &&
    prevProps.currentUserId === nextProps.currentUserId
  );
});
