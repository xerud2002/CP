'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, TrashIcon } from '@/components/icons/DashboardIcons';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Tarif {
  id: string;
  tara: string;
  tipServiciu: string;
  pretKg: number;
  minKg: number;
}

// Countries sorted alphabetically
const countries = [
  'Anglia', 'Austria', 'Belgia', 'Danemarca', 'Finlanda', 'Franța',
  'Germania', 'Grecia', 'Irlanda', 'Italia', 'Norvegia', 'Olanda',
  'Portugalia', 'România', 'Scoția', 'Spania', 'Suedia'
];

const serviceTypes = [
  { value: 'Standard', label: 'Standard', description: 'Transport standard de colete' },
  { value: 'Door2Door', label: 'Door2Door', description: 'Ridicare și livrare la adresă' },
  { value: 'Frigo', label: 'Frigo', description: 'Transport frigorific' },
  { value: 'Express', label: 'Express', description: 'Livrare urgentă' },
];

export default function TarifePracticatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tarife, setTarife] = useState<Tarif[]>([]);
  const [loadingTarife, setLoadingTarife] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [tara, setTara] = useState('');
  const [tipServiciu, setTipServiciu] = useState('');
  const [pretKg, setPretKg] = useState('');
  const [minKg, setMinKg] = useState('');

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
        snapshot.forEach((doc) => {
          loadedTarife.push({
            id: doc.id,
            tara: doc.data().tara,
            tipServiciu: doc.data().tipServiciu,
            pretKg: doc.data().pretKg,
            minKg: doc.data().minKg,
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
    if (!tara || !tipServiciu || !pretKg || !minKg || !user) return;

    // Check if combination exists
    const exists = tarife.some(t => t.tara === tara && t.tipServiciu === tipServiciu);
    if (exists) {
      alert('Ai deja un tarif pentru această combinație țară-serviciu!');
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'tarife_curier'), {
        uid: user.uid,
        tara,
        tipServiciu,
        pretKg: parseFloat(pretKg),
        minKg: parseInt(minKg),
        addedAt: serverTimestamp(),
      });

      setTarife([{
        id: docRef.id,
        tara,
        tipServiciu,
        pretKg: parseFloat(pretKg),
        minKg: parseInt(minKg),
      }, ...tarife]);

      // Reset form
      setTara('');
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

  // Group tarife by country
  const tarifeByCountry = tarife.reduce((acc, t) => {
    if (!acc[t.tara]) {
      acc[t.tara] = [];
    }
    acc[t.tara].push(t);
    return acc;
  }, {} as Record<string, Tarif[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 page-transition">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard/curier" className="text-gray-400 hover:text-white transition-colors mb-2 inline-flex items-center gap-2">
              <ArrowLeftIcon className="w-5 h-5" />
              Înapoi la Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">💰 Tarife Practicate</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">💶</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Despre Tarife</h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Aici poți seta prețurile pe care le practici pentru livrări în funcție de țară, 
              greutate și tipul de serviciu oferit.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Poți activa sau dezactiva servicii, precum și adăuga tarife speciale. 
              Acestea vor fi afișate clienților în pagina de căutare.
            </p>

            {/* Service Types Info */}
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-white">Tipuri de servicii disponibile:</h3>
              {serviceTypes.map((service) => (
                <div key={service.value} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-orange-400 mt-0.5">•</span>
                  <div>
                    <span className="font-medium text-white">{service.label}</span>
                    <p className="text-gray-500 text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Adaugă Tarif Nou</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Țară Livrare</label>
                <select
                  value={tara}
                  onChange={(e) => setTara(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Selectează țara</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Tip Serviciu</label>
                <select
                  value={tipServiciu}
                  onChange={(e) => setTipServiciu(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Selectează tipul serviciului</option>
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>{service.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Preț per kg (€)</label>
                  <input
                    type="number"
                    value={pretKg}
                    onChange={(e) => setPretKg(e.target.value)}
                    step="0.1"
                    min="0"
                    placeholder="ex: 2.5"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Greutate minimă (kg)</label>
                  <input
                    type="number"
                    value={minKg}
                    onChange={(e) => setMinKg(e.target.value)}
                    step="1"
                    min="0"
                    placeholder="ex: 1"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Se salvează...
                  </span>
                ) : (
                  'Adaugă tarif'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Saved Tarife */}
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">📋 Tarife Active</h2>
            <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              {tarife.length} {tarife.length === 1 ? 'tarif' : 'tarife'}
            </span>
          </div>
          
          {loadingTarife ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : Object.keys(tarifeByCountry).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💸</div>
              <p className="text-gray-400">Nu ai niciun tarif salvat.</p>
              <p className="text-gray-500 text-sm mt-2">Adaugă primul tău tarif folosind formularul de mai sus.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(tarifeByCountry).map(([country, countryTarife]) => (
                <div key={country} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🌍</span>
                    <h3 className="font-semibold text-green-400 text-lg">{country}</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-2 px-3 text-gray-400 font-medium text-sm">Serviciu</th>
                          <th className="text-left py-2 px-3 text-gray-400 font-medium text-sm">Preț/kg</th>
                          <th className="text-left py-2 px-3 text-gray-400 font-medium text-sm">Min. kg</th>
                          <th className="text-right py-2 px-3 text-gray-400 font-medium text-sm">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryTarife.map((t) => (
                          <tr key={t.id} className="border-b border-slate-700/50 last:border-0">
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                <span className="text-white">{t.tipServiciu}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-orange-400 font-medium">{t.pretKg} €</span>
                            </td>
                            <td className="py-3 px-3 text-gray-400">{t.minKg} kg</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleDelete(t.id)}
                                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                title="Șterge tarif"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
