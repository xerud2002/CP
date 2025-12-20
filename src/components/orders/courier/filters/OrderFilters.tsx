'use client';

import React from 'react';
import CountryFilter from '../../shared/CountryFilter';
import ServiceTypeFilter from '../../shared/ServiceTypeFilter';

interface OrderFiltersProps {
  countryFilter: string;
  serviceFilter: string;
  onCountryChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function OrderFilters({
  countryFilter,
  serviceFilter,
  onCountryChange,
  onServiceChange,
  hasActiveFilters,
  onClearFilters
}: OrderFiltersProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 p-2 sm:p-3 mb-4 sm:mb-6 relative z-40">
      {/* Filters panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <CountryFilter value={countryFilter} onChange={onCountryChange} />
        <ServiceTypeFilter value={serviceFilter} onChange={onServiceChange} />
      </div>
      
      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="mt-3 px-4 py-2 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Resetează filtrele
        </button>
      )}
    </div>
  );
}
