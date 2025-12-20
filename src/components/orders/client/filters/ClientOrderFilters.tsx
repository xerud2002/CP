'use client';

import React from 'react';
import Image from 'next/image';
import { serviceTypes, countries } from '@/lib/constants';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

interface ClientOrderFiltersProps {
  countryFilter: string;
  serviceFilter: string;
  onCountryChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function ClientOrderFilters({
  countryFilter,
  serviceFilter,
  onCountryChange,
  onServiceChange,
  hasActiveFilters,
  onClearFilters
}: ClientOrderFiltersProps) {
  const selectedService = serviceTypes.find(s => s.id === serviceFilter);
  const selectedCountry = countries.find(c => c.code === countryFilter);

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/5 p-2 sm:p-3 mb-4 sm:mb-6 relative z-40">
      {/* Filters panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {/* Country Filter */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 sm:mb-2">
            Țară
          </label>
          <div className="relative">
            <select
              value={countryFilter}
              onChange={(e) => onCountryChange(e.target.value)}
              className="form-select w-full pl-10"
            >
              <option value="all">Toate țările</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {/* Flag icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {selectedCountry ? (
                <Image 
                  src={`/img/flag/${selectedCountry.code.toLowerCase()}.svg`}
                  alt={selectedCountry.name}
                  width={20}
                  height={15}
                  className="rounded"
                />
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Service Filter */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 sm:mb-2">
            Serviciu
          </label>
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => onServiceChange(e.target.value)}
              className="form-select w-full pl-10"
            >
              <option value="all">Toate serviciile</option>
              {serviceTypes.map(service => (
                <option key={service.id} value={service.id}>
                  {service.label}
                </option>
              ))}
            </select>
            {/* Service icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {selectedService ? (
                <div className={`w-5 h-5 ${selectedService.color}`}>
                  <ServiceIcon service={selectedService.id} />
                </div>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </div>
          </div>
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
