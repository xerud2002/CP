'use client';

import React from 'react';

interface OrderTransportDetailsProps {
  weight?: string | number;
  length?: string | number;
  width?: string | number;
  height?: string | number;
  vehicleType?: string;
  description?: string;
}

export default function OrderTransportDetails({
  weight,
  length,
  width,
  height,
  vehicleType,
  description
}: OrderTransportDetailsProps) {
  // Check if values are meaningful (not empty, not just whitespace, not "0")
  const cleanWeight = weight?.toString().trim();
  const hasWeight = cleanWeight && cleanWeight !== '0' && cleanWeight !== '';
  
  const hasDimensions = length || width || height;
  
  const cleanVehicleType = vehicleType?.toString().trim();
  const hasVehicleType = cleanVehicleType && cleanVehicleType !== '';

  if (!hasWeight && !hasDimensions && !hasVehicleType && !description) {
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
              {cleanWeight}{String(cleanWeight).includes('kg') ? '' : ' kg'}
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
        {hasVehicleType && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Tip vehicul</p>
            <p className="text-white font-medium">
              {cleanVehicleType}
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
