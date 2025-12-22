'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { countries } from '@/lib/constants';

interface CountryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountryFilter({ value, onChange }: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    return countries.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = countries.find(c => c.code === value);

  return (
    <div ref={dropdownRef} className="relative z-30">
      <label className="block text-xs text-gray-400 mb-1.5">Țară</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left text-sm"
        >
          {value === 'all' ? (
            <>
              <div className="w-5 h-4 rounded bg-slate-700 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="flex-1">Toate țările</span>
            </>
          ) : (
            <>
              <Image 
                src={`/img/flag/${selectedCountry?.code}.svg`}
                alt={selectedCountry?.name || ''}
                width={20}
                height={15}
                className="rounded"
              />
              <span className="flex-1">{selectedCountry?.name}</span>
            </>
          )}
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-[9998] sm:hidden"
              onClick={() => {
                setIsOpen(false);
                setSearch('');
              }}
            />
            <div className="fixed sm:absolute top-auto sm:top-full left-0 right-0 sm:left-0 sm:right-0 bottom-0 sm:bottom-auto mt-0 sm:mt-2 max-h-[70vh] sm:max-h-auto bg-slate-900 border-t sm:border border-white/10 rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden z-[9999] animate-in slide-in-from-bottom sm:slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-white/5">
              <input
                type="text"
                placeholder="Caută țară..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="max-h-[calc(70vh-4rem)] sm:max-h-64 overflow-y-auto custom-scrollbar">
              <button
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  value === 'all' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <div className="w-5 h-4 rounded bg-slate-700 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex-1 text-left">Toate țările</span>
                {value === 'all' && (
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onChange(country.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    value === country.code 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <Image 
                    src={`/img/flag/${country.code}.svg`}
                    alt={country.name}
                    width={20}
                    height={15}
                    className="rounded"
                  />
                  <span className="flex-1 text-left">{country.name}</span>
                  {value === country.code && (
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-3 py-8 text-center text-gray-500 text-sm">
                  Nicio țară găsită
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
