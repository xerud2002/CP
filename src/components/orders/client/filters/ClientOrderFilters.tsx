'use client';

import React, { useState, useRef, useEffect } from 'react';
import CountryFilter from '../../shared/CountryFilter';
import ServiceTypeFilter from '../../shared/ServiceTypeFilter';

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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'Cele mai recente', icon: 'down' },
    { value: 'oldest', label: 'Cele mai vechi', icon: 'up' }
  ];

  const selectedSort = sortOptions.find(s => s.value === sortBy);

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4 mb-4 sm:mb-6 relative z-40">
      {/* Main filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3">
        <CountryFilter value={countryFilter} onChange={onCountryChange} />
        <ServiceTypeFilter value={serviceFilter} onChange={onServiceChange} />

        {/* Sort Filter */}
        <div ref={sortDropdownRef} className="relative z-30">
          <label className="block text-xs text-gray-400 mb-1.5">Sortare</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left text-sm"
            >
              <div className="w-5 h-5 rounded-lg bg-slate-700 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {selectedSort?.icon === 'down' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h6m3 0h9m-9 4h6m-9 4h13m-4 0l-4 4m0 0l-4-4m4 4V8" />
                  )}
                </svg>
              </div>
              <span className="flex-1">{selectedSort?.label || 'Sortare'}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isSortOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                        sortBy === option.value 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-gray-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-lg bg-slate-700 flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {option.icon === 'down' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h6m3 0h9m-9 4h6m-9 4h13m-4 0l-4 4m0 0l-4-4m4 4V8" />
                          )}
                        </svg>
                      </div>
                      <span className="flex-1 text-left">{option.label}</span>
                      {sortBy === option.value && (
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Caută după număr comandă (#CP141135) sau oraș..."
          className="form-input w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
