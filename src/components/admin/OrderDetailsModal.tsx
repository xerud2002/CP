'use client';

import { Order } from './types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Detalii Comandă {order.orderNumber ? `CP${order.orderNumber}` : ''}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-emerald-400 font-semibold mb-3">Informații Client</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Nume:</span>
                <p className="text-white font-medium">{order.nume || '-'}</p>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white">{order.email || '-'}</p>
              </div>
              <div>
                <span className="text-gray-400">Telefon:</span>
                <p className="text-white">{order.telefon || '-'}</p>
              </div>
              <div>
                <span className="text-gray-400">Serviciu:</span>
                <p className="text-white capitalize">{order.serviciu || '-'}</p>
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-3">Adresa Ridicare</h4>
            <div className="space-y-2 text-sm">
              <p className="text-white">{order.adresa_ridicare || '-'}</p>
              <p className="text-gray-400">
                {order.oras_ridicare}, {order.judet_ridicare}, {order.tara_ridicare}
              </p>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-orange-400 font-semibold mb-3">Adresa Livrare</h4>
            <div className="space-y-2 text-sm">
              <p className="text-white">{order.adresa_livrare || '-'}</p>
              <p className="text-gray-400">
                {order.oras_livrare}, {order.judet_livrare}, {order.tara_livrare}
              </p>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-purple-400 font-semibold mb-3">Detalii Colet</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {order.greutate && (
                <div>
                  <span className="text-gray-400">Greutate:</span>
                  <p className="text-white">{order.greutate}</p>
                </div>
              )}
              {order.cantitate && (
                <div>
                  <span className="text-gray-400">Cantitate:</span>
                  <p className="text-white">{order.cantitate}</p>
                </div>
              )}
              {order.lungime && (
                <div>
                  <span className="text-gray-400">Dimensiuni (L×W×H):</span>
                  <p className="text-white">{order.lungime} × {order.latime} × {order.inaltime}</p>
                </div>
              )}
            </div>
            {order.descriere && (
              <div className="mt-3">
                <span className="text-gray-400">Descriere:</span>
                <p className="text-white mt-1">{order.descriere}</p>
              </div>
            )}
          </div>

          {/* Options */}
          {order.optiuni && order.optiuni.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-4">
              <h4 className="text-pink-400 font-semibold mb-3">Opțiuni Suplimentare</h4>
              <div className="flex flex-wrap gap-2">
                {order.optiuni.map((opt, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm capitalize">
                    {opt.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
