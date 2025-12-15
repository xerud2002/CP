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
import { countries, judetByCountry } from '@/lib/constants';
import { showSuccess, showError } from '@/lib/toast';

// SEO metadata
export const metadata = {
  title: 'Profil Client | Curierul Perfect',
  description: 'Gestionează profilul tău de client. Actualizează datele personale, adresa și informațiile companiei pentru o experiență optimizată de transport.',
  keywords: 'profil client, date personale, actualizare profil, transport colete'
};

// Country-specific company tax information
const countryTaxInfo: Record<string, { 
  taxLabel: string; 
  taxPlaceholder: string; 
  regLabel: string; 
  regPlaceholder: string; 
}> = {
  RO: { taxLabel: 'CUI / CIF', taxPlaceholder: 'RO12345678', regLabel: 'Nr. înregistrare', regPlaceholder: 'J40/1234/2024' },
  GB: { taxLabel: 'VAT Number', taxPlaceholder: 'GB123456789', regLabel: 'Company Number', regPlaceholder: '12345678' },
  DE: { taxLabel: 'USt-IdNr.', taxPlaceholder: 'DE123456789', regLabel: 'Handelsregister', regPlaceholder: 'HRB 12345' },
  IT: { taxLabel: 'Partita IVA', taxPlaceholder: 'IT12345678901', regLabel: 'REA', regPlaceholder: 'MI-1234567' },
  ES: { taxLabel: 'NIF / CIF', taxPlaceholder: 'ESA12345678', regLabel: 'Registro Mercantil', regPlaceholder: 'Tomo 1234, Folio 56' },
  FR: { taxLabel: 'N° TVA', taxPlaceholder: 'FR12345678901', regLabel: 'SIRET', regPlaceholder: '123 456 789 00012' },
  AT: { taxLabel: 'UID-Nummer', taxPlaceholder: 'ATU12345678', regLabel: 'Firmenbuch', regPlaceholder: 'FN 123456a' },
  BE: { taxLabel: 'N° TVA / BTW', taxPlaceholder: 'BE0123456789', regLabel: 'Nr. întreprindere', regPlaceholder: '0123.456.789' },
  NL: { taxLabel: 'BTW-nummer', taxPlaceholder: 'NL123456789B01', regLabel: 'KVK-nummer', regPlaceholder: '12345678' },
  GR: { taxLabel: 'ΑΦΜ (AFM)', taxPlaceholder: 'EL123456789', regLabel: 'ΓΕΜΗ', regPlaceholder: '123456789000' },
  PT: { taxLabel: 'NIF', taxPlaceholder: 'PT123456789', regLabel: 'NIPC', regPlaceholder: '501234567' },
  IE: { taxLabel: 'VAT Number', taxPlaceholder: 'IE1234567T', regLabel: 'CRO Number', regPlaceholder: '123456' },
  DK: { taxLabel: 'CVR', taxPlaceholder: 'DK12345678', regLabel: 'Virksomhed', regPlaceholder: '12345678' },
  SE: { taxLabel: 'Org.nr', taxPlaceholder: 'SE123456789001', regLabel: 'F-skattsedel', regPlaceholder: '123456-7890' },
  NO: { taxLabel: 'Org.nr', taxPlaceholder: 'NO123456789MVA', regLabel: 'Foretaksregisteret', regPlaceholder: '123 456 789' },
  FI: { taxLabel: 'Y-tunnus', taxPlaceholder: 'FI12345678', regLabel: 'Kaupparekisteri', regPlaceholder: '1234567-8' },
};

interface ClientProfile {
  nume: string;
  prenume: string;
  telefon: string;
  email: string;
  tara: string;
  judet: string;
  oras: string;
  adresa: string;
  cod_postal: string;
  companie?: string;
  cui?: string;
}

export default function ProfilClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile>({
    nume: '',
    prenume: '',
    telefon: '',
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
  const [message, setMessage] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [judetDropdownOpen, setJudetDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [judetSearch, setJudetSearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const judetDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (judetDropdownRef.current && !judetDropdownRef.current.contains(event.target as Node)) {
        setJudetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'profil_client', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as ClientProfile;
        // Normalize country code to uppercase
        const normalizedData = {
          ...data,
          tara: data.tara?.toUpperCase() || 'RO',
        };
        setProfile({ ...profile, ...normalizedData, email: user.email || '' });
      } else {
        setProfile({ ...profile, email: user.email || '' });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage('');

    try {
      await setDoc(doc(db, 'profil_client', user.uid), {
        ...profile,
        updatedAt: serverTimestamp(),
      });
      
      setMessage('✅ Profil salvat cu succes!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('❌ Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

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
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={profile.telefon}
                  onChange={(e) => setProfile({ ...profile, telefon: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="+40 XXX XXX XXX"
                  required
                />
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
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-700/70 transition-colors flex items-center gap-3 cursor-pointer focus:outline-none"
                  >
                    <Image
                      src={countries.find(c => c.code === profile.tara)?.flag || '/img/flag/ro.svg'}
                      alt=""
                      width={24}
                      height={16}
                      className="rounded-sm shrink-0"
                    />
                    <span className="flex-1 text-left truncate">{countries.find(c => c.code === profile.tara)?.name || 'România'}</span>
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
                        {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setProfile({ ...profile, tara: c.code, judet: '' });
                              setCountryDropdownOpen(false);
                              setCountrySearch('');
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-700 transition-colors ${
                              profile.tara === c.code ? 'bg-slate-700/50' : ''
                            }`}
                          >
                            <Image
                              src={c.flag}
                              alt=""
                              width={24}
                              height={16}
                              className="rounded-sm shrink-0"
                            />
                            <span className="text-white text-sm">{c.name}</span>
                          </button>
                        ))}
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
                    onClick={() => setJudetDropdownOpen(!judetDropdownOpen)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-700/70 transition-colors flex items-center gap-3 cursor-pointer focus:outline-none"
                  >
                    <Image
                      src={countries.find(c => c.code === profile.tara)?.flag || '/img/flag/ro.svg'}
                      alt=""
                      width={20}
                      height={14}
                      className="rounded-sm shrink-0"
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
                        />
                      </div>
                      {/* Scrollable list */}
                      <div className="overflow-y-auto max-h-48 dropdown-scrollbar">
                        {(judetByCountry[profile.tara] || []).filter(j => j.toLowerCase().includes(judetSearch.toLowerCase())).map((judet) => (
                          <button
                            key={judet}
                            type="button"
                            onClick={() => {
                              setProfile({ ...profile, judet });
                              setJudetDropdownOpen(false);
                              setJudetSearch('');
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-700 transition-colors ${
                              profile.judet === judet ? 'bg-slate-700/50' : ''
                            }`}
                          >
                            <Image
                              src={countries.find(c => c.code === profile.tara)?.flag || '/img/flag/ro.svg'}
                              alt=""
                              width={20}
                              height={14}
                              className="rounded-sm shrink-0"
                            />
                            <span className="text-white text-sm">{judet}</span>
                          </button>
                        ))}
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
                  {countryTaxInfo[profile.tara]?.taxLabel || 'CUI/CIF'}
                </label>
                <input
                  type="text"
                  value={profile.cui}
                  onChange={(e) => setProfile({ ...profile, cui: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder={countryTaxInfo[profile.tara]?.taxPlaceholder || 'RO12345678'}
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

          {message && (
            <div className={`p-4 rounded-xl text-center font-medium ${
              message.includes('✅')
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>
    </div>
  );
}
