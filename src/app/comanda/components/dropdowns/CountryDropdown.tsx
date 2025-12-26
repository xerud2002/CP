'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { countries } from '@/lib/constants';

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  onCountryChange?: () => void; // Optional callback when country changes (e.g., to clear region)
}

export default function CountryDropdown({ value, onChange, label, onCountryChange }: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = useMemo(
    () => countries.find(c => c.code === value),
    [value]
  );

  // Normalizează textul pentru căutare fără diacritice
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimină diacriticele
      .replace(/ă/g, 'a')
      .replace(/â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/ș/g, 's')
      .replace(/ț/g, 't');
  };

  const filteredCountries = useMemo(
    () => countries.filter(c => normalizeText(c.name).includes(normalizeText(searchQuery))),
    [searchQuery]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label} *</label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="form-select w-full flex items-center gap-3 cursor-pointer"
          aria-label={label}
        >
          <Image 
            src={`/img/flag/${value.toLowerCase()}.svg`} 
            alt={`Steagul ${selectedCountry?.name || ''}`}
            width={24} 
            height={18} 
            className="rounded-sm shadow-sm shrink-0"
            unoptimized
            onError={(e) => {
              console.error(`Flag load error for: ${value}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="flex-1 text-left">{selectedCountry?.name || 'Selectează'}</span>
          <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-100 mt-1 w-full bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-white/10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută..."
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Caută ${label.toLowerCase()}`}
              />
            </div>
            <div className="overflow-y-auto max-h-48 dropdown-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      onCountryChange?.();
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors ${
                      value === c.code ? 'bg-slate-700/50' : ''
                    }`}
                  >
                    <Image
                      src={c.flag}
                      alt={c.name}
                      width={24}
                      height={18}
                      className="rounded-sm shrink-0"
                    />
                    <span className="text-white text-sm">{c.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-400 text-sm">
                  Nu s-au găsit rezultate
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
