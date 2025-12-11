'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { countriesSimple as countries } from '@/lib/constants';
import {
  UserIcon,
  BoxIcon,
  CreditCardIcon,
  ChatIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  BellIcon,
  ArrowRightIcon,
} from '@/components/icons/DashboardIcons';

// ============================================
// TYPES & INTERFACES
// ============================================
interface DashboardCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: string;
  bgColor: string;
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  color: string;
}

// ============================================
// CONFIGURATION DATA
// ============================================
const dashboardCards: DashboardCard[] = [
  {
    id: 'trimite',
    icon: BoxIcon,
    title: 'Trimite Colet',
    description: 'Găsește curieri pentru transport',
    gradient: 'from-orange-500/10 to-amber-500/10',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    badge: 'Popular',
    badgeColor: 'bg-orange-500',
  },
  {
    id: 'comenzi',
    icon: PackageIcon,
    title: 'Comenzile mele',
    description: 'Urmărește statusul coletelor',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'profil',
    icon: UserIcon,
    title: 'Profilul meu',
    description: 'Actualizează datele personale',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'facturi',
    icon: CreditCardIcon,
    title: 'Facturi & Plăți',
    description: 'Istoricul tranzacțiilor',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    id: 'fidelitate',
    icon: CheckCircleIcon,
    title: 'Program Fidelitate',
    description: 'Puncte și recompense',
    gradient: 'from-yellow-500/10 to-orange-500/10',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    badge: '125 pts',
    badgeColor: 'bg-yellow-500',
  },
  {
    id: 'suport',
    icon: ChatIcon,
    title: 'Suport',
    description: 'Contactează-ne oricând',
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
  },
];

