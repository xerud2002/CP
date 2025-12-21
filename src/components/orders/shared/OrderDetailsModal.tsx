'use client';

import React from 'react';
import { CloseIcon } from '@/components/icons/DashboardIcons';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { formatOrderNumber, formatClientName } from '@/utils/orderHelpers';
import { serviceTypes } from '@/lib/constants';
import OrderRouteSection from './OrderRouteSection';
import OrderTransportDetails from './OrderTransportDetails';
import OrderScheduleSection from './OrderScheduleSection';
import type { Order } from '@/types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onFinalize?: () => void;
  onRequestReview?: () => void;
  hideContactInfo?: boolean;
}

export default function OrderDetailsModal({
  order,
  onClose,
  onFinalize,
  onRequestReview,
  hideContactInfo = false
}: OrderDetailsModalProps) {
  const serviceTypeConfig = serviceTypes.find(
    s => s.value.toLowerCase() === (order.tipColet || 'colete').toLowerCase()
  ) || serviceTypes[0];

  const optionLabels: Record<string, string> = {
    'asigurare': 'Asigurare transport',
    'incarcare_descarcare': 'Încărcare/Descărcare inclusă',
    'montaj_demontaj': 'Montaj/Demontaj mobilier',
    'ambalare': 'Ambalare profesională',
    'ambalare_speciala': 'Ambalare specială electronice',
    'frigo': 'Transport frigorific',
    'bagaje_extra': 'Bagaje suplimentare',
    'animale': 'Transport animale de companie',
    'cusca_transport': 'Cușcă transport profesională',
    'fragil': 'Manipulare fragil',
    'express': 'Livrare express',
    'temperatura_controlata': 'Temperatură controlată'
  };

  const formatCreatedDate = () => {
    const createdAt = order.createdAt as Date | { toDate: () => Date } | string | number | undefined;
    const date = createdAt && typeof createdAt === 'object' && 'toDate' in createdAt
      ? createdAt.toDate() 
      : new Date(createdAt as string | number | Date);
    
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        id="print-modal-container" 
        className="fixed inset-0 z-65 flex items-center justify-center p-4 pt-20 print:p-0 print:pt-0 print:static print:flex print:items-start" 
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          id="print-modal" 
          className="relative bg-slate-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden print:max-w-full print:max-h-full print:rounded-none print:border-0 print:shadow-none print:bg-white" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex items-center justify-between print:bg-white print:border-gray-300 print:static">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${serviceTypeConfig.bgColor} flex items-center justify-center ${serviceTypeConfig.color}`}>
                <ServiceIcon service={order.tipColet || 'colete'} className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {serviceTypeConfig.label}
                </h2>
                {(order.orderNumber || order.id) && (
                  <p className="text-xs text-gray-400">
                    #{formatOrderNumber(order.orderNumber || order.id || 1)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                title="Printează detalii comandă"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6 space-y-6 custom-scrollbar">
            {/* Route Section */}
            <OrderRouteSection
              pickupCountry={order.expeditorTara}
              pickupRegion={order.expeditorJudet || order.judet_ridicare || ''}
              pickupCity={order.oras_ridicare}
              deliveryCountry={order.destinatarTara}
              deliveryRegion={order.destinatarJudet || order.judet_livrare || ''}
              deliveryCity={order.oras_livrare}
            />

            {/* Transport Details */}
            <OrderTransportDetails
              weight={order.greutate}
              length={order.lungime}
              width={order.latime}
              height={order.inaltime}
              vehicleType={order.tip_vehicul}
              description={order.descriere}
              serviceType={order.serviciu}
            />

            {/* Schedule */}
            <OrderScheduleSection
              pickupDate={order.dataColectare}
              pickupTime={order.ora}
            />

            {/* Options */}
            {order.optiuni && order.optiuni.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Opțiuni Suplimentare</h3>
                <div className="flex flex-wrap gap-2">
                  {order.optiuni.map((opt, idx) => {
                    const label = optionLabels[opt] || opt;
                    return (
                      <span key={idx} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/20">
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact Info - hidden for couriers */}
            {!hideContactInfo && (order.clientName || order.clientPhone) && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Date Contact</h3>
                <div className="space-y-3">
                  {order.clientName && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Nume</p>
                        <p className="text-white font-medium truncate">{formatClientName(order.clientName)}</p>
                      </div>
                    </div>
                  )}
                  {order.clientPhone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Telefon</p>
                        <p className="text-white font-medium">{order.clientPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2 print:hidden">
              {order.status === 'in_lucru' && onFinalize && (
                <button 
                  onClick={() => {
                    onClose();
                    onFinalize();
                  }}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-base rounded-xl font-medium transition-colors"
                >
                  Finalizează comanda
                </button>
              )}
              {order.status === 'livrata' && onRequestReview && (
                <button 
                  onClick={() => {
                    onClose();
                    onRequestReview();
                  }}
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-base rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Cere recenzie
                </button>
              )}
            </div>

            {/* Created Date */}
            <div className="text-center text-xs text-gray-500 pt-2">
              Comandă creată la {formatCreatedDate()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
