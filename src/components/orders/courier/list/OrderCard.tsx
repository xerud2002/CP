'use client';

import React, { memo, lazy, Suspense, useState } from 'react';
import Image from 'next/image';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { countries, serviceTypes } from '@/lib/constants';
import { MessageButton, ViewButton, ActionButtonsGroup, DismissButton } from '@/components/ui/ActionButtons';
import type { Order } from '@/types';

// Lazy load OrderChat - it's heavy and only shown when expanded
const OrderChat = lazy(() => import('@/components/orders/OrderChat'));

interface OrderCardProps {
  order: Order;
  isNew: boolean;
  isExpanded: boolean;
  unreadCount?: number; // Optional for future use
  currentUserId?: string;
  isCourierVerified?: boolean;
  onToggleChat: () => void;
  onViewDetails: () => void;
  onDismiss: () => void;
}

function OrderCard({
  order,
  isNew,
  isExpanded,
  unreadCount = 0,
  currentUserId,
  isCourierVerified = false,
  onToggleChat,
  onViewDetails,
  onDismiss
}: OrderCardProps) {
  const [showDismissConfirm, setShowDismissConfirm] = useState(false);
  
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
    // For furniture, show total weight and team requirement
    if (order.serviciu === 'mobila') {
      const parts = [];
      if (order.greutate) {
        parts.push(`Greutate totală aproximativă: ${order.greutate}${String(order.greutate).includes('kg') ? '' : ' kg'}`);
      }
      if (order.echipa_necesara) {
        const team = order.echipa_necesara === 'da' ? 'Necesită 2+ persoane' : 'Necesită 1 persoană';
        parts.push(team);
      }
      if (parts.length > 0) return parts.join(' • ');
    }
    if (order.greutate) {
      const label = order.tipColet === 'paleti' ? 'Palet' : 'Greutate';
      return `${label}: ${order.greutate}${String(order.greutate).includes('kg') ? '' : ' kg'}`;
    }
    if (order.cantitate) {
      const label = order.serviciu === 'persoane' ? 'Număr persoane' : 
                    order.serviciu === 'mobila' ? 'Nr. piese mobilier' : 
                    'Cantitate';
      return `${label}: ${order.cantitate}`;
    }
    return null;
  };

  return (
    <div 
      id={`order-${order.id}`}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-3 xs:p-4 sm:p-6 hover:border-white/10 transition-all"
    >
      <div className="flex items-start gap-2 xs:gap-3 sm:gap-4">
        {/* Service Icon */}
        <div className={`relative w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center shrink-0 ${serviceTypeConfig.color}`}>
          <ServiceIcon service={order.tipColet || 'colete'} className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 xs:mb-3 gap-2 sm:gap-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold text-xs xs:text-sm sm:text-base truncate">
                  {serviceTypeConfig.label}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs text-gray-400">
                {order.orderNumber && (
                  <span>#{formatOrderNumber(order.orderNumber)}</span>
                )}
                {(order.timestamp || order.createdAt) && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 hidden xs:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {isCourierVerified && (
                <MessageButton
                  onClick={onToggleChat}
                  title="Mesaje"
                  unreadCount={unreadCount}
                />
              )}
              <ViewButton
                onClick={onViewDetails}
                title="Vezi detalii"
              />
              <DismissButton
                onClick={() => setShowDismissConfirm(true)}
                title="Nu sunt interesat"
              />
            </ActionButtonsGroup>
          </div>
          
          {/* Route */}
          <div className="flex flex-wrap items-center gap-1 xs:gap-2 mb-2 xs:mb-3 text-[10px] xs:text-xs sm:text-sm">
            <div className="flex items-center gap-1 xs:gap-1.5 min-w-0 max-w-[45%] xs:max-w-none">
              <Image 
                src={`/img/flag/${getCountryCode(order.expeditorTara)}.svg`}
                alt={order.expeditorTara || 'RO'}
                width={16} 
                height={12} 
                className="rounded shrink-0 w-4 xs:w-5 h-3 xs:h-4"
                unoptimized
              />
              <span className="text-gray-300 truncate">
                {capitalize(order.oras_ridicare || order.expeditorJudet)}
                <span className="hidden sm:inline">, {capitalize(order.expeditorJudet)}</span>
              </span>
            </div>
            <svg className="w-3 h-3 xs:w-4 xs:h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex items-center gap-1 xs:gap-1.5 min-w-0 max-w-[45%] xs:max-w-none">
              <Image 
                src={`/img/flag/${getCountryCode(order.destinatarTara)}.svg`}
                alt={order.destinatarTara || 'RO'}
                width={16} 
                height={12} 
                className="rounded shrink-0 w-4 xs:w-5 h-3 xs:h-4"
                unoptimized
              />
              <span className="text-gray-300 truncate">
                {capitalize(order.oras_livrare || order.destinatarJudet)}
                <span className="hidden sm:inline">, {capitalize(order.destinatarJudet)}</span>
              </span>
            </div>
          </div>
          
          {/* Meta Info */}
          <div className="space-y-1.5 xs:space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 xs:gap-x-3 gap-y-1 text-[10px] xs:text-xs text-gray-400">
              {getServiceInfo() && <span className="font-medium">{getServiceInfo()}</span>}
              {/* Show descriere for non-vehicle orders (vehicle includes it in getServiceInfo) */}
              {order.descriere && !order.tip_vehicul && (
                <span className="truncate max-w-full">Descriere: {order.descriere}</span>
              )}
            </div>
            {order.optiuni && order.optiuni.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2">
                {order.optiuni.map((option, index) => (
                  <span key={index} className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[9px] xs:text-[10px] sm:text-xs border border-emerald-500/20 font-medium">
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

      {/* Dismiss Confirmation Modal */}
      {showDismissConfirm && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3.5 bg-gradient-to-br from-orange-500/30 to-amber-500/20 rounded-xl border border-orange-500/20 shadow-lg shadow-orange-500/10">
                  <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Ascunde comanda?</h3>
                  <p className="text-sm text-gray-400 mt-1">Comanda #{formatOrderNumber(order.orderNumber || 0)}</p>
                </div>
                <button
                  onClick={() => setShowDismissConfirm(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
                Ești sigur că vrei să ascunzi această comandă? Nu vei mai vedea această comandă în lista ta.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => setShowDismissConfirm(false)}
                  className="flex-1 px-4 py-3.5 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl font-medium transition-all border border-white/5 touch-manipulation"
                >
                  Anulează
                </button>
                <button
                  onClick={() => {
                    setShowDismissConfirm(false);
                    onDismiss();
                  }}
                  className="flex-1 px-4 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 touch-manipulation"
                >
                  Da, ascunde
                </button>
              </div>
            </div>
          </div>
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
