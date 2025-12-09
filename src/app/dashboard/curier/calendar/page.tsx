'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { ArrowLeftIcon, CloseIcon, CalendarIcon, TrashIcon } from '@/components/icons/DashboardIcons';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CalendarEntry {
  id: string;
  tara: string;
  data: string;
  dataTimestamp: Date;
}

// Lista de țări cu coduri pentru steaguri (sortată alfabetic)
const countriesWithCodes = [
  { name: 'Anglia', code: 'gb' },
  { name: 'Austria', code: 'at' },
  { name: 'Belgia', code: 'be' },
  { name: 'Danemarca', code: 'dk' },
  { name: 'Finlanda', code: 'fi' },
  { name: 'Franța', code: 'fr' },
  { name: 'Germania', code: 'de' },
  { name: 'Grecia', code: 'gr' },
  { name: 'Irlanda', code: 'ie' },
  { name: 'Italia', code: 'it' },
  { name: 'Norvegia', code: 'no' },
  { name: 'Olanda', code: 'nl' },
  { name: 'Portugalia', code: 'pt' },
  { name: 'România', code: 'ro' },
  { name: 'Spania', code: 'es' },
  { name: 'Suedia', code: 'se' },
];

export default function CalendarColectiiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);
  
  // Custom dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);
  
  // Custom calendar picker state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isCountryDropdownOpen && countrySearchRef.current) {
      countrySearchRef.current.focus();
    }
  }, [isCountryDropdownOpen]);

  // Load saved entries from Firebase
  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'calendar_colectii'),
          where('uid', '==', user.uid),
          orderBy('dataTimestamp', 'asc')
        );
        const snapshot = await getDocs(q);
        const loadedEntries: CalendarEntry[] = [];
        const entriesToDelete: string[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const entryDate = data.dataTimestamp?.toDate();
          
          // Check if date is in the past
          if (entryDate && entryDate < today) {
            // Mark for deletion
            entriesToDelete.push(docSnapshot.id);
          } else {
            loadedEntries.push({
              id: docSnapshot.id,
              tara: data.tara,
              data: data.data,
              dataTimestamp: entryDate,
            });
          }
        });
        
        // Delete past entries automatically
        if (entriesToDelete.length > 0) {
          const batch = writeBatch(db);
          entriesToDelete.forEach((entryId) => {
            batch.delete(doc(db, 'calendar_colectii', entryId));
          });
          await batch.commit();
          console.log(`Auto-deleted ${entriesToDelete.length} past entries`);
        }
        
        setEntries(loadedEntries);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setLoadingEntries(false);
      }
    };

    if (user) {
      loadEntries();
    }
  }, [user]);

  // Group entries by country
  const entriesByCountry = useMemo(() => {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.tara]) {
        acc[entry.tara] = [];
      }
      acc[entry.tara].push(entry);
      return acc;
    }, {} as Record<string, CalendarEntry[]>);
  }, [entries]);

  // Filter countries for dropdown
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countriesWithCodes;
    return countriesWithCodes.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Get country code by name
  const getCountryCode = (name: string) => {
    return countriesWithCodes.find(c => c.name === name)?.code || '';
  };

  const handleSelectCountry = (countryName: string) => {
    setSelectedCountry(countryName);
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
  };

  // Calendar helper functions
  const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 
                      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
  const dayNames = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday-first (0 = Monday)
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(calendarYear, calendarMonth, day);
    const formattedValue = date.toISOString().split('T')[0]; // YYYY-MM-DD for internal use
    setSelectedDate(formattedValue);
    setIsCalendarOpen(false);
  };

  const goToPrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('ro-RO', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleAddEntry = async () => {
    if (!selectedCountry || !selectedDate || !user) return;

    // Format date to Romanian format
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Check if already exists
    const exists = entries.some(e => e.tara === selectedCountry && e.data === formattedDate);
    if (exists) {
      alert('Această dată există deja pentru țara selectată!');
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'calendar_colectii'), {
        uid: user.uid,
        tara: selectedCountry,
        data: formattedDate,
        dataTimestamp: dateObj,
        addedAt: serverTimestamp(),
      });

      setEntries([...entries, {
        id: docRef.id,
        tara: selectedCountry,
        data: formattedDate,
        dataTimestamp: dateObj,
      }]);

      setSelectedDate('');
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Sigur vrei să ștergi această dată?')) return;

    try {
      await deleteDoc(doc(db, 'calendar_colectii', entryId));
      setEntries(entries.filter(e => e.id !== entryId));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  const handleDeleteCountry = async (countryName: string) => {
    const countryEntries = entriesByCountry[countryName] || [];
    if (countryEntries.length === 0) return;

    if (!confirm(`Sigur dorești să ștergi toate cele ${countryEntries.length} date de colecție pentru ${countryName}?`)) {
      return;
    }

    try {
      const batch = writeBatch(db);
      countryEntries.forEach((entry) => {
        batch.delete(doc(db, 'calendar_colectii', entry.id));
      });
      await batch.commit();

      setEntries((prev) => prev.filter((e) => e.tara !== countryName));
    } catch (error) {
      console.error('Error deleting country entries:', error);
      alert('Eroare la ștergere. Încercați din nou.');
    }
  };

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    // dateString is already in DD.MM.YYYY format from Firebase
    const parts = dateString.split('.');
    if (parts.length !== 3) return dateString;
    
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('ro-RO', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  // Stats (all entries are now future dates since past ones are auto-deleted)
  const totalEntries = entries.length;
  const totalCountries = Object.keys(entriesByCountry).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/20">
                <CalendarIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Calendar Colecții</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Programează datele de colecție pentru fiecare țară</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-emerald-500/20 rounded-lg sm:rounded-xl">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{totalEntries}</p>
                <p className="text-xs text-gray-400">Total date</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-blue-500/20 rounded-lg sm:rounded-xl">
                <span className="text-sm sm:text-lg">🌍</span>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{totalCountries}</p>
                <p className="text-xs text-gray-400">Țări active</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-purple-500/20 rounded-lg sm:rounded-xl">
                <span className="text-sm sm:text-lg">✅</span>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">Auto</p>
                <p className="text-xs text-gray-400">Curățare</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Entry Form */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <span>Adaugă dată de colecție</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Custom Country Dropdown */}
            <div className="relative" ref={countryDropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Țara</label>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-left text-white hover:border-purple-500/50 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <div className="flex items-center gap-3">
                  {selectedCountry ? (
                    <>
                      <Image
                        src={`/img/flag/${getCountryCode(selectedCountry)}.svg`}
                        alt={selectedCountry}
                        width={24}
                        height={18}
                        className="rounded shadow-sm"
                      />
                      <span>{selectedCountry}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Selectează o țară</span>
                  )}
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-white/5">
                    <input
                      ref={countrySearchRef}
                      type="text"
                      placeholder="Caută țara..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                    />
                  </div>
                  {/* Country List */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <div className="px-4 py-3 text-gray-400 text-sm">Nicio țară găsită</div>
                    ) : (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleSelectCountry(country.name)}
                          className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors flex items-center gap-3 ${
                            selectedCountry === country.name ? 'bg-purple-500/20 text-purple-300' : 'text-white'
                          }`}
                        >
                          <Image
                            src={`/img/flag/${country.code}.svg`}
                            alt={country.name}
                            width={24}
                            height={18}
                            className="rounded shadow-sm"
                          />
                          <span>{country.name}</span>
                          {selectedCountry === country.name && (
                            <svg className="w-5 h-5 ml-auto text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div className="relative" ref={calendarRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data Colecție</label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-left text-white hover:border-purple-500/50 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  {selectedDate ? (
                    <span>{formatSelectedDate()}</span>
                  ) : (
                    <span className="text-gray-400">Selectează o dată</span>
                  )}
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCalendarOpen && (
                <div className="absolute z-50 mt-2 w-full sm:w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <button
                      onClick={goToPrevMonth}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="font-semibold text-white">
                      {monthNames[calendarMonth]} {calendarYear}
                    </span>
                    <button
                      onClick={goToNextMonth}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 px-3 pt-3">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1 p-3">
                    {/* Empty cells for days before the first day of the month */}
                    {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-10" />
                    ))}
                    
                    {/* Days of the month */}
                    {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, i) => {
                      const day = i + 1;
                      const isDisabled = isDateDisabled(day);
                      const isToday = new Date().getDate() === day && 
                                      new Date().getMonth() === calendarMonth && 
                                      new Date().getFullYear() === calendarYear;
                      const isSelected = selectedDate && 
                                        new Date(selectedDate).getDate() === day &&
                                        new Date(selectedDate).getMonth() === calendarMonth &&
                                        new Date(selectedDate).getFullYear() === calendarYear;
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          disabled={isDisabled}
                          className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isDisabled 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : isSelected
                                ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                : isToday
                                  ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                  : 'text-white hover:bg-slate-700/50'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between px-3 pb-3">
                    <button
                      onClick={() => {
                        const today = new Date();
                        setCalendarMonth(today.getMonth());
                        setCalendarYear(today.getFullYear());
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Astăzi
                    </button>
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate('')}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                      >
                        Șterge
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleAddEntry}
                disabled={!selectedCountry || !selectedDate || saving}
                className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Se salvează...</span>
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-5 h-5" />
                    <span>Adaugă data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Entries */}
        <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
            </div>
            Program Colecții Salvate
          </h2>
          
          {loadingEntries ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : Object.keys(entriesByCountry).length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl sm:text-7xl mb-4">📭</div>
              <p className="text-gray-300 text-lg font-medium">Nu ai nicio dată de colecție salvată</p>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                Adaugă prima ta dată de colecție folosind formularul de mai sus pentru a-ți anunța clienții când vei fi disponibil.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(entriesByCountry).map(([country, countryEntries]) => {
                const countryCode = getCountryCode(country);
                
                return (
                  <div 
                    key={country} 
                    className="bg-slate-900/50 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-200"
                  >
                    {/* Country Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                      {countryCode && (
                        <Image
                          src={`/img/flag/${countryCode}.svg`}
                          alt={country}
                          width={32}
                          height={24}
                          className="rounded shadow-md"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{country}</h3>
                        <p className="text-xs text-gray-400">
                          {countryEntries.length} {countryEntries.length === 1 ? 'dată' : 'date'} programate
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCountry(country)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title={`Șterge toate datele pentru ${country}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Dates List */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {countryEntries.map((entry) => (
                        <div 
                          key={entry.id} 
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 bg-slate-800/50 hover:bg-slate-800/80"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-purple-400">📅</span>
                            <span className="text-sm text-white">
                              {formatDateDisplay(entry.data)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                            title="Șterge"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
