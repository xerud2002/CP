'use client';

import Link from 'next/link';
import Image from 'next/image';
import { countries } from '@/lib/constants';

const ctaFeatures = [
  'Fără înregistrare',
  'Răspuns rapid',
  '20 țări disponibile',
];

// Map country codes to transport route slugs
const countryToRouteMap: Record<string, string> = {
  'DE': 'romania-germania',
  'IT': 'romania-italia',
  'ES': 'romania-spania',
  'FR': 'romania-franta',
  'GB': 'romania-anglia',
  'AT': 'romania-austria',
  'BE': 'romania-belgia',
  'NL': 'romania-olanda',
  'SC': 'romania-scotia',
  'WLS': 'romania-tara-galilor',
  'NIR': 'romania-irlanda-de-nord',
  'MD': 'romania-moldova',
  'IE': 'romania-irlanda',
  'NO': 'romania-norvegia',
  'SE': 'romania-suedia',
  'DK': 'romania-danemarca',
  'FI': 'romania-finlanda',
  'GR': 'romania-grecia',
  'PT': 'romania-portugalia',
};

export default function TrustCoverage() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-900">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Acoperire națională și europeană
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            <span className="text-white">Transport național și european sigur în </span>
            <span className="text-gradient">peste 20 țări</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Livrări naționale și internaționale: colete, mobilă, transport persoane și animale - rețea extinsă de transportatori verificați pentru orice destinație
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
          {countries.map((country, index) => {
            const routeSlug = countryToRouteMap[country.code];
            const href = routeSlug ? `/transport/${routeSlug}` : '/transport';
            
            return (
              <Link
                key={country.code}
                href={href}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="relative h-full bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm hover:from-slate-800/80 hover:to-slate-800/60 border border-white/5 hover:border-white/20 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-tr-lg sm:rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                    {/* Flag container */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md sm:rounded-lg bg-slate-700/50 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                        <Image 
                          src={country.flag} 
                          alt={country.name} 
                          width={24} 
                          height={18} 
                          className="rounded-sm object-cover sm:w-7 sm:h-5"
                        />
                      </div>
                    </div>
                    
                    {/* Country info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-xs sm:text-sm group-hover:text-blue-400 transition-colors truncate">
                        {country.name}
                      </h3>
                      <p className="text-gray-500 text-[10px] sm:text-xs">Disponibil</p>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-500 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-shadow"></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Final CTA Card */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-orange-600 to-green-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 lg:p-12 overflow-hidden shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-green-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-3xl"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Animated icon */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl animate-pulse opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
                
                {/* Text */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3 px-2">
                  Ai nevoie de transport?
                </h3>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-2">
                  Colete, mobilă, persoane, animale sau mutări complete - găsește transportatorul perfect în câteva secunde
                </p>
                
                {/* Button */}
                <Link 
                  href="#top" 
                  className="group/btn inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all active:scale-95 md:hover:scale-105 text-base sm:text-lg min-h-12"
                >
                  <span>Începe acum</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-100 font-normal">Este gratuit</span>
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>

                {/* Features below button */}
                <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
                  {ctaFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
