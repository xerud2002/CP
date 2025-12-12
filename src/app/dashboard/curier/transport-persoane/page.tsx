'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PersonRoute {
  id: string;
  taraOrigine: string;
  taraOrigineCod: string;
  taraDestinatie: string;
  taraDestinatieCod: string;
  pretPersoana: number;
  maxPersoane: number;
  incluzeBagaje: boolean;
  zileDisponibile: string[];
  orasPlecare?: string;
  orasDestinatie?: string;
}

const countries = [
  { name: 'România', code: 'ro' },
  { name: 'Anglia', code: 'gb' },
  { name: 'Germania', code: 'de' },
  { name: 'Franța', code: 'fr' },
  { name: 'Italia', code: 'it' },
  { name: 'Spania', code: 'es' },
  { name: 'Austria', code: 'at' },
  { name: 'Belgia', code: 'be' },
  { name: 'Olanda', code: 'nl' },
  { name: 'Elveția', code: 'ch' },
  { name: 'Portugalia', code: 'pt' },
  { name: 'Irlanda', code: 'ie' },
  { name: 'Danemarca', code: 'dk' },
  { name: 'Suedia', code: 'se' },
  { name: 'Norvegia', code: 'no' },
  { name: 'Grecia', code: 'gr' },
];

const zile = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

export default function TransportPersoanePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [routes, setRoutes] = useState<PersonRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [taraOrigine, setTaraOrigine] = useState('');
  const [taraDestinatie, setTaraDestinatie] = useState('');
  const [pretPersoana, setPretPersoana] = useState('');
  const [maxPersoane, setMaxPersoane] = useState('4');
  const [incluzeBagaje, setIncluzeBagaje] = useState(true);
  const [zileDisponibile, setZileDisponibile] = useState<string[]>([]);
  const [orasPlecare, setOrasPlecare] = useState('');
  const [orasDestinatie, setOrasDestinatie] = useState('');

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
          collection(db, 'transport_persoane'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const routesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PersonRoute[];
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

  const handleZileChange = (zi: string) => {
    setZileDisponibile(prev => 
      prev.includes(zi) 
        ? prev.filter(z => z !== zi)
        : [...prev, zi]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taraOrigine || !taraDestinatie || !pretPersoana || !user) return;

    if (taraOrigine === taraDestinatie) {
      alert('Țara de origine și destinație nu pot fi aceleași!');
      return;
    }

    // Check if route already exists
    if (routes.some(r => r.taraOrigineCod === taraOrigine && r.taraDestinatieCod === taraDestinatie)) {
      alert('Ai deja această rută!');
      return;
    }

    setSaving(true);
    try {
      const origineInfo = countries.find(c => c.code === taraOrigine);
      const destinatieInfo = countries.find(c => c.code === taraDestinatie);

      const docData = {
        uid: user.uid,
        taraOrigine: origineInfo?.name || taraOrigine,
        taraOrigineCod: taraOrigine,
        taraDestinatie: destinatieInfo?.name || taraDestinatie,
        taraDestinatieCod: taraDestinatie,
        pretPersoana: parseFloat(pretPersoana),
        maxPersoane: parseInt(maxPersoane),
        incluzeBagaje,
        zileDisponibile: zileDisponibile.length > 0 ? zileDisponibile : zile,
        orasPlecare: orasPlecare || undefined,
        orasDestinatie: orasDestinatie || undefined,
        addedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'transport_persoane'), docData);

      setRoutes([{
        id: docRef.id,
        ...docData,
      }, ...routes]);

      // Reset form
      setTaraOrigine('');
      setTaraDestinatie('');
      setPretPersoana('');
      setMaxPersoane('4');
      setIncluzeBagaje(true);
      setZileDisponibile([]);
      setOrasPlecare('');
      setOrasDestinatie('');
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
      await deleteDoc(doc(db, 'transport_persoane', routeId));
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
            <div className="p-2.5 bg-linear-to-br from-teal-500/20 to-cyan-500/20 rounded-xl border border-teal-500/20">
              <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">Transport Persoane</h1>
              <p className="text-xs sm:text-sm text-gray-400">Transport persoane în Europa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Add Route Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-sm">👥</span>
            Adaugă Rută Transport Persoane
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin Country */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Țara de plecare</label>
                <select
                  value={taraOrigine}
                  onChange={(e) => setTaraOrigine(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500/50"
                  required
                >
                  <option value="">Selectează țara</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Origin City */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Oraș plecare (opțional)</label>
                <input
                  type="text"
                  value={orasPlecare}
                  onChange={(e) => setOrasPlecare(e.target.value)}
                  placeholder="ex: București"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
                />
              </div>

              {/* Destination Country */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Țara destinație</label>
                <select
                  value={taraDestinatie}
                  onChange={(e) => setTaraDestinatie(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500/50"
                  required
                >
                  <option value="">Selectează țara</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Destination City */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Oraș destinație (opțional)</label>
                <input
                  type="text"
                  value={orasDestinatie}
                  onChange={(e) => setOrasDestinatie(e.target.value)}
                  placeholder="ex: Londra"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Price per person */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preț / persoană (€)</label>
                <input
                  type="number"
                  value={pretPersoana}
                  onChange={(e) => setPretPersoana(e.target.value)}
                  min="1"
                  step="1"
                  placeholder="ex: 80"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50"
                  required
                />
              </div>

              {/* Max persons */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nr. maxim persoane</label>
                <select
                  value={maxPersoane}
                  onChange={(e) => setMaxPersoane(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500/50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'persoană' : 'persoane'}</option>
                  ))}
                </select>
              </div>

              {/* Include baggage */}
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluzeBagaje}
                    onChange={(e) => setIncluzeBagaje(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-slate-800"
                  />
                  <span className="text-sm text-gray-300">Include bagaje (1 valiză/pers)</span>
                </label>
              </div>
            </div>

            {/* Available days */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Zile disponibile (lasă necompletat pentru toate zilele)</label>
              <div className="flex flex-wrap gap-2">
                {zile.map((zi) => (
                  <button
                    key={zi}
                    type="button"
                    onClick={() => handleZileChange(zi)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      zileDisponibile.includes(zi)
                        ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50'
                        : 'bg-slate-800/50 text-gray-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {zi}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !taraOrigine || !taraDestinatie || !pretPersoana}
                className="px-6 py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-gray-400 mb-2">Nu ai adăugat nicio rută încă</p>
              <p className="text-sm text-gray-500">Adaugă rutele pe care oferi transport de persoane</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-slate-800/50 rounded-xl border border-white/10 p-4 hover:border-teal-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Image
                          src={`/img/flag/${route.taraOrigineCod}.svg`}
                          alt={route.taraOrigine}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-gray-400">→</span>
                        <Image
                          src={`/img/flag/${route.taraDestinatieCod}.svg`}
                          alt={route.taraDestinatie}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
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

                  <div className="mb-3">
                    <p className="text-white font-medium">
                      {route.orasPlecare || route.taraOrigine} → {route.orasDestinatie || route.taraDestinatie}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Preț / persoană:</span>
                      <span className="text-teal-400 font-semibold">{route.pretPersoana}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max persoane:</span>
                      <span className="text-white">{route.maxPersoane}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/5">
                    {route.incluzeBagaje && (
                      <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                        🧳 Bagaje
                      </span>
                    )}
                    {route.zileDisponibile && route.zileDisponibile.length < 7 && (
                      <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs">
                        📅 {route.zileDisponibile.length} zile/săpt
                      </span>
                    )}
                    {route.zileDisponibile && route.zileDisponibile.length === 7 && (
                      <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs">
                        📅 Zilnic
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
