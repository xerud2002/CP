/**
 * Centralized Service Icons Component
 * Single source of truth for all service type icons across the application
 * Used in: comanda/page, client/comenzi, curier/comenzi, curier/servicii
 */

import React from 'react';

export type ServiceType = 
  | 'colete' 
  | 'plicuri' 
  | 'persoane' 
  | 'electronice' 
  | 'animale' 
  | 'platforma' 
  | 'tractari' 
  | 'mobila' 
  | 'paleti';

interface ServiceIconProps {
  service: string;
  className?: string;
}

/**
 * Normalizes service name to match icon keys
 * Handles both capitalized ('Colete') and lowercase ('colete') inputs
 */
const normalizeServiceName = (name: string): ServiceType => {
  const normalized = name.toLowerCase().trim() as ServiceType;
  
  // Direct match
  const validServices: ServiceType[] = [
    'colete', 'plicuri', 'persoane', 'electronice', 
    'animale', 'platforma', 'tractari', 'mobila', 'paleti'
  ];
  
  if (validServices.includes(normalized)) {
    return normalized;
  }
  
  // Fallback to colete for unknown services
  return 'colete';
};

/**
 * Service Icon Component
 * Renders SVG icon based on service type with consistent styling
 * 
 * @param service - Service type (e.g., 'colete', 'Colete', 'persoane')
 * @param className - Optional Tailwind classes for size/color (default: "w-6 h-6")
 * 
 * @example
 * <ServiceIcon service="colete" className="w-5 h-5 text-blue-400" />
 */
export const ServiceIcon: React.FC<ServiceIconProps> = ({ 
  service, 
  className = "w-6 h-6" 
}) => {
  const normalizedService = normalizeServiceName(service);
  
  const iconMap: Record<ServiceType, React.ReactElement> = {
    colete: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m3.3 7 8.7 5 8.7-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    plicuri: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    persoane: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    electronice: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    animale: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3.5-2c-.83 0-1.5.67-1.5 1.5S8.67 7 9.5 7s1.5-.67 1.5-1.5S10.33 4 9.5 4zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2.5 9c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    platforma: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="16" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="20" r="1" />
        <circle cx="16" cy="20" r="1" />
        <path d="M12 16V4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tractari: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M5 17h-2a1 1 0 0 1-1-1v-5l3-3h14l3 3v5a1 1 0 0 1-1 1h-2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 17 6-6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m15 11 4 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mobila: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 18v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 18v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    paleti: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 6v12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return iconMap[normalizedService] || iconMap.colete;
};

/**
 * Service icon metadata with colors for badges/cards
 * Use this when you need both icon and styling information
 */
export const serviceIconMetadata: Record<ServiceType, { 
  icon: React.ReactElement; 
  color: string; 
  bg: string;
}> = {
  colete: {
    icon: <ServiceIcon service="colete" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20'
  },
  plicuri: {
    icon: <ServiceIcon service="plicuri" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20'
  },
  persoane: {
    icon: <ServiceIcon service="persoane" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20'
  },
  electronice: {
    icon: <ServiceIcon service="electronice" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20'
  },
  animale: {
    icon: <ServiceIcon service="animale" />,
    color: 'text-pink-400',
    bg: 'bg-pink-500/20'
  },
  platforma: {
    icon: <ServiceIcon service="platforma" />,
    color: 'text-red-400',
    bg: 'bg-red-500/20'
  },
  tractari: {
    icon: <ServiceIcon service="tractari" />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20'
  },
  mobila: {
    icon: <ServiceIcon service="mobila" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20'
  },
  paleti: {
    icon: <ServiceIcon service="paleti" />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20'
  },
};

/**
 * Get service icon metadata by service name
 * Returns icon component, color, and background classes
 * 
 * @param service - Service name (case-insensitive)
 * @returns Object with icon, color, and bg properties
 * 
 * @example
 * const { icon, color, bg } = getServiceIconMetadata('colete');
 * <div className={bg}>{icon}</div>
 */
export const getServiceIconMetadata = (service: string) => {
  const normalized = normalizeServiceName(service);
  return serviceIconMetadata[normalized] || serviceIconMetadata.colete;
};