const statsData: StatItem[] = [
  { icon: PackageIcon, label: 'Colete trimise', value: '12', trend: '+2 luna aceasta', trendUp: true, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { icon: TruckIcon, label: 'În tranzit', value: '2', trend: 'Active', trendUp: true, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { icon: CheckCircleIcon, label: 'Livrate', value: '10', trend: '100% succes', trendUp: true, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { icon: CreditCardIcon, label: 'Economisit', value: '45€', trend: 'vs prețuri standard', trendUp: true, color: 'text-green-400', bgColor: 'bg-green-500/20' },
];

// Helper function for greeting based on time of day
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bună dimineața';
  if (hour < 18) return 'Bună ziua';
  return 'Bună seara';
}

const recentActivities: ActivityItem[] = [
  { type: 'delivery', message: 'Colet #CP1234 a fost livrat cu succes', time: 'Acum 2 ore', color: 'bg-emerald-500' },
  { type: 'transit', message: 'Colet #CP1235 a ajuns în Germania', time: 'Acum 5 ore', color: 'bg-blue-500' },
  { type: 'pickup', message: 'Colet #CP1235 ridicat de curier', time: 'Ieri', color: 'bg-orange-500' },
  { type: 'payment', message: 'Plată de 25€ confirmată', time: 'Ieri', color: 'bg-green-500' },
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

// ============================================
// COMPONENTS
// ============================================
const StatCard = ({ stat }: { stat: StatItem }) => {
  const IconComponent = stat.icon;
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${stat.color}`} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs">
        {stat.trendUp ? (
          <span className="text-emerald-400">↑ {stat.trend}</span>
        ) : (
          <span className="text-red-400">↓ {stat.trend}</span>
        )}
      </div>
    </div>
  );
};

const DashboardCardComponent = ({ card, onClick, isActive }: { card: DashboardCard; onClick: () => void; isActive: boolean }) => {
  const IconComponent = card.icon;
  return (
    <button
      onClick={onClick}
      className={`relative group bg-linear-to-br ${card.gradient} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 text-left w-full ${
        isActive 
          ? 'border-orange-500/50 ring-2 ring-orange-500/20' 
          : 'border-white/5 hover:border-white/20 hover:scale-[1.02]'
      }`}
    >
      {card.badge && (
        <span className={`absolute top-4 right-4 px-2 py-0.5 ${card.badgeColor} text-white text-xs font-medium rounded-full`}>
          {card.badge}
        </span>
      )}
      <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
      <p className="text-sm text-gray-400">{card.description}</p>
      <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-white transition-colors">
        <span>Deschide</span>
        <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

const ActivityItemComponent = ({ activity }: { activity: ActivityItem }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
    <div className={`w-2 h-2 rounded-full ${activity.color}`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white truncate">{activity.message}</p>
      <p className="text-xs text-gray-500">{activity.time}</p>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function ClientDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  
  // Form states
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');

  // Comenzi - loaded from Firestore
  const [comenzi] = useState<{id: string; data: string; ruta: string; greutate: string; status: string; statusColor: string}[]>([]);

  // Initialize form when user data is available (only once)
  if (user && !formInitialized) {
    setNume(user.nume || '');
    setEmail(user.email || '');
    setTelefon(user.telefon || '');
    setFormInitialized(true);
  }

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profil':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Profilul meu</h2>
                  <p className="text-gray-400 text-sm">Actualizează informațiile personale</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white transition-colors">
                ← Înapoi
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nume complet</label>
                <input
                  type="text"
                  value={nume}
                  onChange={(e) => setNume(e.target.value)}
                  placeholder="Ion Popescu"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ion@email.com"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
                <input
                  type="text"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  placeholder="07xxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {saveLoading ? 'Se salvează...' : 'Salvează modificările'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'trimite':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <BoxIcon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Trimite un colet</h2>
                  <p className="text-gray-400 text-sm">Completează detaliile și găsește cel mai bun curier</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white transition-colors">
                ← Înapoi
              </button>
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
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>🔍</span> Caută curieri disponibili
                </button>
              </div>
            </form>

            {/* Servicii disponibile */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-white mb-4">Servicii disponibile</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {servicii.map((serviciu, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-white/5 hover:border-orange-500/30 hover:bg-slate-900/80 transition-all cursor-pointer group">
                    <div className="text-3xl mb-3">{serviciu.icon}</div>
                    <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{serviciu.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{serviciu.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'comenzi':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <PackageIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Comenzile mele</h2>
                  <p className="text-gray-400 text-sm">Istoricul și statusul comenzilor tale</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white transition-colors">
                ← Înapoi
              </button>
            </div>
            
            {comenzi.length > 0 ? (
              <div className="space-y-4">
                {comenzi.map((comanda) => (
                  <div key={comanda.id} className="bg-slate-900/50 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                          <PackageIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-lg">{comanda.ruta}</div>
                          <div className="text-sm text-gray-500">#{comanda.id} • {comanda.data} • {comanda.greutate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium text-white ${comanda.statusColor}`}>
                          {comanda.status}
                        </span>
                        <button className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                          Detalii →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <PackageIcon className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg">Nu ai nicio comandă încă.</p>
                <button 
                  onClick={() => setActiveSection('trimite')}
                  className="mt-4 text-orange-400 hover:text-orange-300 font-medium"
                >
                  Trimite primul tău colet →
                </button>
              </div>
            )}
          </div>
        );

      case 'fidelitate':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Program Fidelitate</h2>
                  <p className="text-gray-400 text-sm">Câștigă puncte și obține reduceri</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white transition-colors">
                ← Înapoi
              </button>
            </div>
            
            <div className="max-w-md">
              <div className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-500/20 mb-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-yellow-400 mb-2">125</div>
                  <div className="text-gray-300 text-lg">Puncte acumulate</div>
                </div>
                <div className="mt-6 bg-slate-900/50 rounded-full h-4">
                  <div className="bg-linear-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all" style={{width: '25%'}}></div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-3">Încă 375 puncte până la următorul nivel</p>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-4">Recompense disponibile</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                  <span className="text-white flex items-center gap-2"><span className="text-2xl">🎁</span> Reducere 5%</span>
                  <span className="text-emerald-400 font-medium">Disponibil</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl opacity-60">
                  <span className="text-gray-300 flex items-center gap-2"><span className="text-2xl">🎁</span> Reducere 10%</span>
                  <span className="text-gray-500">500 puncte</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl opacity-60">
                  <span className="text-gray-300 flex items-center gap-2"><span className="text-2xl">🚀</span> Transport gratuit</span>
                  <span className="text-gray-500">1000 puncte</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'facturi':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Facturi & Plăți</h2>
                  <p className="text-gray-400 text-sm">Istoricul plăților și facturilor</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white transition-colors">
                ← Înapoi
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Factura #CP20250401</div>
                    <div className="text-sm text-gray-500">01/04/2025 • Plătită</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white text-lg">25€</div>
                  <button className="text-sm text-orange-400 hover:text-orange-300 font-medium">Descarcă PDF</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Factura #CP20250311</div>
                    <div className="text-sm text-gray-500">11/03/2025 • Plătită</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white text-lg">18€</div>
                  <button className="text-sm text-orange-400 hover:text-orange-300 font-medium">Descarcă PDF</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'suport':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <ChatIcon className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Contact & Suport</h2>
                  <p className="text-gray-400 text-sm">Suntem aici să te ajutăm</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-white transition-colors">
                ← Înapoi
              </button>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mb-8">
              <a href="mailto:suport@curierulperfect.ro" className="flex items-center gap-4 p-5 bg-slate-900/50 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📧
                </div>
                <div>
                  <div className="font-medium text-white">Email</div>
                  <div className="text-sm text-gray-500">suport@curierulperfect.ro</div>
                </div>
              </a>
              <a href="tel:+40312345678" className="flex items-center gap-4 p-5 bg-slate-900/50 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📞
                </div>
                <div>
                  <div className="font-medium text-white">Telefon</div>
                  <div className="text-sm text-gray-500">0312 345 678</div>
                </div>
              </a>
              <a href="https://wa.me/40712345678" target="_blank" className="flex items-center gap-4 p-5 bg-slate-900/50 rounded-xl border border-white/5 hover:border-green-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  💬
                </div>
                <div>
                  <div className="font-medium text-white">WhatsApp</div>
                  <div className="text-sm text-gray-500">Chat live 24/7</div>
                </div>
              </a>
            </div>
            
            <div className="max-w-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Trimite-ne un mesaj</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subiect</label>
                  <input 
                    type="text"
                    placeholder="Cu ce te putem ajuta?"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mesaj</label>
                  <textarea 
                    rows={4}
                    placeholder="Descrie problema sau întrebarea ta..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="py-3 px-6 rounded-xl font-semibold text-white bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-pink-500/30 transition-all"
                >
                  Trimite mesajul
                </button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>
              
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user.nume || user.email || 'C')[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-300">{user.email}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection ? (
          /* Section Content */
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sm:p-8">
            {renderSectionContent()}
          </div>
        ) : (
          /* Dashboard Home */
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {getGreeting()}, <span className="text-gradient">{nume ? nume.split(' ')[0] : 'Client'}</span>! 👋
                  </h1>
                  <p className="text-gray-400">Trimite colete în toată Europa cu curieri verificați.</p>
                </div>
                <button 
                  onClick={() => setActiveSection('trimite')}
                  className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  <BoxIcon className="w-5 h-5" />
                  Trimite un colet
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsData.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Dashboard Cards */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🚀</span> Acțiuni rapide
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {dashboardCards.map((card) => (
                    <DashboardCardComponent
                      key={card.id}
                      card={card}
                      onClick={() => setActiveSection(card.id)}
                      isActive={activeSection === card.id}
                    />
                  ))}
                </div>
              </div>

              {/* Activity Sidebar */}
              <div className="lg:col-span-1">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                  </div>
                  Activitate recentă
                </h2>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-white/5 p-4">
                  <div className="space-y-1">
                    {recentActivities.map((activity, index) => (
                      <ActivityItemComponent key={index} activity={activity} />
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                    Vezi tot istoricul →
                  </button>
                </div>

                {/* Quick CTA */}
                <div className="mt-6 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-2xl p-6 border border-orange-500/20">
                  <h3 className="font-semibold text-white mb-2">Trimite primul colet</h3>
                  <p className="text-sm text-gray-400 mb-4">Găsește curieri verificați pentru transport rapid și sigur.</p>
                  <button 
                    onClick={() => setActiveSection('trimite')}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Începe acum →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}




