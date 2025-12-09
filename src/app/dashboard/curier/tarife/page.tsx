'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, TrashIcon, BoxIcon } from '@/components/icons/DashboardIcons';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Tarif {
  id: string;
  tara: string;
  taraCode: string;
  tipServiciu: string;
  pretKg: number;
  minKg: number;
}

// Euro icon component
const EuroIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h12" />
    <path d="M4 14h9" />
    <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
  </svg>
);

// Countries with codes - sorted alphabetically (16 main European countries)
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

const serviceTypes = [
  { value: 'Standard', label: 'Standard', description: 'Transport standard de colete', icon: '📦' },
  { value: 'Door2Door', label: 'Door2Door', description: 'Ridicare și livrare la adresă', icon: '🚪' },
  { value: 'Frigo', label: 'Frigo', description: 'Transport frigorific', icon: '❄️' },
  { value: 'Express', label: 'Express', description: 'Livrare urgentă', icon: '⚡' },
];

export default function TarifePracticatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tarife, setTarife] = useState<Tarif[]>([]);
  const [loadingTarife, setLoadingTarife] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null);
  const [tipServiciu, setTipServiciu] = useState('');
  const [pretKg, setPretKg] = useState('');
  const [minKg, setMinKg] = useState('');

  // Custom dropdowns state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = countriesWithCodes.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Load tarife from Firebase
  useEffect(() => {
    const loadTarife = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'tarife_curier'),
          where('uid', '==', user.uid),
          orderBy('addedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const loadedTarife: Tarif[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedTarife.push({
            id: docSnap.id,
            tara: data.tara,
            taraCode: data.taraCode || countriesWithCodes.find(c => c.name === data.tara)?.code || 'eu',
            tipServiciu: data.tipServiciu,
            pretKg: data.pretKg,
            minKg: data.minKg,
          });
        });
        setTarife(loadedTarife);
      } catch (error) {
        console.error('Error loading tarife:', error);
      } finally {
        setLoadingTarife(false);
      }
    };

    if (user) {
      loadTarife();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !tipServiciu || !pretKg || !minKg || !user) return;

    // Check if combination exists
    const exists = tarife.some(t => t.tara === selectedCountry.name && t.tipServiciu === tipServiciu);
    if (exists) {
      alert('Ai deja un tarif pentru această combinație țară-serviciu!');
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'tarife_curier'), {
        uid: user.uid,
        tara: selectedCountry.name,
        taraCode: selectedCountry.code,
        tipServiciu,
        pretKg: parseFloat(pretKg),
        minKg: parseInt(minKg),
        addedAt: serverTimestamp(),
      });

      setTarife([{
        id: docRef.id,
        tara: selectedCountry.name,
        taraCode: selectedCountry.code,
        tipServiciu,
        pretKg: parseFloat(pretKg),
        minKg: parseInt(minKg),
      }, ...tarife]);

      // Reset form
      setSelectedCountry(null);
      setTipServiciu('');
      setPretKg('');
      setMinKg('');
    } catch (error) {
      console.error('Error adding tarif:', error);
      alert('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tarifId: string) => {
    if (!confirm('Sigur vrei să ștergi acest tarif?')) return;

    try {
      await deleteDoc(doc(db, 'tarife_curier', tarifId));
      setTarife(tarife.filter(t => t.id !== tarifId));
    } catch (error) {
      console.error('Error deleting tarif:', error);
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  const handleDeleteAllForCountry = async (country: string) => {
    if (!confirm(`Sigur vrei să ștergi toate tarifele pentru ${country}?`)) return;

    try {
      const tarifeToDelete = tarife.filter(t => t.tara === country);
      const batch = writeBatch(db);
      tarifeToDelete.forEach(t => {
        batch.delete(doc(db, 'tarife_curier', t.id));
      });
      await batch.commit();
      setTarife(tarife.filter(t => t.tara !== country));
    } catch (error) {
      console.error('Error deleting tarife:', error);
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  // Group tarife by country
  const tarifeByCountry = tarife.reduce((acc, t) => {
    if (!acc[t.tara]) {
      acc[t.tara] = [];
    }
    acc[t.tara].push(t);
    return acc;
  }, {} as Record<string, Tarif[]>);

  // Stats
  const totalTarife = tarife.length;
  const totalCountries = Object.keys(tarifeByCountry).length;
  const avgPrice = tarife.length > 0 
    ? (tarife.reduce((sum, t) => sum + t.pretKg, 0) / tarife.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/20">
                <EuroIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Tarife Practicate</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Setează prețurile pentru fiecare țară și serviciu</p>
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
                <BoxIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{totalTarife}</p>
                <p className="text-xs text-gray-400">Total tarife</p>
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
              <div className="p-2 sm:p-2.5 bg-orange-500/20 rounded-lg sm:rounded-xl">
                <span className="text-sm sm:text-lg">💶</span>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{avgPrice}€</p>
                <p className="text-xs text-gray-400">Preț mediu/kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form Section */}
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">➕</span>
            <h2 className="text-lg font-semibold text-white">Adaugă tarif nou</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Country Dropdown */}
              <div className="lg:col-span-1" ref={countryDropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Țară</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left"
                  >
                    {selectedCountry ? (
                      <>
                        <Image
                          src={`/img/flag/${selectedCountry.code}.svg`}
                          alt={selectedCountry.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="flex-1 truncate">{selectedCountry.name}</span>
                      </>
                    ) : (
                      <span className="flex-1 text-gray-500">Selectează țara</span>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          placeholder="Caută țara..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryDropdownOpen(false);
                              setCountrySearch('');
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors ${
                              selectedCountry?.code === country.code ? 'bg-emerald-500/20' : ''
                            }`}
                          >
                            <Image
                              src={`/img/flag/${country.code}.svg`}
                              alt={country.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-white">{country.name}</span>
                            {selectedCountry?.code === country.code && (
                              <svg className="w-5 h-5 text-emerald-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Type Dropdown */}
              <div className="lg:col-span-1" ref={serviceDropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tip Serviciu</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left"
                  >
                    {tipServiciu ? (
                      <>
                        <span className="text-lg">{serviceTypes.find(s => s.value === tipServiciu)?.icon}</span>
                        <span className="flex-1">{tipServiciu}</span>
                      </>
                    ) : (
                      <span className="flex-1 text-gray-500">Selectează serviciul</span>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isServiceDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => {
                            setTipServiciu(service.value);
                            setIsServiceDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors ${
                            tipServiciu === service.value ? 'bg-emerald-500/20' : ''
                          }`}
                        >
                          <span className="text-lg">{service.icon}</span>
                          <div className="flex-1 text-left">
                            <span className="text-white block">{service.label}</span>
                            <span className="text-xs text-gray-500">{service.description}</span>
                          </div>
                          {tipServiciu === service.value && (
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price per kg */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preț/kg (€)</label>
                <input
                  type="number"
                  value={pretKg}
                  onChange={(e) => setPretKg(e.target.value)}
                  step="0.1"
                  min="0"
                  placeholder="ex: 2.5"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  required
                />
              </div>

              {/* Min kg */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Min. kg</label>
                <input
                  type="number"
                  value={minKg}
                  onChange={(e) => setMinKg(e.target.value)}
                  step="1"
                  min="0"
                  placeholder="ex: 1"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving || !selectedCountry || !tipServiciu || !pretKg || !minKg}
                  className="w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Se salvează...</span>
                    </>
                  ) : (
                    <>
                      <EuroIcon className="w-5 h-5" />
                      <span>Adaugă tarif</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Service Types Legend */}
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">📋</span>
            <h2 className="text-lg font-semibold text-white">Tipuri de servicii</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {serviceTypes.map((service) => (
              <div key={service.value} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-white/5">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <p className="font-medium text-white text-sm">{service.label}</p>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Tarife */}
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <h2 className="text-lg font-semibold text-white">Tarife Active</h2>
            </div>
            <span className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
              {tarife.length} {tarife.length === 1 ? 'tarif' : 'tarife'}
            </span>
          </div>
          
          {loadingTarife ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : Object.keys(tarifeByCountry).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <span className="text-4xl">💸</span>
              </div>
              <p className="text-gray-400 text-lg mb-2">Nu ai niciun tarif salvat</p>
              <p className="text-gray-500 text-sm">Adaugă primul tău tarif folosind formularul de mai sus</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(tarifeByCountry)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([country, countryTarife]) => {
                  const countryCode = countryTarife[0]?.taraCode || countriesWithCodes.find(c => c.name === country)?.code || 'eu';
                  return (
                    <div key={country} className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
                      {/* Country Header */}
                      <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={`/img/flag/${countryCode}.svg`}
                            alt={country}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover shadow-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-white">{country}</h3>
                            <p className="text-xs text-gray-500">{countryTarife.length} {countryTarife.length === 1 ? 'tarif' : 'tarife'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAllForCountry(country)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Șterge toate tarifele pentru această țară"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Tarife List */}
                      <div className="divide-y divide-white/5">
                        {countryTarife.map((t) => {
                          const serviceInfo = serviceTypes.find(s => s.value === t.tipServiciu);
                          return (
                            <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-700/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{serviceInfo?.icon || '📦'}</span>
                                <div>
                                  <p className="text-white text-sm font-medium">{t.tipServiciu}</p>
                                  <p className="text-xs text-gray-500">min. {t.minKg} kg</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-orange-400 font-bold">{t.pretKg}€/kg</span>
                                <button
                                  onClick={() => handleDelete(t.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Șterge tarif"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
