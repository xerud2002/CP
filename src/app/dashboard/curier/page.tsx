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
  },
  {
    href: '/dashboard/curier/calendar',
    image: '/img/calendar-colectii.png',
    title: 'Calendar Colecții',
    description: 'Zilele disponibile pentru colectare',
  },
  {
    href: '/dashboard/curier/tarife',
    image: '/img/tarife-practicate.png',
    title: 'Tarife Practicate',
    description: 'Prețuri și servicii active',
  },
  {
    href: '/dashboard/curier/profil',
    image: '/img/cont-curier.png',
    title: 'Profilul Meu',
    description: 'Informații cont, rating, vehicul',
  },
  {
    href: '/dashboard/curier/ruta',
    image: '/img/ruta-curier.png',
    title: 'Ruta Curier',
    description: 'Construiește-ți ruta simplu și eficient',
  },
  {
    href: '/dashboard/curier/comunicare',
    image: '/img/delivery-van.png',
    title: 'Comunicare & Sistem',
    description: 'Curse în desfășurare',
  },
  {
    href: '/dashboard/curier/comenzi',
    image: '/img/comenzile-mele.png',
    title: 'Comenzile Mele',
    description: 'Lista coletelor ridicate',
  },
  {
    href: '/dashboard/curier/plati',
    image: '/img/plati-si-facturi.png',
    title: 'Plăți & Facturi',
    description: 'Istoric și PDF-uri',
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
        <div className="text-green-400 text-xl">Se încarcă...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 text-center mb-8">
          Bine ai revenit, curierule!
        </h1>
        
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="dashboard-card">
              <Image
                src={card.image}
                alt={card.title}
                width={96}
                height={96}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h2 className="text-green-400 font-semibold text-lg mb-2">
                {card.title}
              </h2>
              <p className="text-gray-400 text-sm">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
