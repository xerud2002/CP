import Link from 'next/link';
import { serviceTypes } from '@/lib/constants';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicii Transport | Curierul Perfect',
  description: 'Descoperă toate serviciile de transport oferite: colete, plicuri, persoane, electronice, animale, platformă, tractări, mobilă și paleți. Transport sigur România - Europa.',
  openGraph: {
    title: 'Servicii Transport | Curierul Perfect',
    description: 'Descoperă toate serviciile de transport oferite: colete, plicuri, persoane, electronice, animale, platformă, tractări, mobilă și paleți.',
  },
};

export default function ServiciiPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            9 tipuri de servicii
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Servicii de <span className="text-gradient">Transport</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-xl mx-auto px-2">
            Găsește curierul perfect pentru orice tip de transport între România și Europa
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            {serviceTypes.map((service) => (
              <Link
                key={service.id}
                href={`/servicii/${service.id}`}
                className={`card p-4 sm:p-5 lg:p-6 hover:${service.borderColor} transition group block active:scale-[0.98]`}
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${service.bgColor} border ${service.borderColor} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <ServiceIcon service={service.id} className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${service.color}`} />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1.5 sm:mb-2 leading-tight">{service.label}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 leading-relaxed">{service.description}</p>
                <span className={`inline-flex items-center gap-1 sm:gap-1.5 ${service.color} text-xs sm:text-sm font-semibold group-hover:gap-2 transition-all`}>
                  Vezi detalii
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="card p-4 sm:p-5 lg:p-6 xl:p-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white">De ce Curierul Perfect?</h2>
            </div>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-white text-xs sm:text-sm leading-tight">Verificați</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Toți curierii sunt verificați și au documentație completă</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-white text-xs sm:text-sm leading-tight">Rapid</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Primești oferte în câteva ore de la curieri activi</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-semibold text-white text-xs sm:text-sm leading-tight">Asigurat</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Transportatorii au asigurare CMR pentru marfă</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <span className="font-semibold text-white text-xs sm:text-sm leading-tight">Chat</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Comunici direct cu curierul pentru detalii</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="card p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-orange-500/20 text-center">
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-2 sm:mb-3">Ai nevoie de transport?</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto leading-relaxed px-2">
              Postează cererea ta gratuit și primește oferte de la curieri verificați în câteva ore.
            </p>
            <Link href="/comanda" className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 min-h-11 active:scale-95 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Postează cerere
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
