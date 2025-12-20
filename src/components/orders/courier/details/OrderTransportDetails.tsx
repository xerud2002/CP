'use client';

import React from 'react';

interface OrderTransportDetailsProps {
  weight?: string | number;
  length?: string | number;
  width?: string | number;
  height?: string | number;
  quantity?: string | number;
  description?: string;
  serviceType?: string;
}

export default function OrderTransportDetails({
  weight,
  length,
  width,
  height,
  quantity,
  description,
  serviceType
}: OrderTransportDetailsProps) {
  const hasWeight = weight !== undefined && weight !== null;
  const hasDimensions = length || width || height;
  const hasQuantity = quantity !== undefined && quantity !== null;

  if (!hasWeight && !hasDimensions && !hasQuantity && !description) {
    return null;
  }

  return (
    <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalii Transport</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {hasWeight && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Greutate</p>
            <p className="text-white font-medium">
              {weight}{String(weight).includes('kg') ? '' : ' kg'}
            </p>
          </div>
        )}
        {hasDimensions && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Dimensiuni (L×l×h)</p>
            <p className="text-white font-medium">
              {length || '-'} × {width || '-'} × {height || '-'} cm
            </p>
          </div>
        )}
        {hasQuantity && (
          <div>
            <p className="text-xs text-gray-500 mb-1">
              {serviceType?.toLowerCase().trim() === 'persoane' ? 'Număr pasageri' : 'Cantitate'}
            </p>
            <p className="text-white font-medium">
              {quantity}
              {serviceType?.toLowerCase().trim() === 'persoane' ? ' persoane' : ''}
            </p>
          </div>
        )}
      </div>
      {description && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500 mb-1">Descriere</p>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      )}
    </div>
  );
}
