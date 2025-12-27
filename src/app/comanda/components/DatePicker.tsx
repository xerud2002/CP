'use client';
import { useState, useRef, useEffect } from 'react';

const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
const dayNames = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  accentColor?: 'orange' | 'blue';
  error?: string;
}

export default function DatePicker({ 
  value, 
  onChange, 
  label, 
  placeholder = 'Alege o dată',
  accentColor = 'orange',
  error
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync month/year with selected value when opening
  useEffect(() => {
    if (isOpen && value) {
      const date = new Date(value);
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    }
  }, [isOpen, value]);

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  
  const getFirstDayOfMonth = (m: number, y: number) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isDateDisabled = (day: number, m: number, y: number) => {
    const date = new Date(y, m, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(year, month, day);
    const formattedValue = date.toISOString().split('T')[0];
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const iconColor = accentColor === 'orange' ? 'text-orange-400' : 'text-blue-400';
  const hoverBorder = accentColor === 'orange' ? 'hover:border-orange-500/50' : 'hover:border-blue-500/50';
  const focusRing = accentColor === 'orange' ? 'focus:ring-orange-500/50' : 'focus:ring-blue-500/50';
  const selectedBg = accentColor === 'orange' 
    ? 'bg-linear-to-br from-orange-600 to-amber-600' 
    : 'bg-linear-to-br from-blue-600 to-cyan-600';

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label} *</label>}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-left text-white ${hoverBorder} transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 ${focusRing}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <svg className={`w-5 h-5 ${iconColor} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {value ? (
              <span className="text-sm truncate">{formatDateDisplay(value)}</span>
            ) : (
              <span className="text-gray-400 text-sm">{placeholder}</span>
            )}
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-semibold text-white">{monthNames[month]} {year}</span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 px-3 pt-3">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 p-3">
              {Array.from({ length: getFirstDayOfMonth(month, year) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              {Array.from({ length: getDaysInMonth(month, year) }).map((_, i) => {
                const day = i + 1;
                const isDisabled = isDateDisabled(day, month, year);
                const isSelected = value && 
                  new Date(value).getDate() === day &&
                  new Date(value).getMonth() === month &&
                  new Date(value).getFullYear() === year;
                
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDisabled 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : isSelected
                          ? `${selectedBg} text-white shadow-lg`
                          : 'text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
