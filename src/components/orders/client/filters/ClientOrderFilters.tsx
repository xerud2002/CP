'use client';

import React from 'react';
import { serviceTypes } from '@/lib/constants';

interface ClientOrderFiltersProps {
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
}

export default function ClientOrderFilters({
  serviceFilter,
  onServiceFilterChange
}: ClientOrderFiltersProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Filtrează după serviciu
      </label>
      <select
        value={serviceFilter}
        onChange={(e) => onServiceFilterChange(e.target.value)}
        className="form-select w-full sm:w-64"
      >
        <option value="">Toate serviciile</option>
        {serviceTypes.map(service => (
          <option key={service.id} value={service.id}>
            {service.label}
          </option>
        ))}
      </select>
    </div>
  );
}
