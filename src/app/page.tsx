'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { countries } from '@/lib/constants';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

// Lazy load WhatsApp button - not critical for initial render
const WhatsAppButton = dynamic(() => import('@/components/ui/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

// Structured data for SEO (static - defined outside component)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Curierul Perfect",
  "url": "https://curierulperfect.com",
  "logo": "https://curierulperfect.com/logo.png",
  "description": "Curierul Perfect - Platformă de transport și curierat în România și Europa. Servicii de transport colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări. Compară oferte, alege curierul potrivit și primește livrări rapide și sigure.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+40-XXX-XXX-XXX",
    "contactType": "customer service",
    "availableLanguage": ["Romanian", "English"]
  },
  "sameAs": [
    "https://www.facebook.com/curierulperfect",
    "https://www.instagram.com/curierulperfect"
  ],
  "areaServed": {
    "@type": "Place",
    "name": "Europa"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicii de Transport",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport colete" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport plicuri" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport persoane" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport mobilă" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport electronice" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport animale" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport cu platformă" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tractări auto" } }
    ]
  }
};

export default function Home() {

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen relative bg-slate-900">
      {/* Hero Section - Optimized for Mobile */}
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
              <h1 className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-[1.15] sm:leading-[1.1]">
                <span className="text-white">Transport</span>
                <br />
                <span className="text-gradient">național și european</span>
                <br />
                <span className="text-white">rapid și sigur</span>
              </h1>

              {/* Subtitle - Mobile optimized */}
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-lg mb-5 sm:mb-6 md:mb-8 leading-relaxed">
                Platformă de transport pentru România și toată Europa. Conectăm clienți cu curieri verificați pentru livrări rapide și sigure: colete, mobilă, auto, persoane, animale și multe altele.
              </p>

              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
                <Link href="/comanda" className="btn-primary px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg flex items-center justify-center w-full sm:w-auto min-h-12">
                  Plasează o comandă
                </Link>
                <Link href="/devino-partener" className="btn-secondary px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg flex items-center justify-center w-full sm:w-auto min-h-12">
                  Devino Partener
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
                  <span>Prețuri transparente</span>
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
                    href="/comanda?serviciu=colete"
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
                    href="/comanda?serviciu=plicuri"
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
                    href="/comanda?serviciu=persoane"
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
                    href="/comanda?serviciu=electronice"
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
                    href="/comanda?serviciu=animale"
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
                    href="/comanda?serviciu=platforma"
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
                    href="/comanda?serviciu=tractari"
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
                    href="/comanda?serviciu=mobila"
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
                    href="/comanda?serviciu=paleti"
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
          <span className="text-gray-500 text-xs">Scroll</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      {/* How It Works Section */}
      <section className="below-fold py-12 sm:py-16 md:py-24 px-3 sm:px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Simplu și rapid
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              <span className="text-white">Cum </span>
              <span className="text-gradient">funcționează</span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto px-4">
              În doar 4 pași simpli, transportul tău ajunge la destinație în siguranță.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-orange-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-300">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">PASUL 01</div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 px-2">Selectează serviciul</h3>
                <p className="text-gray-400 text-xs sm:text-sm px-2">Alege tipul de transport și destinația pentru trimiterea ta.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-green-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-green-500/20 to-green-600/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-green-500/40 transition-all duration-300">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">PASUL 02</div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 px-2">Primește oferte</h3>
                <p className="text-gray-400 text-xs sm:text-sm px-2">Transportatorii disponibili îți trimit oferte personalizate și competitive.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-blue-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">PASUL 03</div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 px-2">Alege transportatorul</h3>
                <p className="text-gray-400 text-xs sm:text-sm px-2">Compară prețurile, recenziile și alege transportatorul potrivit pentru tine.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-linear-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-yellow-500/40 transition-all duration-300">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">PASUL 04</div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 px-2">Lasă o recenzie</h3>
                <p className="text-gray-400 text-xs sm:text-sm px-2">Ajută comunitatea lăsând feedback despre experiența ta cu transportatorul.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="below-fold py-12 sm:py-16 px-3 sm:px-4 bg-linear-to-b from-slate-900 to-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Avantajele platformei
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              <span className="text-white">De ce să alegi </span>
              <span className="text-gradient">Curierul Perfect</span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Soluție completă de transport național și european pentru orice tip de marfă sau pasageri între România și Europa
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Benefit 1 */}
            <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-orange-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-orange-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Transportatori Verificați</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Toți partenerii noștri sunt verificați și au recenzii reale de la clienți. Transport sigur și profesionist garantat.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Prețuri Competitive</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Primești multiple oferte și alegi cea mai bună. Fără comisioane ascunse - plătești exact prețul negociat cu transportatorul.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Contact Direct</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Comunici direct cu transportatorul. Negociezi detaliile și primești confirmări în fiecare etapă a transportului.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Servicii Diverse</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  De la colete mici la mutări complete, transport persoane, animale de companie și vehicule - toate serviciile într-un singur loc.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Răspuns Rapid</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Postezi cererea și primești oferte în câteva ore. Transportatorii îți răspund rapid pentru a-ți rezolva nevoia urgent.
                </p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-amber-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">Acoperire Națională și Europeană</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Transport național în toată România și internațional în peste 16 țări europene. De la UK la Spania, de la Germania la Italia - acoperire completă.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform vs Facebook Groups Comparison Section */}
      <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden bg-linear-to-b from-slate-900/50 via-slate-900 to-slate-900/50">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 shadow-lg shadow-orange-500/10">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Platformă profesională
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              <span className="text-white">De ce </span>
              <span className="text-gradient">Curierul Perfect</span>
              <br className="hidden sm:block" />
              <span className="text-white"> în loc de </span>
              <span className="text-red-400">grupuri Facebook</span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Platformă dedicată cu funcții profesionale care depășesc cu mult posibilitățile unui grup de Facebook
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
            {/* Curierul Perfect - Left Column */}
            <div className="space-y-4 sm:space-y-5">
              <div className="text-center md:text-left mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/40 border border-orange-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Curierul Perfect
                </div>
              </div>

              {/* Feature 1 - Chat privat */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">1</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Chat privat dedicat</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Conversații private cu fiecare curier, fără ca alții să vadă mesajele tale și detaliile comenzii
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Sistem de verificare și rating */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">2</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Sistem de verificare și rating</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Fiecare curier e verificat și evaluat - vezi rating-ul și istoricul înainte să alegi
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Recenzii complete */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">3</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Recenzii pozitive ȘI negative</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Vezi feedback complet - nu doar like-uri, ci recenzii reale care te ajută să alegi corect
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 6 - Dashboard organizat */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">6</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Dashboard organizat</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Toate comenzile într-un singur loc, cu istoric complet, status și documentație
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 7 - Notificări instant */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">7</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Notificări instant</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Primești alertă imediat când un curier îți scrie - nu pierzi nicio ofertă
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 - Securitate GDPR */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">4</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Protecție GDPR și securitate</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Datele tale sunt protejate conform legislației europene - securitate maximă garantată
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 8 - Filtrare avansată */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">8</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Filtrare avansată</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Caută rapid după țară, serviciu, număr comandă - găsești instant ce ai nevoie
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 9 - Design profesional */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">9</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Design profesional</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Interface modernă, ușor de folosit pe orice device - experiență premium
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 5 - Control oferte */}
              <div className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">5</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Alegi câte oferte primești</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Control total - vezi ofertele organizat, compari și alegi doar pe cele care te interesează
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Groups - Right Column */}
            <div className="space-y-4 sm:space-y-5">
              <div className="text-center md:text-left mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-linear-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/40 text-red-400 font-bold text-base sm:text-lg shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Grupuri Facebook
                </div>
              </div>

              {/* Disadvantage 1 */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">1</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Comentarii publice</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Toată lumea vede detaliile comenzii tale, prețurile discutate și informațiile personale
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 2 */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">2</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Fără verificare</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Nu știi cine e de încredere - nicio garanție, niciun istoric, doar promisiuni
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 3 - Doar like-uri */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">3</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Doar like-uri, fără recenzii negative</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Problemele reale se pierd în comentarii - vezi doar partea frumoasă
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 4 - Zero protecție GDPR */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">4</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Zero protecție date personale</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Datele tale rămân publice la infinit - risc major de securitate
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 5 - Spam și mesaje */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">5</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Spam și mesaje haotice</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Oferte de la oricine, mesaje neverificate - nu poți filtra sau organiza nimic
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 6 - Postări haotice */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">6</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Postări haotice și greu de urmărit</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Pierzi comenzi în miile de postări zilnice - dificil de urmărit ce ai comandat
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 7 - Scroll infinit */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">7</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Scroll infinit prin comentarii</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Cauți manual prin sute de comentarii pentru un răspuns - extrem de ineficient
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 8 - Imposibil de filtrat */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">8</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Imposibil de filtrat și căutat</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Nu poți căuta rapid ce te interesează - pierdere de timp cu browsing manual
                    </p>
                  </div>
                </div>
              </div>

              {/* Disadvantage 9 - Interface improvizată */}
              <div className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">9</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">Interface improvizată</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Facebook nu e făcut pentru transport - folosești o platformă neprofesionistă
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <div className="inline-block p-6 sm:p-8 rounded-2xl bg-linear-to-br from-slate-800/90 to-slate-800/50 border border-orange-500/30 shadow-2xl shadow-orange-500/20">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                Treci la <span className="text-gradient">profesionalism</span>
              </h3>
              <p className="text-gray-400 text-sm sm:text-base mb-5 sm:mb-6 max-w-xl mx-auto">
                Alătură-te platformei moderne de transport care pune securitatea, eficiența și experiența ta pe primul loc
              </p>
              <Link href="/comanda" className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg inline-flex items-center gap-2">
                Plasează prima comandă
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-linear-to-b from-slate-900/50 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Procesul complet
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-3">
              <span className="text-white">De la comandă la </span>
              <span className="text-gradient">livrare</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Urmărește fiecare pas al procesului de transport - simplu, transparent și eficient
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line - hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-linear-to-b from-orange-500 via-green-500 to-purple-500"></div>

            {/* Timeline Steps */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                {/* Text pe mobil (order-1), pe desktop stânga */}
                <div className="md:w-1/2 md:text-right md:pr-8 w-full order-1 md:order-0">
                  <div className="text-center md:text-right w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">Completezi formularul</h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                      Alegi serviciul, destinația și completezi detaliile despre ce vrei să transporți. Procesul e simplu și rapid.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[11px] sm:text-xs font-bold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      2 MINUTE
                    </div>
                  </div>
                </div>
                {/* Iconiță pe mobil (order-2), pe desktop centru */}
                <div className="relative shrink-0 order-2 md:order-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-slate-900">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                <div className="md:w-1/2 md:pr-8 hidden md:block"></div>
                {/* Text pe mobil (order-1), pe desktop dreapta */}
                <div className="md:w-1/2 md:pl-8 w-full text-center md:text-left order-1 md:order-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">Primești oferte</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                    Transportatorii disponibili pe ruta ta văd cererea și îți trimit oferte personalizate cu prețuri competitive.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[11px] sm:text-xs font-bold">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    2-24 ORE
                  </div>
                </div>
                {/* Iconiță pe mobil (order-2), pe desktop centru */}
                <div className="relative shrink-0 order-2 md:order-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 border-4 border-slate-900">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                {/* Text pe mobil (order-1), pe desktop stânga */}
                <div className="md:w-1/2 md:text-right md:pr-8 w-full order-1 md:order-0">
                  <div className="text-center md:text-right w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">Compari și alegi</h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                      Vezi toate ofertele, compari prețurile, citești recenziile și alegi transportatorul care ți se potrivește cel mai bine.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] sm:text-xs font-bold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      5-10 MINUTE
                    </div>
                  </div>
                </div>
                {/* Iconiță pe mobil (order-2), pe desktop centru */}
                <div className="relative shrink-0 order-2 md:order-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-slate-900">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                <div className="md:w-1/2 md:pr-8 hidden md:block"></div>
                {/* Text pe mobil (order-1), pe desktop dreapta */}
                <div className="md:w-1/2 md:pl-8 w-full text-center md:text-left order-1 md:order-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">Confirmi detaliile</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                    Comunici direct cu transportatorul ales, negociezi detalii suplimentare dacă e nevoie și confirmi comanda finală.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px] sm:text-xs font-bold">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                    INSTANT
                  </div>
                </div>
                {/* Iconiță pe mobil (order-2), pe desktop centru */}
                <div className="relative shrink-0 order-2 md:order-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border-4 border-slate-900">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                {/* Text pe mobil (order-1), pe desktop stânga */}
                <div className="md:w-1/2 md:text-right md:pr-8 w-full order-1 md:order-0">
                  <div className="text-center md:text-right w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">Transportul e realizat</h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                      Transportatorul ridică și livrează conform acordului. Primești actualizări pe parcurs și confirmare la finalizare.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      CONFORM ACORDULUI
                    </div>
                  </div>
                </div>
                {/* Iconiță pe mobil (order-2), pe desktop centru */}
                <div className="relative shrink-0 order-2 md:order-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-slate-900">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
              </div>

              {/* Step 6 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                <div className="md:w-1/2 md:pr-8 hidden md:block"></div>
                {/* Text pe mobil (order-1), pe desktop dreapta */}
                <div className="md:w-1/2 md:pl-8 w-full text-center md:text-left order-1 md:order-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">Lași o recenzie</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                    Ajuți comunitatea lăsând o recenzie bazată pe experiența ta. Feedback-ul tău contează pentru alți utilizatori.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[11px] sm:text-xs font-bold">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    OPȚIONAL
                  </div>
                </div>
                {/* Iconiță pe mobil (order-2), pe desktop centru */}
                <div className="relative shrink-0 order-2 md:order-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30 border-4 border-slate-900">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 sm:mt-12 md:mt-14 text-center px-3">
            <Link 
              href="/comanda"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95 md:hover:scale-105 text-sm sm:text-base min-h-12 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
            >
              <span>Solicită oferte gratuit</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">Gratuit și fără obligații • Primești oferte în 24h</p>
          </div>
        </div>
      </section>

      {/* Become Courier CTA */}
      <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-900/95 to-slate-900 pointer-events-none"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-100 h-100 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-slate-800/90 via-slate-800/70 to-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-green-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-green-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative p-5 sm:p-6 md:p-10 lg:p-14">
              {/* Icon with animation */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-5 sm:mb-6 md:mb-8 group">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl animate-pulse"></div>
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-full h-full rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M8 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0m12 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M3 9h13a2 2 0 012 2v4H3V9zm13 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4h13z" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <div className="text-center mb-5 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 px-2">
                  Vrei să fii <span className="text-gradient">Partener de Transport?</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                  Găsește clienți pe rutele tale existente. Selectezi zonele pe care le acoperi și serviciile oferite, iar noi îți aducem comenzi pe drumul tău.
                </p>
              </div>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
                {/* Benefit 1 */}
                <div className="group relative bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/5 hover:border-green-500/30 transition-all duration-300 active:scale-95 md:hover:-translate-y-1">
                  <div className="absolute inset-0 bg-linear-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-center">Alegi rutele tale</h3>
                    <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed">
                      Controlezi destinațiile și programul. Lucrezi doar pe rutele care te interesează.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="group relative bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-300 active:scale-95 md:hover:-translate-y-1">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-center">Câștiguri pe drum</h3>
                    <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed">
                      Optimizează-ți veniturile transportând pe rutele pe care oricum călătorești.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="group relative bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300 active:scale-95 md:hover:-translate-y-1">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-center">Program flexibil</h3>
                    <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed">
                      Tu decizi când și cât lucrezi. Fără obligații, în ritmul tău.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                <Link 
                  href="/register?role=curier" 
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all active:scale-95 md:hover:scale-105 text-base sm:text-lg min-h-12"
                >
                  <span>Înregistrează-te Gratuit</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/despre-parteneri" 
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-transparent hover:bg-green-500/10 text-green-400 font-semibold rounded-xl border-2 border-green-500/30 hover:border-green-500/50 transition-all active:scale-95 md:hover:scale-105 text-base sm:text-lg min-h-12"
                >
                  <span>Află Mai Multe</span>
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 pt-8 border-t border-white/5">
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-white">100% gratuit pe perioadă nedeterminată</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-white">Contactezi clienții direct - zero comisioane</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-white">Activare în 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Coverage Section */}
      <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden bg-linear-to-b from-slate-900/50 to-slate-900">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Acoperire națională și europeană
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              <span className="text-white">Transport național și european sigur în </span>
              <span className="text-gradient">peste 16 țări</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Livrări naționale și internaționale: colete, mobilă, transport persoane și animale - rețea extinsă de transportatori verificați pentru orice destinație
            </p>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
            {countries.map((country, index) => (
              <div 
                key={country.code}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="relative h-full bg-linear-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm hover:from-slate-800/80 hover:to-slate-800/60 border border-white/5 hover:border-white/20 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 transition-all duration-300 active:scale-95 md:hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-blue-500/10 to-transparent rounded-tr-lg sm:rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
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
              </div>
            ))}
          </div>

          {/* Final CTA Card */}
          <div className="max-w-2xl mx-auto">
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-orange-500 via-orange-600 to-green-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              {/* Main card */}
              <div className="relative bg-linear-to-br from-slate-800/95 via-slate-800/90 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 lg:p-12 overflow-hidden shadow-2xl">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-green-500/5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-green-500/10 to-transparent rounded-full blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Animated icon */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl animate-pulse opacity-30"></div>
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative w-full h-full rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300">
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
                    className="group/btn inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all active:scale-95 md:hover:scale-105 text-base sm:text-lg min-h-12"
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
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Fără înregistrare</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Răspuns rapid</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>16 țări disponibile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <WhatsAppButton />
      {/* <SocialProof /> */}
    </main>
    </>
  );
}

