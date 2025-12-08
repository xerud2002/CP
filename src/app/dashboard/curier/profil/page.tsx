'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CourierProfile {
  // Personal Info
  nume: string;
  telefon: string;
  telefonPrefix: string;
  // Company Info
  firma: string;
  sediu: string;
  taraSediu: string;
  nrInmatriculare: string;
  cui: string;
  iban: string;
  // Services
  services: string[];
  rutaRegulata: string;
}

const phonePrefixes = [
  { code: 'ro', name: 'RO +40', flag: '🇷🇴' },
  { code: 'gb', name: 'GB +44', flag: '🇬🇧' },
  { code: 'it', name: 'IT +39', flag: '🇮🇹' },
  { code: 'es', name: 'ES +34', flag: '🇪🇸' },
  { code: 'de', name: 'DE +49', flag: '🇩🇪' },
  { code: 'fr', name: 'FR +33', flag: '🇫🇷' },
  { code: 'at', name: 'AT +43', flag: '🇦🇹' },
  { code: 'be', name: 'BE +32', flag: '🇧🇪' },
  { code: 'nl', name: 'NL +31', flag: '🇳🇱' },
  { code: 'gr', name: 'GR +30', flag: '🇬🇷' },
  { code: 'pt', name: 'PT +351', flag: '🇵🇹' },
  { code: 'ie', name: 'IE +353', flag: '🇮🇪' },
];

const availableServices = [
  { id: 'colete', label: 'Colete', icon: '📦' },
  { id: 'plicuri', label: 'Plicuri', icon: '✉️' },
  { id: 'persoane', label: 'Persoane', icon: '👥' },
  { id: 'animale', label: 'Animale', icon: '🐕' },
  { id: 'masini', label: 'Mașini', icon: '🚗' },
  { id: 'aeroport', label: 'Aeroport', icon: '✈️' },
  { id: 'frigo', label: 'Frigo', icon: '❄️' },
  { id: 'door2door', label: 'Door2Door', icon: '🚪' },
  { id: 'mobila', label: 'Mobilă', icon: '🛋️' },
  { id: 'electrocasnice', label: 'Electrocasnice', icon: '📺' },
  { id: 'marfa', label: 'Marfă', icon: '📦' },
  { id: 'asigurare', label: 'Asigurare Transport', icon: '🛡️' },
];

const defaultProfile: CourierProfile = {
  nume: '',
  telefon: '',
  telefonPrefix: 'ro',
  firma: '',
  sediu: '',
  taraSediu: '',
  nrInmatriculare: '',
  cui: '',
  iban: '',
  services: [],
  rutaRegulata: '',
};

