'use client';

import React from 'react';

interface OrderScheduleSectionProps {
  pickupDate?: string;
  pickupTime?: string;
}

export default function OrderScheduleSection({ pickupDate, pickupTime }: OrderScheduleSectionProps) {
  if (!pickupDate) return null;

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Programare</h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Data ridicare</p>
          <p className="text-white font-medium">
            {formatDate(pickupDate)}
            {pickupTime && ` • ${pickupTime}`}
          </p>
        </div>
      </div>
    </div>
  );
}
