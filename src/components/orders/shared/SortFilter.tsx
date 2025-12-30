'use client';

import { useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SortFilterProps {
  value: string;
  onChange: (value: string) => void;
  storageKey: string;
}

const sortOptions = [
  { value: 'newest', label: 'Cele mai recente', icon: 'down' },
  { value: 'oldest', label: 'Cele mai vechi', icon: 'up' }
];

export default function SortFilter({ value, onChange, storageKey }: SortFilterProps) {
  const [isOpen, setIsOpen] = useLocalStorage(storageKey, false);
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
  }, [setIsOpen]);

  const selectedSort = sortOptions.find(s => s.value === value);

  return (
    <div ref={dropdownRef} className="relative z-30">
      <label className="block text-[10px] xs:text-xs text-gray-400 mb-1 xs:mb-1.5">Sortare</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-1.5 xs:gap-2 sm:gap-3 px-2.5 xs:px-3 py-2.5 xs:py-3 sm:py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left text-xs xs:text-sm min-h-10 xs:min-h-12 sm:min-h-11 touch-manipulation"
        >
          <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-lg bg-slate-700 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {selectedSort?.icon === 'down' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h6m3 0h9m-9 4h6m-9 4h13m-4 0l-4 4m0 0l-4-4m4 4V8" />
              )}
            </svg>
          </div>
          <span className="flex-1">{selectedSort?.label || 'Sortare'}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    value === option.value 
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
                  {value === option.value && (
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
