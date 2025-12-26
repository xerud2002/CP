'use client';

import React from 'react';
import CountryFilter from '../../shared/CountryFilter';
import ServiceTypeFilter from '../../shared/ServiceTypeFilter';
import SortFilter from '../../shared/SortFilter';

interface ClientOrderFiltersProps {
  countryFilter: string;
  serviceFilter: string;
  searchQuery: string;
  sortBy: string;
  onCountryChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function ClientOrderFilters({
  countryFilter,
  serviceFilter,
  searchQuery,
  sortBy,
  onCountryChange,
  onServiceChange,
  onSearchChange,
  onSortChange,
  hasActiveFilters,
  onClearFilters
}: ClientOrderFiltersProps) {

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4 mb-4 sm:mb-6 relative z-40">
      {/* Main filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3">
        <CountryFilter value={countryFilter} onChange={onCountryChange} />
        <ServiceTypeFilter value={serviceFilter} onChange={onServiceChange} />
        <SortFilter value={sortBy} onChange={onSortChange} storageKey="client_filters_sort_open" />
      </div>

      {/* Search bar */}
      <div className="relative">
        <label className="block text-xs text-gray-400 mb-1.5">Caută</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Caută după număr comandă (#CP141135) sau oraș..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:bg-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
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
