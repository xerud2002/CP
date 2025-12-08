'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { countriesSimple as countries } from '@/lib/constants';

const tabs = [
  { id: 'profil', label: 'Profil', icon: '👤' },
  { id: 'trimite', label: 'Trimite Colet', icon: '📦' },
  { id: 'comenzi', label: 'Comenzile', icon: '📋' },
  { id: 'servicii', label: 'Servicii', icon: '⚙️' },
  { id: 'fidelitate', label: 'Fidelitate', icon: '⭐' },
  { id: 'facturi', label: 'Facturi', icon: '🧾' },
  { id: 'suport', label: 'Suport', icon: '💬' },
];

const servicii = [
  { icon: '📦', title: 'Colete', desc: 'Transport colete de orice dimensiune' },
  { icon: '✉️', title: 'Plicuri', desc: 'Documente și corespondență' },
  { icon: '🚪', title: 'Door to Door', desc: 'Ridicare și livrare la adresă' },
  { icon: '🐾', title: 'Animale', desc: 'Transport animale de companie' },
  { icon: '❄️', title: 'Frigo', desc: 'Produse cu temperatură controlată' },
  { icon: '🚗', title: 'Mașini', desc: 'Transport auto pe platformă' },
  { icon: '🛋️', title: 'Mobilă', desc: 'Piese de mobilier' },
  { icon: '🔌', title: 'Electrocasnice', desc: 'Aparatură și electronice' },
];

