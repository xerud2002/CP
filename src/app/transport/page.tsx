import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

export const metadata: Metadata = {
  title: 'Transport România - Europa | Colete, Mobilă, Persoane | Curierul Perfect',
  description: 'Găsește transportatori verificați între România și Europa. Colete, mobilă, persoane, mașini. Germania, Italia, Spania, Franța, UK, Austria, Belgia, Olanda.',
  openGraph: {
    title: 'Transport România - Europa | Curierul Perfect',
    description: 'Găsește transportatori verificați între România și Europa.',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  alternates: {
    canonical: 'https://curierulperfect.com/transport',
  },
};

const routes = [
  {
    slug: 'romania-germania',
    country: 'Germania',
    flag: 'de',
    description: 'Berlin, München, Frankfurt',
    popular: true,
  },
  {
    slug: 'romania-italia',
    country: 'Italia',
    flag: 'it',
    description: 'Roma, Milano, Torino',
    popular: true,
  },
  {
    slug: 'romania-spania',
    country: 'Spania',
    flag: 'es',
    description: 'Madrid, Barcelona, Valencia',
    popular: true,
  },
  {
    slug: 'romania-franta',
    country: 'Franța',
    flag: 'fr',
    description: 'Paris, Lyon, Marseille',
    popular: false,
  },
  {
    slug: 'romania-uk',
    country: 'Marea Britanie',
    flag: 'gb',
    description: 'Londra, Manchester, Birmingham',
    popular: true,
  },
  {
    slug: 'romania-austria',
    country: 'Austria',
    flag: 'at',
    description: 'Viena, Graz, Salzburg',
    popular: false,
  },
  {
    slug: 'romania-belgia',
    country: 'Belgia',
    flag: 'be',
    description: 'Bruxelles, Antwerp, Gent',
    popular: false,
  },
  {
    slug: 'romania-olanda',
    country: 'Olanda',
    flag: 'nl',
    description: 'Amsterdam, Rotterdam, Haga',
    popular: false,
  },
];

export default function TransportPage() {
  const popularRoutes = routes.filter(r => r.popular);
  const otherRoutes = routes.filter(r => !r.popular);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative bg-linear-to-b from-slate-900 to-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Transport România - Europa
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Conectăm clienți cu transportatori verificați. 
            Postezi cererea gratuit, primești oferte, alegi.
          </p>
          <Link
            href="/comanda"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
          >
            Postează cerere gratuită
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Rute populare
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route) => (
              <Link
                key={route.slug}
                href={`/transport/${route.slug}`}
                className="group bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Image 
                      src="/img/flag/ro.svg" 
                      alt="România" 
                      width={32} 
                      height={24} 
                      className="rounded shadow" 
                    />
                    <div className="absolute -right-2 -bottom-2">
                      <Image 
                        src={`/img/flag/${route.flag}.svg`} 
                        alt={route.country} 
                        width={32} 
                        height={24} 
                        className="rounded shadow" 
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {route.country}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{route.description}</p>
                <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm font-medium">
                  Vezi detalii
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other Routes */}
      <section className="py-12 sm:py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Alte destinații
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherRoutes.map((route) => (
              <Link
                key={route.slug}
                href={`/transport/${route.slug}`}
                className="group bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Image 
                      src="/img/flag/ro.svg" 
                      alt="România" 
                      width={32} 
                      height={24} 
                      className="rounded shadow" 
                    />
                    <div className="absolute -right-2 -bottom-2">
                      <Image 
                        src={`/img/flag/${route.flag}.svg`} 
                        alt={route.country} 
                        width={32} 
                        height={24} 
                        className="rounded shadow" 
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {route.country}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{route.description}</p>
                <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm font-medium">
                  Vezi detalii
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Ce poți transporta?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Colete & Pachete', icon: 'colete', desc: 'De orice dimensiune', color: 'text-blue-400', bg: 'bg-blue-500/20' },
              { name: 'Mobilă & Mutări', icon: 'mobila', desc: 'Complete sau parțiale', color: 'text-amber-400', bg: 'bg-amber-500/20' },
              { name: 'Persoane', icon: 'persoane', desc: 'Microbuze confortabile', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
              { name: 'Mașini', icon: 'platforma', desc: 'Pe platformă', color: 'text-purple-400', bg: 'bg-purple-500/20' },
              { name: 'Animale', icon: 'animale', desc: 'Cu acte în regulă', color: 'text-rose-400', bg: 'bg-rose-500/20' },
              { name: 'Documente', icon: 'plicuri', desc: 'Plicuri și acte', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
              { name: 'Electronice', icon: 'electronice', desc: 'Ambalare atentă', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
              { name: 'Paleți', icon: 'paleti', desc: 'Marfă comercială', color: 'text-orange-400', bg: 'bg-orange-500/20' },
            ].map((service, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-5 text-center border border-white/5 hover:border-white/10 transition-all">
                <div className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <ServiceIcon service={service.icon} className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="text-white font-medium text-sm">{service.name}</h3>
                <p className="text-xs text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Cum funcționează?
          </h2>
          <div className="space-y-6">
            {[
              { 
                step: '1', 
                title: 'Postează cererea', 
                desc: 'Descrie ce vrei să trimiți, de unde și unde',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              { 
                step: '2', 
                title: 'Primești oferte', 
                desc: 'Transportatorii verificați îți trimit oferte',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              { 
                step: '3', 
                title: 'Alegi și contactezi', 
                desc: 'Selectează oferta potrivită și stabilești detaliile direct',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-slate-800/30 rounded-xl p-5 border border-white/5">
                <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">PASUL {item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pregătit să găsești transportatori?
          </h2>
          <p className="text-gray-400 mb-8">
            Creează o cerere gratuită și primește oferte în câteva ore.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/comanda"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
            >
              Postează cerere gratuită
            </Link>
            <Link
              href="/cum-functioneaza"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all border border-white/10"
            >
              Află mai multe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
