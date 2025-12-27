'use client';

import React from 'react';
import Image from 'next/image';
import { countries } from '@/lib/constants';

// Helper to get country data with lowercase code
const getCountryData = (countryName: string | undefined) => {
  const country = countries.find(c => c.name === countryName) || countries.find(c => c.code === 'RO')!;
  return { ...country, code: country.code.toLowerCase() };
};

interface OrderRouteSectionProps {
  pickupCountry?: string;
  pickupRegion: string;
  pickupCity?: string;
  deliveryCountry?: string;
  deliveryRegion: string;
  deliveryCity?: string;
}

export default function OrderRouteSection({
  pickupCountry,
  pickupRegion,
  pickupCity,
  deliveryCountry,
  deliveryRegion,
  deliveryCity
}: OrderRouteSectionProps) {
  const getCountryData = (countryName?: string) => {
    if (!countryName) return { code: 'ro', name: 'România' };
    const country = countryName.toLowerCase().trim();
    const matched = countries.find(c => 
      c.name.toLowerCase() === country || 
      c.code.toLowerCase() === country
    );
    return matched || { code: 'ro', name: countryName };
  };

  const capitalize = (str?: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const pickupData = getCountryData(pickupCountry);
  const deliveryData = getCountryData(deliveryCountry);

  return (
    <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Rută Transport</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pickup */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-400 text-xs font-medium uppercase">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Ridicare
          </div>
          <div className="flex items-center gap-2">
            <Image 
              src={`/img/flag/${pickupData.code.toLowerCase()}.svg`}
              alt={pickupData.name}
              width={20}
              height={15}
              className="rounded"
              unoptimized
            />
            <span className="text-white font-medium">{pickupData.name}</span>
          </div>
          {pickupCity && (
            <div>
              <p className="text-xs text-gray-500">Oraș</p>
              <p className="text-gray-300 font-medium">{capitalize(pickupCity)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">Județ / Regiune</p>
            <p className="text-gray-300 font-medium">{pickupRegion}</p>
          </div>
        </div>

        {/* Delivery */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-400 text-xs font-medium uppercase">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Livrare
          </div>
          <div className="flex items-center gap-2">
            <Image 
              src={`/img/flag/${deliveryData.code.toLowerCase()}.svg`}
              alt={deliveryData.name}
              width={20}
              height={15}
              className="rounded"
              unoptimized
            />
            <span className="text-white font-medium">{deliveryData.name}</span>
          </div>
          {deliveryCity && (
            <div>
              <p className="text-xs text-gray-500">Oraș</p>
              <p className="text-gray-300 font-medium">{capitalize(deliveryCity)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">Județ / Regiune</p>
            <p className="text-gray-300 font-medium">{deliveryRegion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