export default function ClientDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profil');
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form states
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');

  // Comenzi mock data
  const comenzi = [
    { id: 'CP20251201', data: '01/12/2025', ruta: 'România → Germania', greutate: '5kg', status: 'Livrat', statusColor: 'bg-green-500' },
    { id: 'CP20251128', data: '28/11/2025', ruta: 'Italia → România', greutate: '3kg', status: 'În tranzit', statusColor: 'bg-yellow-500' },
    { id: 'CP20251120', data: '20/11/2025', ruta: 'România → Anglia', greutate: '8kg', status: 'Preluat', statusColor: 'bg-blue-500' },
  ];

  useEffect(() => {
    if (user) {
      setNume(user.nume || '');
      setEmail(user.email || '');
      setTelefon(user.telefon || '');
    }
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    // TODO: Save to Firebase
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/img/bird-icon.png"
                alt="Curierul Perfect"
                width={40}
                height={32}
                className="h-8 w-auto "
              />
              <span className="text-lg font-bold hidden sm:block">
                <span className="text-orange-500">CurierulPerfect</span>
                <span className="text-emerald-500">.ro</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-sm">👤</span>
                </div>
                <span className="text-sm">{user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Bine ai venit, <span className="text-gradient">{nume || 'Client'}</span>! 👋
          </h1>
          <p className="text-gray-400">Gestionează comenzile și profilul tău din dashboard.</p>
        </div>

        {/* Tab Menu - Scrollable on mobile */}
        <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sm:p-8">
          
          {/* PROFIL */}
          {activeTab === 'profil' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Profilul meu</h2>
                  <p className="text-gray-400 text-sm">Actualizează informațiile personale</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nume complet</label>
                  <input
                    type="text"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                    placeholder="Ion Popescu"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ion@email.com"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
                  <input
                    type="text"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    placeholder="07xxxxxxxx"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 transition-all disabled:opacity-50"
                  >
                    {saveLoading ? 'Se salvează...' : 'Salvează modificările'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TRIMITE COLET */}
          {activeTab === 'trimite' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Trimite un colet</h2>
                  <p className="text-gray-400 text-sm">Completează detaliile și găsește cel mai bun curier</p>
                </div>
              </div>
              
              <form className="grid md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Țară ridicare</label>
                  <select className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all">
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Țară livrare</label>
                  <select className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all">
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg)</label>
                  <input 
                    type="number" 
                    placeholder="ex: 5"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data ridicare</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descriere colet</label>
                  <textarea 
                    rows={3}
                    placeholder="Descriere opțională..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all"
                  >
                    🔍 Caută curieri disponibili
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* COMENZILE MELE */}
          {activeTab === 'comenzi' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Comenzile mele</h2>
                  <p className="text-gray-400 text-sm">Istoricul și statusul comenzilor tale</p>
                </div>
              </div>
              
              {comenzi.length > 0 ? (
                <div className="space-y-4">
                  {comenzi.map((comanda) => (
                    <div key={comanda.id} className="bg-slate-900/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                            📦
                          </div>
                          <div>
                            <div className="font-medium text-white">{comanda.ruta}</div>
                            <div className="text-sm text-gray-500">#{comanda.id} • {comanda.data} • {comanda.greutate}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${comanda.statusColor}`}>
                          {comanda.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-3xl">
                    📭
                  </div>
                  <p className="text-gray-400">Nu ai nicio comandă încă.</p>
                  <button 
                    onClick={() => setActiveTab('trimite')}
                    className="mt-4 text-orange-400 hover:text-orange-300 font-medium"
                  >
                    Trimite primul tău colet →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SERVICII */}
          {activeTab === 'servicii' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Servicii disponibile</h2>
                  <p className="text-gray-400 text-sm">Toate tipurile de transport pe care le oferim</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {servicii.map((serviciu, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-white/5 hover:border-green-500/30 hover:bg-slate-900/80 transition-all cursor-pointer group">
                    <div className="text-3xl mb-3">{serviciu.icon}</div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">{serviciu.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{serviciu.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIDELITATE */}
          {activeTab === 'fidelitate' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Program Fidelitate</h2>
                  <p className="text-gray-400 text-sm">Câștigă puncte și obține reduceri</p>
                </div>
              </div>
              
              <div className="max-w-md">
                <div className="bg-linear-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/20 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400 mb-2">125</div>
                    <div className="text-gray-400">Puncte acumulate</div>
                  </div>
                  <div className="mt-4 bg-slate-900/50 rounded-full h-3">
                    <div className="bg-yellow-500 h-full rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">Încă 375 puncte până la următorul nivel</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                    <span className="text-gray-300">🎁 Reducere 5%</span>
                    <span className="text-green-400 text-sm">Disponibil</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl opacity-50">
                    <span className="text-gray-300">🎁 Reducere 10%</span>
                    <span className="text-gray-500 text-sm">500 puncte</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl opacity-50">
                    <span className="text-gray-300">🎁 Transport gratuit</span>
                    <span className="text-gray-500 text-sm">1000 puncte</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FACTURI */}
          {activeTab === 'facturi' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-2xl">🧾</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Facturi & Plăți</h2>
                  <p className="text-gray-400 text-sm">Istoricul plăților și facturilor</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Factura #CP20250401</div>
                      <div className="text-sm text-gray-500">01/04/2025</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">25€</div>
                    <button className="text-sm text-orange-400 hover:text-orange-300">Descarcă PDF</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Factura #CP20250311</div>
                      <div className="text-sm text-gray-500">11/03/2025</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">18€</div>
                    <button className="text-sm text-orange-400 hover:text-orange-300">Descarcă PDF</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUPORT */}
          {activeTab === 'suport' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Contact & Suport</h2>
                  <p className="text-gray-400 text-sm">Suntem aici să te ajutăm</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
                <a href="mailto:suport@curierulperfect.ro" className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-green-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📧
                  </div>
                  <div>
                    <div className="font-medium text-white">Email</div>
                    <div className="text-sm text-gray-500">suport@curierulperfect.ro</div>
                  </div>
                </a>
                <a href="tel:+40312345678" className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-green-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📞
                  </div>
                  <div>
                    <div className="font-medium text-white">Telefon</div>
                    <div className="text-sm text-gray-500">0312 345 678</div>
                  </div>
                </a>
                <a href="https://wa.me/40712345678" target="_blank" className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-green-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <div>
                    <div className="font-medium text-white">WhatsApp</div>
                    <div className="text-sm text-gray-500">Chat live 24/7</div>
                  </div>
                </a>
              </div>
              
              <div className="mt-8 max-w-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Trimite-ne un mesaj</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subiect</label>
                    <input 
                      type="text"
                      placeholder="Cu ce te putem ajuta?"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mesaj</label>
                    <textarea 
                      rows={4}
                      placeholder="Descrie problema sau întrebarea ta..."
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="py-3 px-6 rounded-xl font-semibold text-white bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 transition-all"
                  >
                    Trimite mesajul
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