export default function ProfilCurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CourierProfile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingServices, setSavingServices] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Load profile from Firebase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, 'profil_curier', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({ ...defaultProfile, ...docSnap.data() } as CourierProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const showSavedMessage = (message: string) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSavePersonal = async () => {
    if (!user) return;
    
    setSavingPersonal(true);
    try {
      const docRef = doc(db, 'profil_curier', user.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      showSavedMessage('Informațiile personale au fost salvate!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveServices = async () => {
    if (!user) return;
    
    setSavingServices(true);
    try {
      const docRef = doc(db, 'profil_curier', user.uid);
      await setDoc(docRef, {
        services: profile.services,
        rutaRegulata: profile.rutaRegulata,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      showSavedMessage('Serviciile au fost salvate!');
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSavingServices(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 page-transition">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard/curier" className="text-gray-400 hover:text-white transition-colors mb-2 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">👤 Profilul Meu</h1>
          </div>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {savedMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Column 1 - Personal Info & Company */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info */}
            <div className="card">
              <h2 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <span>👤</span> Informații personale
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Nume complet</label>
                  <input
                    type="text"
                    value={profile.nume}
                    onChange={(e) => setProfile({ ...profile, nume: e.target.value })}
                    className="form-input"
                    placeholder="Ion Popescu"
                  />
                </div>

                <div>
                  <label className="form-label">Număr telefon</label>
                  <div className="flex gap-2">
                    <select
                      value={profile.telefonPrefix}
                      onChange={(e) => setProfile({ ...profile, telefonPrefix: e.target.value })}
                      className="form-select w-32"
                    >
                      {phonePrefixes.map((p) => (
                        <option key={p.code} value={p.code}>{p.flag} {p.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={profile.telefon}
                      onChange={(e) => setProfile({ ...profile, telefon: e.target.value })}
                      className="form-input flex-1"
                      placeholder="07xx xxx xxx"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="card">
              <h2 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <span>🏢</span> Date Companie
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Denumire firmă</label>
                  <input
                    type="text"
                    value={profile.firma}
                    onChange={(e) => setProfile({ ...profile, firma: e.target.value })}
                    className="form-input"
                    placeholder="SC Exemplu SRL"
                  />
                </div>

                <div>
                  <label className="form-label">Adresă sediu</label>
                  <input
                    type="text"
                    value={profile.sediu}
                    onChange={(e) => setProfile({ ...profile, sediu: e.target.value })}
                    className="form-input"
                    placeholder="Str. Exemplu, Nr. 1"
                  />
                </div>

                <div>
                  <label className="form-label">Țara sediu</label>
                  <input
                    type="text"
                    value={profile.taraSediu}
                    onChange={(e) => setProfile({ ...profile, taraSediu: e.target.value })}
                    className="form-input"
                    placeholder="România"
                  />
                </div>

                <div>
                  <label className="form-label">Nr. de înregistrare</label>
                  <input
                    type="text"
                    value={profile.nrInmatriculare}
                    onChange={(e) => setProfile({ ...profile, nrInmatriculare: e.target.value })}
                    className="form-input"
                    placeholder="J40/1234/2024"
                  />
                </div>

                <div>
                  <label className="form-label">CUI/CIF sau VAT</label>
                  <input
                    type="text"
                    value={profile.cui}
                    onChange={(e) => setProfile({ ...profile, cui: e.target.value })}
                    className="form-input"
                    placeholder="RO12345678"
                  />
                </div>

                <div>
                  <label className="form-label">IBAN</label>
                  <input
                    type="text"
                    value={profile.iban}
                    onChange={(e) => setProfile({ ...profile, iban: e.target.value })}
                    className="form-input"
                    placeholder="RO12XXXX..."
                  />
                </div>

                <button
                  onClick={handleSavePersonal}
                  disabled={savingPersonal}
                  className="btn-secondary w-full"
                >
                  {savingPersonal ? 'Se salvează...' : 'Salvează informațiile'}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <span>🚚</span> Servicii de Transport
              </h2>
              
              <div className="space-y-3">
                {availableServices.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      profile.services.includes(service.id)
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={profile.services.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="w-4 h-4 rounded border-gray-500 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-lg">{service.icon}</span>
                    <span className="text-white">{service.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="form-label">Rută regulată</label>
                <input
                  type="text"
                  value={profile.rutaRegulata}
                  onChange={(e) => setProfile({ ...profile, rutaRegulata: e.target.value })}
                  className="form-input"
                  placeholder="ex: România – Germania săptămânal"
                />
              </div>

              <button
                onClick={handleSaveServices}
                disabled={savingServices}
                className="btn-primary w-full mt-4"
              >
                {savingServices ? 'Se salvează...' : 'Salvează serviciile'}
              </button>
            </div>
          </div>

          {/* Column 3 - Calendar Preview */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                <span>📅</span> Calendar personalizat
              </h2>
              
              <div className="space-y-3">
                <Link
                  href="/dashboard/curier/calendar"
                  className="block w-full p-3 bg-slate-800/50 border border-yellow-500/30 rounded-lg text-white hover:bg-slate-700/50 transition-colors text-center"
                >
                  Vizualizează calendar complet
                </Link>
                
                <button className="w-full p-3 bg-slate-800/50 border border-green-500/30 rounded-lg text-white hover:bg-slate-700/50 transition-colors">
                  Adaugă zile indisponibile
                </button>
                
                <button className="w-full p-3 bg-slate-800/50 border border-red-500/30 rounded-lg text-white hover:bg-slate-700/50 transition-colors">
                  Setează vacanță / pauză
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                Gestionează cu ușurință disponibilitatea ta! Poți marca zile când nu preiei curse 
                sau perioade mai lungi pentru vacanță.
              </p>
            </div>
          </div>

          {/* Column 4 - Quick Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-4">
              <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <span>🌍</span> Zonă de acoperire
              </h3>
              <p className="text-gray-400 text-sm mb-3">Configurează țările și județele acoperite</p>
              <Link href="/dashboard/curier/zona-acoperire" className="btn-outline-green text-sm w-full text-center">
                Editează zona acoperită
              </Link>
            </div>

            <div className="card p-4">
              <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <span>📆</span> Zile de colectare
              </h3>
              <p className="text-gray-400 text-sm mb-3">Vezi și modifică datele de colectare</p>
              <Link href="/dashboard/curier/calendar" className="btn-outline-green text-sm w-full text-center">
                Vezi calendarul
              </Link>
            </div>

            <div className="card p-4">
              <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <span>💰</span> Tarife
              </h3>
              <p className="text-gray-400 text-sm mb-3">Gestionează prețurile pe țară</p>
              <Link href="/dashboard/curier/tarife" className="btn-outline-green text-sm w-full text-center">
                Gestionează tarife
              </Link>
            </div>

            <div className="card p-4">
              <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <span>⭐</span> Recenzii
              </h3>
              <p className="text-gray-400 text-sm mb-3">0 recenzii</p>
              <div className="flex items-center gap-1 text-yellow-400 mb-3">
                <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                <span className="text-gray-500 text-sm ml-2">(0.0)</span>
              </div>
              <button className="btn-outline-orange text-sm w-full">
                Vezi recenziile
              </button>
            </div>

            <div className="card p-4">
              <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <span>📷</span> Imagine de profil
              </h3>
              <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👤</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-slate-700 file:text-white hover:file:bg-slate-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
