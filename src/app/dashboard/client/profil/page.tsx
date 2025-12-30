'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeftIcon, UserIcon, CheckIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { NotificationToggle } from '@/components/ui/NotificationToggle';
import { countries, judetByCountry } from '@/lib/constants';
import { COUNTRY_TAX_INFO } from '@/lib/businessInfo';
import { showSuccess, showError } from '@/lib/toast';

interface ClientProfile {
  nume: string;
  prenume: string;
  telefon: string;
  telefonPrefix: string;
  email: string;
  tara: string;
  judet: string;
  oras: string;
  adresa: string;
  cod_postal: string;
  companie?: string;
  cui?: string;
}

const phonePrefixes = [
  { code: 'ro', name: '+40', flag: '/img/flag/ro.svg' },
  { code: 'gb', name: '+44', flag: '/img/flag/gb.svg' },
  { code: 'it', name: '+39', flag: '/img/flag/it.svg' },
  { code: 'es', name: '+34', flag: '/img/flag/es.svg' },
  { code: 'de', name: '+49', flag: '/img/flag/de.svg' },
  { code: 'fr', name: '+33', flag: '/img/flag/fr.svg' },
  { code: 'at', name: '+43', flag: '/img/flag/at.svg' },
  { code: 'be', name: '+32', flag: '/img/flag/be.svg' },
  { code: 'nl', name: '+31', flag: '/img/flag/nl.svg' },
  { code: 'gr', name: '+30', flag: '/img/flag/gr.svg' },
  { code: 'pt', name: '+351', flag: '/img/flag/pt.svg' },
  { code: 'ie', name: '+353', flag: '/img/flag/ie.svg' },
];

