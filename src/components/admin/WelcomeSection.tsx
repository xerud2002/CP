'use client';

import { getGreeting } from './types';

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  const greeting = getGreeting();

  return (
    <section className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-white/10 p-4 sm:p-6 lg:p-8">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              {greeting}, <span className="text-red-400">{userName}</span>! 🛡️
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Panoul de administrare al platformei Curierul Perfect.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs sm:text-sm font-medium border border-orange-500/30">
              ● Administrator
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
