'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const dashboardCards = [
  {
    href: '/dashboard/curier/zona-acoperire',
    image: '/img/zona-acoperire.png',
    title: 'Zona de Acoperire',
    description: 'Țările și județele acoperite',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    href: '/dashboard/curier/calendar',
    image: '/img/calendar-colectii.png',
    title: 'Calendar Colecții',
    description: 'Zilele disponibile pentru colectare',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    href: '/dashboard/curier/tarife',
    image: '/img/tarife-practicate.png',
    title: 'Tarife Practicate',
    description: 'Prețuri și servicii active',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    href: '/dashboard/curier/profil',
    image: '/img/cont-curier.png',
    title: 'Profilul Meu',
    description: 'Informații cont, rating, vehicul',
    color: 'from-orange-500/20 to-amber-500/20',
  },
  {
    href: '/dashboard/curier/ruta',
    image: '/img/ruta-curier.png',
    title: 'Ruta Curier',
    description: 'Construiește-ți ruta simplu și eficient',
    color: 'from-red-500/20 to-rose-500/20',
  },
  {
    href: '/dashboard/curier/comunicare',
    image: '/img/delivery-van.png',
    title: 'Comunicare & Sistem',
    description: 'Curse în desfășurare',
    color: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    href: '/dashboard/curier/comenzi',
    image: '/img/comenzile-mele.png',
    title: 'Comenzile Mele',
    description: 'Lista coletelor ridicate',
    color: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    href: '/dashboard/curier/plati',
    image: '/img/plati-si-facturi.png',
    title: 'Plăți & Facturi',
    description: 'Istoric și PDF-uri',
    color: 'from-yellow-500/20 to-orange-500/20',
  },
];

export default function CurierDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

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
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="card mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-green-500/10"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bine ai revenit! 👋
              </h1>
              <p className="text-gray-400">
                Gestionează-ți activitatea de curier din panoul de control.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Status</p>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Activ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Comenzi noi</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">În tranzit</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Livrate luna aceasta</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">⭐ --</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="dashboard-card group">
              <div className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`}></div>
              <Image
                src={card.image}
                alt={card.title}
                width={96}
                height={96}
                className="w-20 h-20 mx-auto mb-4 object-contain relative z-10"
              />
              <h2 className="text-green-400 font-semibold text-lg mb-2 relative z-10">
                {card.title}
              </h2>
              <p className="text-gray-400 text-sm relative z-10">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
