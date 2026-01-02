'use client';

import Link from 'next/link';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

export default function HeroSection() {
  return (
    <section id="top" className="relative min-h-dvh lg:min-h-[90vh] flex items-center px-3 sm:px-4 py-8 sm:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in">
            {/* Badge - Mobile optimized */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] sm:text-xs md:text-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="whitespace-nowrap">Acoperire în toată Europa</span>
              </span>
            </div>

            {/* Main Title - Mobile first */}
            <h1 className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-[1.15] sm:leading-[1.1] relative">
              {/* Glow effect behind title */}
              <div className="absolute -inset-4 bg-linear-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl opacity-30 animate-pulse"></div>
              
              <span className="relative text-white drop-shadow-lg">Transport</span>
              <br />
              <span className="relative bg-linear-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x font-extrabold drop-shadow-2xl">
                național și european
              </span>
              <br />
              <span className="relative text-white drop-shadow-lg">rapid și sigur</span>
            </h1>

            {/* Subtitle - Mobile optimized */}
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-lg mb-5 sm:mb-6 md:mb-8 leading-relaxed">
              Platformă de transport pentru România și toată Europa. Conectăm clienți cu curieri verificați pentru livrări rapide și sigure: colete, mobilă, auto, persoane, animale și multe altele.
            </p>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
              <Link href="/comanda" className="relative group/btn inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto min-h-12 rounded-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 transition-transform group-hover/btn:scale-110"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 rounded-xl blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                
                {/* Content */}
                <span className="relative z-10 text-white">Plasează o comandă</span>
              </Link>
              <Link href="/devino-partener" className="relative group/btn inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg w-full sm:w-auto min-h-12 rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95">
                {/* Gradient emerald background */}
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 transition-transform group-hover/btn:scale-110"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                {/* Glow */}
                <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 rounded-xl blur-lg opacity-40 group-hover/btn:opacity-60 transition-opacity"></div>
                
                <span className="relative z-10 text-white">Devino Partener</span>
              </Link>
            </div>

            {/* Trust indicators - Grid on mobile */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:flex md:flex-wrap md:items-center md:gap-6 text-[10px] sm:text-xs md:text-sm text-gray-400">
              <div className="flex flex-col md:flex-row items-center gap-0.5 sm:gap-1 md:gap-2 text-center md:text-left">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Curieri verificați</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Recenzii verificate</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Contact direct</span>
              </div>
            </div>
          </div>

          {/* Right side - Services Grid */}
          <div className="animate-fade-in-delayed">
            {/* Hidden h2 for proper heading hierarchy */}
            <h2 className="sr-only">Servicii disponibile</h2>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-linear-to-r from-orange-500/10 to-green-500/10 rounded-3xl blur-2xl"></div>
              
              {/* Services Grid - 3x3 */}
              <div className="relative grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
                {/* Colete */}
                <Link 
                  href="/servicii/colete"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-blue-500/30 hover:border-blue-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="colete" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Colete</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Pachete și cutii</p>
                  </div>
                </Link>

                {/* Plicuri */}
                <Link 
                  href="/servicii/plicuri"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="plicuri" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Plicuri</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Documente, acte</p>
                  </div>
                </Link>

                {/* Transport Persoane */}
                <Link 
                  href="/servicii/persoane"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-rose-500/30 hover:border-rose-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-rose-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-rose-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="persoane" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-rose-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Persoane</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Transport în Europa</p>
                  </div>
                </Link>

                {/* Electronice */}
                <Link 
                  href="/servicii/electronice"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-purple-500/30 hover:border-purple-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="electronice" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Electronice</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">TV, electrocasnice</p>
                  </div>
                </Link>

                {/* Animale */}
                <Link 
                  href="/servicii/animale"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-pink-500/30 hover:border-pink-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="animale" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Animale</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Transport animale</p>
                  </div>
                </Link>

                {/* Transport Platformă */}
                <Link 
                  href="/servicii/platforma"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-red-500/30 hover:border-red-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="platforma" className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Transport Platformă</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Mașini, utilaje</p>
                  </div>
                </Link>

                {/* Tractări Auto */}
                <Link 
                  href="/servicii/tractari"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-orange-500/30 hover:border-orange-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="tractari" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Tractări Auto</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Asistență rutieră</p>
                  </div>
                </Link>

                {/* Mutări Mobilă */}
                <Link 
                  href="/servicii/mobila"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-amber-500/30 hover:border-amber-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="mobila" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Mutări Mobilă</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Transport mobilier</p>
                  </div>
                </Link>

                {/* Transport Paleți */}
                <Link 
                  href="/servicii/paleti"
                  className="group relative bg-slate-800/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-orange-500/30 hover:border-orange-400/50 p-2 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2">
                      <ServiceIcon service="paleti" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-400" />
                    </div>
                    <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm mb-0.5 leading-tight">Transport Paleți</h3>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight">Marfă paletizată</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - Hidden on mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-400 text-xs">Scroll</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
