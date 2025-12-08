'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const tabs = [
  { id: 'profil', label: 'Profil' },
  { id: 'trimite', label: 'Trimite Colet' },
  { id: 'comenzi', label: 'Comenzile' },
  { id: 'servicii', label: 'Servicii' },
  { id: 'fidelitate', label: 'Fidelitate' },
  { id: 'facturi', label: 'Facturi' },
  { id: 'suport', label: 'Suport' },
];

const countries = [
  { code: 'RO', name: 'România' },
  { code: 'GB', name: 'Anglia' },
  { code: 'IT', name: 'Italia' },
  { code: 'ES', name: 'Spania' },
  { code: 'DE', name: 'Germania' },
  { code: 'FR', name: 'Franța' },
];

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profil');
  
  // Form states
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setNume(user.nume || '');
      setTelefon(user.telefon || '');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-xl">Se încarcă...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Tab Menu */}
        <div className="tab-menu mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'profil' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Profilul meu</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="form-label">Nume complet</label>
                  <input
                    type="text"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                    placeholder="Ion Popescu"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ion@email.com"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Telefon</label>
                  <input
                    type="text"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    placeholder="07xxxxxxxx"
                    className="form-input"
                  />
                </div>
                <button className="btn-secondary">Salvează</button>
              </div>
            </div>
          )}

          {activeTab === 'trimite' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Trimite un colet</h2>
              <form className="space-y-4 max-w-md">
                <div>
                  <label className="form-label">Locație colectare</label>
                  <select className="form-select">
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Locație livrare</label>
                  <select className="form-select">
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Greutate colet (kg)</label>
                  <input type="number" className="form-input" placeholder="ex: 5" />
                </div>
                <div>
                  <label className="form-label">Data ridicare</label>
                  <input type="date" className="form-input" />
                </div>
                <button type="submit" className="btn-primary">Trimite comanda</button>
              </form>
            </div>
          )}

          {activeTab === 'comenzi' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Comenzile mele</h2>
              <p className="text-gray-400">Nu ai nicio comandă încă.</p>
            </div>
          )}

          {activeTab === 'servicii' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Serviciile oferite</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-900/50 p-4 rounded-lg">
                  <h3 className="text-orange-500 font-semibold">🚚 Transport Colete</h3>
                  <p className="text-gray-400 text-sm">Livrare rapidă în toată Europa</p>
                </div>
                <div className="bg-blue-900/50 p-4 rounded-lg">
                  <h3 className="text-orange-500 font-semibold">📦 Door to Door</h3>
                  <p className="text-gray-400 text-sm">Ridicare și livrare la adresă</p>
                </div>
                <div className="bg-blue-900/50 p-4 rounded-lg">
                  <h3 className="text-orange-500 font-semibold">🐾 Transport Animale</h3>
                  <p className="text-gray-400 text-sm">Transport sigur pentru animalele de companie</p>
                </div>
                <div className="bg-blue-900/50 p-4 rounded-lg">
                  <h3 className="text-orange-500 font-semibold">❄️ Transport Frigo</h3>
                  <p className="text-gray-400 text-sm">Produse ce necesită temperatură controlată</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fidelitate' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Program Fidelitate</h2>
              <p className="text-gray-400">Programul de fidelitate va fi disponibil în curând!</p>
            </div>
          )}

          {activeTab === 'facturi' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Facturi & Plăți</h2>
              <p className="text-gray-400">Nu ai nicio factură încă.</p>
            </div>
          )}

          {activeTab === 'suport' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6">Suport</h2>
              <p className="text-gray-300 mb-4">Ai nevoie de ajutor? Contactează-ne:</p>
              <ul className="space-y-2 text-gray-400">
                <li>📧 Email: suport@curierulperfect.ro</li>
                <li>📞 Telefon: +40 XXX XXX XXX</li>
                <li>💬 Live Chat: Disponibil 24/7</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
