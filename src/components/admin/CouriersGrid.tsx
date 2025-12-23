'use client';

import { User } from '@/types';
import { TruckIcon, EyeIcon, BanIcon } from '@/components/icons/DashboardIcons';
import { getDisplayName } from './types';

interface CouriersGridProps {
  couriers: User[];
  onSuspend: (uid: string) => void;
}

const serviceEmojis: Record<string, string> = {
  colete: '📦',
  plicuri: '✉️',
  persoane: '👥',
  animale: '🐾',
  masini: '🚗',
  platforma: '🚛',
  paleti: '📋',
  electronice: '📺',
  tractari: '🔧',
  mutari: '🏠',
  mobila: '🛋️',
};

export default function CouriersGrid({ couriers, onSuspend }: CouriersGridProps) {
  // Helper to get services list
  const getServices = (courier: User) => {
    const courierData = courier as unknown as Record<string, unknown>;
    if (courierData.serviciiOferite && Array.isArray(courierData.serviciiOferite)) {
      return courierData.serviciiOferite as string[];
    }
    return [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {couriers.map((courier) => {
        const courierName = getDisplayName(courier);
        const services = getServices(courier);
        const courierData = courier as unknown as Record<string, unknown>;
        const rating = courierData.rating as number | undefined;
        const reviewCount = courierData.reviewCount as number | undefined;
        
        return (
          <div key={courier.uid} className="bg-linear-to-br from-slate-800/80 to-slate-800/40 rounded-xl p-5 border border-white/5 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/10 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  {courierName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{courierName}</p>
                  <p className="text-gray-500 text-xs">{courier.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Activ
              </span>
            </div>

            {/* Rating */}
            {rating !== undefined && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-yellow-400 font-semibold text-sm">{rating.toFixed(1)}</span>
                {reviewCount !== undefined && (
                  <span className="text-gray-500 text-xs">({reviewCount} recenzii)</span>
                )}
              </div>
            )}
            
            {/* Info Grid */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm p-2 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Telefon
                </span>
                {courier.telefon ? (
                  <span className="text-white font-medium">{courier.telefon}</span>
                ) : (
                  <span className="text-gray-500 italic text-xs">Nesetat</span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm p-2 bg-slate-700/30 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <TruckIcon className="w-4 h-4" />
                  Servicii
                </span>
                <span className="text-orange-400 font-bold">{services.length}</span>
              </div>
            </div>

            {/* Services Tags */}
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {services.slice(0, 5).map((service, idx) => {
                  const serviceKey = service.toLowerCase();
                  const emoji = serviceEmojis[serviceKey] || '📦';
                  return (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-slate-700/50 text-gray-300 rounded-md text-xs flex items-center gap-1"
                    >
                      <span>{emoji}</span>
                      <span className="capitalize">{service}</span>
                    </span>
                  );
                })}
                {services.length > 5 && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs font-medium">
                    +{services.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 border border-blue-500/20">
                <EyeIcon className="w-4 h-4" />
                Vezi Profil
              </button>
              <button 
                onClick={() => onSuspend(courier.uid)}
                className="px-3 py-2.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all border border-red-500/20"
                title="Suspendă curier"
              >
                <BanIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
      {couriers.length === 0 && (
        <div className="col-span-full text-center py-12">
          <TruckIcon className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">Nu există curieri înregistrați.</p>
        </div>
      )}
    </div>
  );
}
