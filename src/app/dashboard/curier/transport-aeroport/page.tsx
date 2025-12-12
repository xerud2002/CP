'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AeroportRoute {
  id: string;
  aeroport: string;
  aeroportCode: string;
  pretPersoana: number;
  maxPersoane: number;
  incluzeBagaje: boolean;
  disponibil24h: boolean;
  timpAsteptareGratuit: number; // minute
}

const aeroporturi = [
  { name: 'București Otopeni (OTP)', code: 'OTP', city: 'București' },
  { name: 'Cluj-Napoca (CLJ)', code: 'CLJ', city: 'Cluj-Napoca' },
  { name: 'Timișoara (TSR)', code: 'TSR', city: 'Timișoara' },
  { name: 'Iași (IAS)', code: 'IAS', city: 'Iași' },
  { name: 'Sibiu (SBZ)', code: 'SBZ', city: 'Sibiu' },
  { name: 'Craiova (CRA)', code: 'CRA', city: 'Craiova' },
  { name: 'Bacău (BCM)', code: 'BCM', city: 'Bacău' },
  { name: 'Oradea (OMR)', code: 'OMR', city: 'Oradea' },
  { name: 'London Heathrow (LHR)', code: 'LHR', city: 'Londra' },
  { name: 'London Luton (LTN)', code: 'LTN', city: 'Londra' },
  { name: 'London Stansted (STN)', code: 'STN', city: 'Londra' },
  { name: 'Frankfurt (FRA)', code: 'FRA', city: 'Frankfurt' },
  { name: 'München (MUC)', code: 'MUC', city: 'München' },
  { name: 'Paris CDG (CDG)', code: 'CDG', city: 'Paris' },
  { name: 'Milano Malpensa (MXP)', code: 'MXP', city: 'Milano' },
  { name: 'Roma Fiumicino (FCO)', code: 'FCO', city: 'Roma' },
  { name: 'Madrid Barajas (MAD)', code: 'MAD', city: 'Madrid' },
  { name: 'Barcelona El Prat (BCN)', code: 'BCN', city: 'Barcelona' },
  { name: 'Vienna (VIE)', code: 'VIE', city: 'Viena' },
  { name: 'Brussels (BRU)', code: 'BRU', city: 'Bruxelles' },
];

