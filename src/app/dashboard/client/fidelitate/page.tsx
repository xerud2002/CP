'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, StarIcon, GiftIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';

const loyaltyTiers = [
  { name: 'Bronz', points: 0, discount: 0, color: 'from-amber-700 to-amber-500' },
  { name: 'Argint', points: 500, discount: 5, color: 'from-gray-400 to-gray-300' },
  { name: 'Aur', points: 1000, discount: 10, color: 'from-yellow-500 to-yellow-400' },
  { name: 'Platină', points: 2500, discount: 15, color: 'from-cyan-400 to-blue-400' },
];

const benefits = [
  { icon: '🎁', title: '1 Punct = 1 RON', description: 'Câștigi 1 punct pentru fiecare RON cheltuit' },
  { icon: '💰', title: 'Reduceri Exclusive', description: 'Până la 15% reducere pentru membrii Platină' },
  { icon: '🚀', title: 'Prioritate la Comenzi', description: 'Comenzile tale au prioritate la procesare' },
  { icon: '🎉', title: 'Oferte Speciale', description: 'Acces la promoții și oferte exclusive' },
];

export default function FidelitateClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPoints] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

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

  const currentTier = loyaltyTiers.find((tier, index) => {
    const nextTier = loyaltyTiers[index + 1];
    return currentPoints >= tier.points && (!nextTier || currentPoints < nextTier.points);
  }) || loyaltyTiers[0];

  const nextTier = loyaltyTiers.find(tier => tier.points > currentPoints);
  const pointsToNext = nextTier ? nextTier.points - currentPoints : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/dashboard/client" 
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">Program Fidelitate</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Puncte & reduceri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Current Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentTier.color} text-white font-bold mb-4`}>
              <StarIcon className="w-5 h-5" />
              Nivel {currentTier.name}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">{currentPoints} Puncte</h2>
            <p className="text-gray-400">Reducere actuală: {currentTier.discount}%</p>
          </div>

          {nextTier && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progres către {nextTier.name}</span>
                <span className="text-white font-medium">{pointsToNext} puncte rămase</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${nextTier.color} transition-all duration-500`}
                  style={{ width: `${(currentPoints / nextTier.points) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <GiftIcon className="w-5 h-5 text-yellow-400" />
            Niveluri de Loialitate
          </h2>
          
          <div className="space-y-4">
            {loyaltyTiers.map((tier) => (
              <div 
                key={tier.name}
                className={`p-4 rounded-xl border transition-all ${
                  tier.name === currentTier.name
                    ? 'bg-white/5 border-white/20'
                    : 'bg-slate-700/30 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                      <StarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{tier.name}</h3>
                      <p className="text-sm text-gray-400">{tier.points} puncte</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{tier.discount}%</p>
                    <p className="text-xs text-gray-500">reducere</p>
                  </div>
                </div>
                {tier.name === currentTier.name && (
                  <div className="mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg inline-block">
                    Nivel Actual
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-500/20 p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Câștigă Puncte Acum!</h3>
          <p className="text-gray-300 mb-4">Fiecare comandă te apropie de următorul nivel</p>
          <Link 
            href="/comanda"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25"
          >
            <StarIcon className="w-5 h-5" />
            Comandă Transport
          </Link>
        </div>

        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>
    </div>
  );
}