export default function ProfilClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile>({
    nume: '',
    prenume: '',
    telefon: '',
    telefonPrefix: 'ro',
    email: user?.email || '',
    tara: 'RO',
    judet: '',
    oras: '',
    adresa: '',
    cod_postal: '',
    companie: '',
    cui: '',
  });
  const [saving, setSaving] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [judetDropdownOpen, setJudetDropdownOpen] = useState(false);
  const [prefixDropdownOpen, setPrefixDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [judetSearch, setJudetSearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const judetDropdownRef = useRef<HTMLDivElement>(null);
  const prefixDropdownRef = useRef<HTMLDivElement>(null);
  const prefixMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
        setCountryDropdownOpen(false);
      }
      if (judetDropdownRef.current && !judetDropdownRef.current.contains(target)) {
        setJudetDropdownOpen(false);
      }
      // Check both button container and dropdown menu for prefix
      const clickedInsidePrefix = prefixDropdownRef.current?.contains(target) || prefixMenuRef.current?.contains(target);
      if (!clickedInsidePrefix) {
        setPrefixDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'profil_client', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as ClientProfile;
        const normalizedData = {
          ...data,
          tara: data.tara?.toUpperCase() || 'RO',
        };
        setProfile(prev => ({ ...prev, ...normalizedData, email: user.email || '' }));
      } else {
        setProfile(prev => ({ ...prev, email: user.email || '' }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showError('Eroare la încărcarea profilului');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      await setDoc(doc(db, 'profil_client', user.uid), {
        ...profile,
        updatedAt: serverTimestamp(),
      });
      
      showSuccess('Profil salvat cu succes!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  // Memoized filtered countries for search
  const filteredCountries = useMemo(() => 
    countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())),
    [countrySearch]
  );

  // Memoized filtered judete for search
  const filteredJudete = useMemo(() => 
    (judetByCountry[profile.tara] || []).filter(j => 
      j.toLowerCase().includes(judetSearch.toLowerCase())
    ),
    [profile.tara, judetSearch]
  );

  // Get current country flag
  const currentCountryFlag = useMemo(() => 
    countries.find(c => c.code === profile.tara)?.flag || '/img/flag/ro.svg',
    [profile.tara]
  );

  // Get current country name
  const currentCountryName = useMemo(() => 
    countries.find(c => c.code === profile.tara)?.name || 'România',
    [profile.tara]
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/dashboard/client" 
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">Profilul Tău</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Date personale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-400" />
              Informații Personale
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nume *</label>
                <input
                  type="text"
                  value={profile.nume}
                  onChange={(e) => setProfile({ ...profile, nume: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prenume *</label>
                <input
                  type="text"
                  value={profile.prenume}
                  onChange={(e) => setProfile({ ...profile, prenume: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Număr telefon *</label>
                <div className="flex gap-2">
                  {/* Custom Prefix Dropdown */}
                  <div className="relative" ref={prefixDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrefixDropdownOpen(!prefixDropdownOpen);
                      }}
                      className="w-32 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-700/70 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Image
                        src={phonePrefixes.find(p => p.code === profile.telefonPrefix)?.flag || '/img/flag/ro.svg'}
                        alt={`Steag ${phonePrefixes.find(p => p.code === profile.telefonPrefix)?.name || 'România'}`}
                        width={20}
                        height={14}
                        className="rounded-sm shrink-0"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                      <span>{phonePrefixes.find(p => p.code === profile.telefonPrefix)?.name || '+40'}</span>
                      <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {prefixDropdownOpen && (
                      <div ref={prefixMenuRef} className="fixed z-9999 w-32 bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{
                        top: prefixDropdownRef.current ? `${prefixDropdownRef.current.getBoundingClientRect().bottom + 4}px` : '0',
                        left: prefixDropdownRef.current ? `${prefixDropdownRef.current.getBoundingClientRect().left}px` : '0'
                      }}>
                        {phonePrefixes.map((p) => (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => {
                              setProfile({ ...profile, telefonPrefix: p.code });
                              setPrefixDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 transition-colors ${
                              profile.telefonPrefix === p.code ? 'bg-slate-700/50' : ''
                            }`}
                          >
                            <Image
                              src={p.flag}
                              alt=""
                              width={20}
                              height={14}
                              className="rounded-sm shrink-0"
                              style={{ width: 'auto', height: 'auto' }}
                            />
                            <span className="text-white text-sm">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={profile.telefon}
                    onChange={(e) => setProfile({ ...profile, telefon: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="7xx xxx xxx"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 bg-slate-700/30 border border-white/5 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Adresă</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Țară *</label>
                <div className="relative" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCountryDropdownOpen(!countryDropdownOpen);
                    }}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-700/70 transition-colors flex items-center gap-3 cursor-pointer focus:outline-none"
                    aria-label="Selectează țară"
                  >
                    <Image
                      src={currentCountryFlag}
                      alt={`Flag of ${currentCountryName}`}
                      width={24}
                      height={16}
                      className="rounded-sm shrink-0"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                    <span className="flex-1 text-left truncate">{currentCountryName}</span>
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {countryDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col dropdown-scrollbar">
                      {/* Search box */}
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Caută țară..."
                          className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {/* Scrollable list */}
                      <div className="overflow-y-auto max-h-48 dropdown-scrollbar">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setProfile(prev => ({ ...prev, tara: c.code, judet: '' }));
                                setCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-700 transition-colors ${
                                profile.tara === c.code ? 'bg-slate-700/50' : ''
                              }`}
                              aria-label={`Selectează ${c.name}`}
                            >
                              <Image
                                src={c.flag}
                                alt={`Flag of ${c.name}`}
                                width={24}
                                height={16}
                                className="rounded-sm shrink-0"
                                style={{ width: 'auto', height: 'auto' }}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Județ/Regiune *</label>
                <div className="relative" ref={judetDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setJudetDropdownOpen(!judetDropdownOpen);
                    }}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-700/70 transition-colors flex items-center gap-3 cursor-pointer focus:outline-none"
                    aria-label="Selectează județ sau regiune"
                  >
                    <Image
                      src={currentCountryFlag}
                      alt={`Steagul ${currentCountryName}`}
                      width={20}
                      height={14}
                      className="rounded-sm shrink-0"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                    <span className="flex-1 text-left truncate">{profile.judet || 'Selectează județ/regiune'}</span>
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${judetDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {judetDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col dropdown-scrollbar">
                      {/* Search box */}
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          value={judetSearch}
                          onChange={(e) => setJudetSearch(e.target.value)}
                          placeholder="Caută județ/regiune..."
                          className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Caută județ sau regiune"
                        />
                      </div>
                      {/* Scrollable list */}
                      <div className="overflow-y-auto max-h-48 dropdown-scrollbar">
                        {filteredJudete.length > 0 ? (
                          filteredJudete.map((judet) => (
                            <button
                              key={judet}
                              type="button"
                              onClick={() => {
                                setProfile(prev => ({ ...prev, judet }));
                                setJudetDropdownOpen(false);
                                setJudetSearch('');
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-700 transition-colors ${
                                profile.judet === judet ? 'bg-slate-700/50' : ''
                              }`}
                              aria-label={`Selectează ${judet}`}
                            >
                              <Image
                                src={currentCountryFlag}
                                alt={`Steagul ${currentCountryName}`}
                                width={20}
                                height={14}
                                className="rounded-sm shrink-0"
                                style={{ width: 'auto', height: 'auto' }}
                              />
                              <span className="text-white text-sm">{judet}</span>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Oraș *</label>
                <input
                  type="text"
                  value={profile.oras}
                  onChange={(e) => setProfile({ ...profile, oras: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cod Poștal</label>
                <input
                  type="text"
                  value={profile.cod_postal}
                  onChange={(e) => setProfile({ ...profile, cod_postal: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Adresă completă *</label>
                <input
                  type="text"
                  value={profile.adresa}
                  onChange={(e) => setProfile({ ...profile, adresa: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Stradă, număr, bloc, etc."
                  required
                />
              </div>
            </div>
          </div>

          {/* Company (optional) */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Date Companie (opțional)</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nume Companie</label>
                <input
                  type="text"
                  value={profile.companie}
                  onChange={(e) => setProfile({ ...profile, companie: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="SC Exemplu SRL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {COUNTRY_TAX_INFO[profile.tara]?.taxLabel || 'CUI/CIF'}
                </label>
                <input
                  type="text"
                  value={profile.cui}
                  onChange={(e) => setProfile({ ...profile, cui: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder={COUNTRY_TAX_INFO[profile.tara]?.taxPlaceholder || 'RO12345678'}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              saving
                ? 'bg-emerald-500/50 text-emerald-200 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Se salvează...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5" />
                Salvează Profilul
              </>
            )}
          </button>
        </form>

        {/* Notifications Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl mt-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            Notificări
          </h2>
          <p className="text-gray-400 mb-4">
            Primește notificări push pentru mesaje de la curieri și actualizări comenzi
          </p>
          <NotificationToggle userId={user?.uid} />
        </div>

        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>
    </div>
  );
}