export default function TransportAeroportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [routes, setRoutes] = useState<AeroportRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedAeroport, setSelectedAeroport] = useState('');
  const [pretPersoana, setPretPersoana] = useState('');
  const [maxPersoane, setMaxPersoane] = useState('4');
  const [incluzeBagaje, setIncluzeBagaje] = useState(true);
  const [disponibil24h, setDisponibil24h] = useState(false);
  const [timpAsteptare, setTimpAsteptare] = useState('30');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'transport_aeroport'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const routesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AeroportRoute[];
        setRoutes(routesData);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoadingRoutes(false);
      }
    };

    if (user) {
      fetchRoutes();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAeroport || !pretPersoana || !user) return;

    // Check if route already exists
    if (routes.some(r => r.aeroportCode === selectedAeroport)) {
      alert('Ai deja o rută pentru acest aeroport!');
      return;
    }

    setSaving(true);
    try {
      const aeroportInfo = aeroporturi.find(a => a.code === selectedAeroport);
      const docData = {
        uid: user.uid,
        aeroport: aeroportInfo?.name || selectedAeroport,
        aeroportCode: selectedAeroport,
        pretPersoana: parseFloat(pretPersoana),
        maxPersoane: parseInt(maxPersoane),
        incluzeBagaje,
        disponibil24h,
        timpAsteptareGratuit: parseInt(timpAsteptare),
        addedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'transport_aeroport'), docData);

      setRoutes([{
        id: docRef.id,
        ...docData,
      }, ...routes]);

      // Reset form
      setSelectedAeroport('');
      setPretPersoana('');
      setMaxPersoane('4');
      setIncluzeBagaje(true);
      setDisponibil24h(false);
      setTimpAsteptare('30');
    } catch (error) {
      console.error('Error adding route:', error);
      alert('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (routeId: string) => {
    if (!confirm('Sigur vrei să ștergi această rută?')) return;

    try {
      await deleteDoc(doc(db, 'transport_aeroport', routeId));
      setRoutes(routes.filter(r => r.id !== routeId));
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  if (loading || loadingRoutes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/curier" className="p-2 hover:bg-slate-800/80 rounded-xl transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="p-2.5 bg-linear-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/20">
              <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">Transport Aeroport</h1>
              <p className="text-xs sm:text-sm text-gray-400">Transfer persoane la/de la aeroporturi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Add Route Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm">✈️</span>
            Adaugă Rută Aeroport
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Airport Select */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Aeroport</label>
              <select
                value={selectedAeroport}
                onChange={(e) => setSelectedAeroport(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                required
              >
                <option value="">Selectează aeroportul</option>
                <optgroup label="România">
                  {aeroporturi.filter(a => ['OTP', 'CLJ', 'TSR', 'IAS', 'SBZ', 'CRA', 'BCM', 'OMR'].includes(a.code)).map(a => (
                    <option key={a.code} value={a.code}>{a.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Europa">
                  {aeroporturi.filter(a => !['OTP', 'CLJ', 'TSR', 'IAS', 'SBZ', 'CRA', 'BCM', 'OMR'].includes(a.code)).map(a => (
                    <option key={a.code} value={a.code}>{a.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Price per person */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Preț / persoană (€)</label>
              <input
                type="number"
                value={pretPersoana}
                onChange={(e) => setPretPersoana(e.target.value)}
                min="1"
                step="1"
                placeholder="ex: 25"
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                required
              />
            </div>

            {/* Max persons */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nr. maxim persoane</label>
              <select
                value={maxPersoane}
                onChange={(e) => setMaxPersoane(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'persoană' : 'persoane'}</option>
                ))}
              </select>
            </div>

            {/* Waiting time */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Timp așteptare gratuit</label>
              <select
                value={timpAsteptare}
                onChange={(e) => setTimpAsteptare(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              >
                <option value="15">15 minute</option>
                <option value="30">30 minute</option>
                <option value="45">45 minute</option>
                <option value="60">60 minute</option>
              </select>
            </div>

            {/* Options */}
            <div className="sm:col-span-2 lg:col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incluzeBagaje}
                  onChange={(e) => setIncluzeBagaje(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-violet-500 focus:ring-violet-500 bg-slate-800"
                />
                <span className="text-sm text-gray-300">Include bagaje</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disponibil24h}
                  onChange={(e) => setDisponibil24h(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-violet-500 focus:ring-violet-500 bg-slate-800"
                />
                <span className="text-sm text-gray-300">Disponibil 24/7</span>
              </label>

              <button
                type="submit"
                disabled={saving || !selectedAeroport || !pretPersoana}
                className="ml-auto px-6 py-3 bg-linear-to-r from-violet-500 to-purple-500 text-white font-medium rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Se salvează...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span>Adaugă rută</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Routes List */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Rutele tale ({routes.length})</h2>

          {routes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-2">Nu ai adăugat nicio rută încă</p>
              <p className="text-sm text-gray-500">Adaugă aeroporturile de la care oferi transfer</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-slate-800/50 rounded-xl border border-white/10 p-4 hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg">
                        ✈️
                      </div>
                      <div>
                        <p className="font-medium text-white">{route.aeroport}</p>
                        <p className="text-xs text-gray-500">{route.aeroportCode}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Preț / persoană:</span>
                      <span className="text-violet-400 font-semibold">{route.pretPersoana}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max persoane:</span>
                      <span className="text-white">{route.maxPersoane}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Așteptare gratuită:</span>
                      <span className="text-white">{route.timpAsteptareGratuit} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                    {route.incluzeBagaje && (
                      <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                        🧳 Bagaje incluse
                      </span>
                    )}
                    {route.disponibil24h && (
                      <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs">
                        🕐 24/7
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </div>
    </div>
  );
}
