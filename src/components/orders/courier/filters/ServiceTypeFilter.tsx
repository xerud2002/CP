'use client';

import React, { useState, useRef, useEffect } from 'react';
import { serviceTypes } from '@/lib/constants';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

interface ServiceTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServiceTypeFilter({ value, onChange }: ServiceTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedService = serviceTypes.find(s => s.value === value);

  return (
    <div ref={dropdownRef} className="relative z-70">
      <label className="block text-xs text-gray-400 mb-1.5">Tip serviciu</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left text-sm"
        >
          {value === 'all' ? (
            <>
              <div className="w-5 h-5 rounded-lg bg-slate-700 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="flex-1">Toate serviciile</span>
            </>
          ) : (
            <>
              <div className={`w-5 h-5 rounded-lg ${selectedService?.bgColor || 'bg-slate-700'} flex items-center justify-center`}>
                <ServiceIcon service={value} className={`w-3 h-3 ${selectedService?.color || 'text-gray-400'}`} />
              </div>
              <span className="flex-1">{selectedService?.label || value}</span>
            </>
          )}
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <button
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  value === 'all' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <div className="w-5 h-5 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <span className="flex-1 text-left">Toate serviciile</span>
                {value === 'all' && (
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              {serviceTypes.map((service) => (
                <button
                  key={service.value}
                  onClick={() => {
                    onChange(service.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    value === service.value 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg ${service.bgColor} flex items-center justify-center`}>
                    <ServiceIcon service={service.value} className={`w-3 h-3 ${service.color}`} />
                  </div>
                  <span className="flex-1 text-left">{service.label}</span>
                  {value === service.value && (
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
  );
}
