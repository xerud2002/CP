import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

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
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-24">
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
              { name: 'Colete & Pachete', icon: '📦', desc: 'De orice dimensiune' },
              { name: 'Mobilă & Mutări', icon: '🛋️', desc: 'Complete sau parțiale' },
              { name: 'Persoane', icon: '👥', desc: 'Microbuze confortabile' },
              { name: 'Mașini', icon: '🚗', desc: 'Pe platformă' },
              { name: 'Animale', icon: '🐕', desc: 'Cu acte în regulă' },
              { name: 'Documente', icon: '📄', desc: 'Plicuri și acte' },
              { name: 'Electronice', icon: '💻', desc: 'Ambalare atentă' },
              { name: 'Paleți', icon: '📋', desc: 'Marfă comercială' },
            ].map((service, idx) => (
              <div key={idx} className="bg-slate-800/30 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">{service.icon}</span>
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
              { step: '1', title: 'Postează cererea', desc: 'Descrie ce vrei să trimiți, de unde și unde' },
              { step: '2', title: 'Primești oferte', desc: 'Transportatorii verificați îți trimit oferte' },
              { step: '3', title: 'Alegi și contactezi', desc: 'Selectează oferta potrivită și stabilești detaliile direct' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
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
