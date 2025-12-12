'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeftIcon, UserIcon, CheckIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';

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

const countries = [
  { code: 'RO', name: 'România', flag: '/img/flag/ro.svg' },
  { code: 'GB', name: 'Anglia', flag: '/img/flag/gb.svg' },
  { code: 'IT', name: 'Italia', flag: '/img/flag/it.svg' },
  { code: 'ES', name: 'Spania', flag: '/img/flag/es.svg' },
  { code: 'DE', name: 'Germania', flag: '/img/flag/de.svg' },
  { code: 'FR', name: 'Franța', flag: '/img/flag/fr.svg' },
  { code: 'AT', name: 'Austria', flag: '/img/flag/at.svg' },
  { code: 'BE', name: 'Belgia', flag: '/img/flag/be.svg' },
  { code: 'NL', name: 'Olanda', flag: '/img/flag/nl.svg' },
];

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

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

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
        setProfile({ ...profile, ...docSnap.data() as ClientProfile, email: user.email || '' });
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
                <select
                  value={profile.tara}
                  onChange={(e) => setProfile({ ...profile, tara: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Județ/Regiune *</label>
                <input
                  type="text"
                  value={profile.judet}
                  onChange={(e) => setProfile({ ...profile, judet: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
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
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CUI/CIF</label>
                <input
                  type="text"
                  value={profile.cui}
                  onChange={(e) => setProfile({ ...profile, cui: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
