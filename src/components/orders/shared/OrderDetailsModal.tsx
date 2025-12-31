'use client';

import React from 'react';
import { CloseIcon } from '@/components/icons/DashboardIcons';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { serviceTypes, serviceNames } from '@/lib/constants';
import OrderRouteSection from './OrderRouteSection';
import type { Order } from '@/types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onFinalize?: () => void;
}

// Check if date is today or tomorrow
const isUrgent = (dateStr: string | undefined) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  return date.getTime() === today.getTime() || date.getTime() === tomorrow.getTime();
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function OrderDetailsModal({
  order,
  onClose,
  onFinalize
}: OrderDetailsModalProps) {
  const serviceName = order.serviciu 
    ? (serviceNames[order.serviciu as keyof typeof serviceNames] || order.serviciu)
    : (order.tipColet || 'Colete');

  const serviceTypeConfig = serviceTypes.find(
    s => s.value.toLowerCase() === (order.serviciu || order.tipColet || 'colete').toLowerCase()
  ) || serviceTypes[0];

  const optionLabels: Record<string, string> = {
    'asigurare': 'Asigurare transport',
    'incarcare_descarcare': 'Încărcare/Descărcare',
    'montaj_demontaj': 'Montaj/Demontaj',
    'ambalare': 'Ambalare profesională',
    'ambalare_speciala': 'Ambalare specială',
    'frigo': 'Transport frigorific',
    'bagaje_extra': 'Bagaje suplimentare',
    'animale': 'Transport animale',
    'cusca_transport': 'Cușcă transport',
    'fragil': 'Manipulare fragil',
    'express': 'Livrare express',
    'temperatura_controlata': 'Temperatură controlată'
  };

  const motivTractareLabels: Record<string, string> = {
    'pana': 'Pană / Defecțiune',
    'accident': 'Accident',
    'relocare': 'Relocare',
    'alt': 'Alt motiv'
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

  // Check if it's a tractare service
  const isTractare = (order.serviciu || order.tipColet || '').toLowerCase() === 'tractari';
  const isAnimale = (order.serviciu || order.tipColet || '').toLowerCase() === 'animale';

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
                <ServiceIcon service={order.serviciu || order.tipColet || 'colete'} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white print:text-gray-900">{serviceName}</h2>
                  {isUrgent(order.data_ridicare || order.dataColectare) && (
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Urgent
                    </span>
                  )}
                </div>
                {(order.orderNumber || order.id) && (
                  <p className="text-xs text-gray-400 print:text-gray-600">
                    #{formatOrderNumber(order.orderNumber || order.id || 1)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                title="Printează detalii comandă"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Închide"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6 space-y-5 custom-scrollbar">
            
            {/* Route Section */}
            <OrderRouteSection
              pickupCountry={order.tara_ridicare || order.expeditorTara}
              pickupRegion={order.judet_ridicare || order.expeditorJudet || ''}
              pickupCity={order.oras_ridicare}
              deliveryCountry={order.tara_livrare || order.destinatarTara}
              deliveryRegion={order.judet_livrare || order.destinatarJudet || ''}
              deliveryCity={order.oras_livrare}
            />

            {/* Adrese complete */}
            {(order.adresa_ridicare || order.adresa_livrare) && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Adrese</h3>
                <div className="space-y-3">
                  {order.adresa_ridicare && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Adresă ridicare</p>
                        <p className="text-white">{order.adresa_ridicare}</p>
                      </div>
                    </div>
                  )}
                  {order.adresa_livrare && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Adresă livrare</p>
                        <p className="text-white">{order.adresa_livrare}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Colectare */}
            <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Programare</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {formatDate(order.data_ridicare || order.dataColectare)}
                  </p>
                  {order.tip_programare === 'range' && order.data_ridicare_end && (
                    <p className="text-sm text-gray-400">până la {formatDate(order.data_ridicare_end)}</p>
                  )}
                  {order.tip_programare === 'flexibil' && (
                    <p className="text-sm text-gray-400">Program flexibil</p>
                  )}
                  {order.ora && (
                    <p className="text-sm text-gray-400">Ora: {order.ora}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detalii vehicul pentru Tractări */}
            {isTractare && (order.tip_vehicul || order.numar_inmatriculare || order.motiv_tractare || order.roti_functionale) && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalii Vehicul</h3>
                <div className="grid grid-cols-2 gap-4">
                  {order.tip_vehicul && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tip vehicul</p>
                      <p className="text-white font-medium">{order.tip_vehicul}</p>
                    </div>
                  )}
                  {order.numar_inmatriculare && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nr. înmatriculare</p>
                      <p className="text-white font-medium font-mono">{order.numar_inmatriculare}</p>
                    </div>
                  )}
                  {order.motiv_tractare && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Motiv tractare</p>
                      <p className="text-white font-medium">{motivTractareLabels[order.motiv_tractare] || order.motiv_tractare}</p>
                    </div>
                  )}
                  {order.roti_functionale && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Roți funcționale</p>
                      <p className="text-white font-medium">{order.roti_functionale === 'da' ? 'Da' : 'Nu, blocate'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detalii animale */}
            {isAnimale && order.tip_animal && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalii Animal</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{order.tip_animal}</p>
                    {order.greutate && <p className="text-sm text-gray-400">{order.greutate} kg</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Dimensiuni și greutate - pentru colete, paleți, etc (nu pentru tractări sau animale) */}
            {!isTractare && !isAnimale && (order.greutate || order.lungime || order.latime || order.inaltime || order.cantitate) && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalii Transport</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {order.greutate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Greutate</p>
                      <p className="text-white font-medium">{order.greutate} kg</p>
                    </div>
                  )}
                  {order.cantitate && order.cantitate !== '1' && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cantitate</p>
                      <p className="text-white font-medium">{order.cantitate} buc</p>
                    </div>
                  )}
                  {order.lungime && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lungime</p>
                      <p className="text-white font-medium">{order.lungime} cm</p>
                    </div>
                  )}
                  {order.latime && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lățime</p>
                      <p className="text-white font-medium">{order.latime} cm</p>
                    </div>
                  )}
                  {order.inaltime && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Înălțime</p>
                      <p className="text-white font-medium">{order.inaltime} cm</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tip vehicul pentru non-tractări (ex: mutări) */}
            {!isTractare && order.tip_vehicul && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Vehicul Necesar</h3>
                <p className="text-white">{order.tip_vehicul}</p>
              </div>
            )}

            {/* Descriere */}
            {order.descriere && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Descriere</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{order.descriere}</p>
              </div>
            )}

            {/* Observații */}
            {order.observatii && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Observații</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{order.observatii}</p>
              </div>
            )}

            {/* Options */}
            {order.optiuni && order.optiuni.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Opțiuni Suplimentare</h3>
                <div className="flex flex-wrap gap-2">
                  {order.optiuni.map((opt, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/20">
                      {optionLabels[opt] || opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tip ofertanți */}
            {order.tip_ofertanti && order.tip_ofertanti.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Prefer oferte de la</h3>
                <div className="flex flex-wrap gap-2">
                  {order.tip_ofertanti.includes('firme') && (
                    <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/20">
                      Firme de transport
                    </span>
                  )}
                  {order.tip_ofertanti.includes('persoane_private') && (
                    <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium border border-purple-500/20">
                      Persoane private
                    </span>
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
