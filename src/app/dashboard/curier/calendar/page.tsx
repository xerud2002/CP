'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CalendarEntry {
  id: string;
  tara: string;
  data: string;
  dataTimestamp: Date;
}

const countries = [
  'România', 'Anglia', 'Italia', 'Spania', 'Germania', 'Franța',
  'Austria', 'Belgia', 'Olanda', 'Grecia', 'Scoția', 'Portugalia',
  'Norvegia', 'Suedia', 'Danemarca', 'Finlanda', 'Irlanda'
];

export default function CalendarColectiiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

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
        snapshot.forEach((doc) => {
          loadedEntries.push({
            id: doc.id,
            tara: doc.data().tara,
            data: doc.data().data,
            dataTimestamp: doc.data().dataTimestamp?.toDate(),
          });
        });
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

      setSelectedCountry('');
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

  // Group entries by country
  const entriesByCountry = entries.reduce((acc, entry) => {
    if (!acc[entry.tara]) {
      acc[entry.tara] = [];
    }
    acc[entry.tara].push(entry);
    return acc;
  }, {} as Record<string, CalendarEntry[]>);

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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">📅 Calendar Colecții</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">📆</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Despre Calendar</h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Această secțiune te ajută să selectezi zilele în care poți efectua colecții de colete. 
              În funcție de țara și data selectată, platforma va ști când ești disponibil și îți va 
              trimite cereri relevante.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Poți adăuga una sau mai multe zile de colecție pentru fiecare țară, apoi le poți 
              modifica oricând din contul tău.
            </p>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
                <span>💡</span> Sfat
              </div>
              <p className="text-gray-400 text-sm">
                Adaugă cât mai multe date de colecție pentru a primi mai multe cereri de la clienți!
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Adaugă Dată Colecție</h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Țară Colecție</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="form-select"
                >
                  <option value="">Selectează o țară</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Data Colecție</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>

              <button
                onClick={handleAddEntry}
                disabled={!selectedCountry || !selectedDate || saving}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Se salvează...
                  </span>
                ) : (
                  'Adaugă data'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Entries */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-white mb-6">📋 Program Colecții Salvate</h2>
          
          {loadingEntries ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : Object.keys(entriesByCountry).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400">Nu ai nicio dată de colecție salvată.</p>
              <p className="text-gray-500 text-sm mt-2">Adaugă prima ta dată de colecție folosind formularul de mai sus.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(entriesByCountry).map(([country, countryEntries]) => (
                <div key={country} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🌍</span>
                    <h3 className="font-semibold text-green-400">{country}</h3>
                    <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {countryEntries.length} {countryEntries.length === 1 ? 'dată' : 'date'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {countryEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2"
                      >
                        <span className="text-white">{entry.data}</span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Șterge"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
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
