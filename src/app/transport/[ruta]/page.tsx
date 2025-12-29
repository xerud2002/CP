import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import type { Metadata } from 'next';

// Route data for SEO pages
const routesData: Record<string, {
  country: string;
  flag: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  services: { name: string; description: string; icon: string }[];
  benefits: string[];
  cities: { ro: string; eu: string }[];
  faq: { q: string; a: string }[];
}> = {
  'romania-germania': {
    country: 'Germania',
    flag: 'de',
    title: 'Transport România - Germania | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori verificați pentru colete, mobilă sau călătorii între România și Germania. Platformă gratuită de conectare.',
    heroTitle: 'Transport România - Germania',
    heroSubtitle: 'Conectăm clienți cu transportatori pe ruta România - Germania',
    intro: 'Germania este una dintre cele mai populare destinații pentru transportul din România. Platforma Curierul Perfect te ajută să găsești transportatori verificați care operează pe această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Găsește transportatori pentru colete de orice dimensiune', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Conectare cu transportatori pentru mutări și mobilier', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Găsește curse cu microbuze spre Germania', icon: 'persoane' },
      { name: 'Mașini & Auto', description: 'Transport autoturisme pe platformă', icon: 'masini' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Transportatori verificați cu recenzii reale',
      'Comunicare directă cu transportatorul',
      'Postezi cererea în 2 minute',
      'Primești oferte de la mai mulți curieri',
      'Tu alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Berlin' },
      { ro: 'Cluj-Napoca', eu: 'München' },
      { ro: 'Timișoara', eu: 'Frankfurt' },
      { ro: 'Iași', eu: 'Hamburg' },
      { ro: 'Brașov', eu: 'Köln' },
      { ro: 'Constanța', eu: 'Stuttgart' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi gratuit cererea ta, transportatorii verificați îți trimit oferte, iar tu alegi oferta potrivită și stabilești detaliile direct cu transportatorul.' },
      { q: 'Ce documente sunt necesare?', a: 'Pentru colete personale nu sunt necesare documente speciale. Pentru transport comercial, discută cu transportatorul despre eventuale cerințe.' },
      { q: 'Pot găsi transportatori pentru mobilă?', a: 'Da, mulți transportatori din platforma noastră sunt specializați în mutări și transport mobilă.' },
      { q: 'Cum aleg transportatorul potrivit?', a: 'Poți vedea recenziile și rating-ul fiecărui transportator înainte să alegi. Comunici direct cu ei pentru detalii.' },
    ],
  },
  'romania-italia': {
    country: 'Italia',
    flag: 'it',
    title: 'Transport România - Italia | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Italia. Colete, mobilă, persoane. Platformă gratuită de conectare.',
    heroTitle: 'Transport România - Italia',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Italia',
    intro: 'Italia găzduiește una dintre cele mai mari comunități românești din Europa. Platforma noastră te conectează cu transportatori verificați care operează între cele două țări.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete de toate dimensiunile', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Curse cu microbuze', icon: 'persoane' },
      { name: 'Animale de Companie', description: 'Transport animale cu acte în regulă', icon: 'animale' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Acoperire completă Italia',
      'Comunicare directă cu transportatorul',
      'Recenzii reale de la clienți',
      'Postare cerere în 2 minute',
      'Compari oferte și alegi',
    ],
    cities: [
      { ro: 'București', eu: 'Roma' },
      { ro: 'Cluj-Napoca', eu: 'Milano' },
      { ro: 'Timișoara', eu: 'Torino' },
      { ro: 'Iași', eu: 'Bologna' },
      { ro: 'Craiova', eu: 'Napoli' },
      { ro: 'Sibiu', eu: 'Firenze' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi oferta potrivită și stabilești detaliile direct cu transportatorul.' },
      { q: 'Există transportatori spre sudul Italiei?', a: 'Da, avem transportatori care acoperă toată Italia, inclusiv Napoli, Bari, Sicilia și Sardinia.' },
      { q: 'Pot trimite alimente?', a: 'Da, poți trimite produse alimentare ambalate. Discută cu transportatorul pentru detalii.' },
    ],
  },
  'romania-spania': {
    country: 'Spania',
    flag: 'es',
    title: 'Transport România - Spania | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Spania. Madrid, Barcelona, Valencia. Platformă gratuită de conectare.',
    heroTitle: 'Transport România - Spania',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Spania',
    intro: 'Spania este o destinație populară pentru românii din Europa de Vest. Platforma noastră te ajută să găsești transportatori de încredere pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete în toată Spania', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Curse spre Spania', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare autoturisme pe platformă', icon: 'masini' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Acoperire: Madrid, Barcelona, Valencia',
      'Transportatori cu experiență pe rută',
      'Suport în limba română',
      'Postare rapidă a cererii',
      'Tu alegi transportatorul',
    ],
    cities: [
      { ro: 'București', eu: 'Madrid' },
      { ro: 'Cluj-Napoca', eu: 'Barcelona' },
      { ro: 'Timișoara', eu: 'Valencia' },
      { ro: 'Iași', eu: 'Sevilla' },
      { ro: 'Brașov', eu: 'Malaga' },
      { ro: 'Oradea', eu: 'Zaragoza' },
    ],
    faq: [
      { q: 'Cum folosesc platforma?', a: 'Postezi cererea gratuit, transportatorii îți trimit oferte, tu alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Pot transporta mașina în Spania?', a: 'Da, avem transportatori specializați în livrare autoturisme. Postează cererea și vei primi oferte.' },
      { q: 'Este transport spre Canare?', a: 'Transportul spre Canare este disponibil. Postează cererea pentru a vedea disponibilitatea.' },
    ],
  },
  'romania-franta': {
    country: 'Franța',
    flag: 'fr',
    title: 'Transport România - Franța | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Franța. Paris, Lyon, Marseille. Platformă gratuită.',
    heroTitle: 'Transport România - Franța',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Franța',
    intro: 'Franța atrage tot mai mulți români pentru muncă și studii. Platforma noastră facilitează găsirea transportatorilor pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii cu microbuze', icon: 'persoane' },
      { name: 'Documente & Plicuri', description: 'Transport documente', icon: 'documente' },
    ],
    benefits: [
      'Platformă gratuită - postezi gratuit',
      'Transportatori spre principalele orașe',
      'Recenzii reale de la clienți',
      'Curieri vorbitori de română',
      'Comunicare directă',
      'Compari oferte gratuit',
    ],
    cities: [
      { ro: 'București', eu: 'Paris' },
      { ro: 'Cluj-Napoca', eu: 'Lyon' },
      { ro: 'Timișoara', eu: 'Marseille' },
      { ro: 'Iași', eu: 'Toulouse' },
      { ro: 'Constanța', eu: 'Nice' },
      { ro: 'Brașov', eu: 'Strasbourg' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi cererea gratuit, primești oferte, alegi transportatorul potrivit și stabilești detaliile direct cu el.' },
      { q: 'Pot trimite documente oficiale?', a: 'Da, mulți transportatori oferă servicii pentru documente importante. Discută detaliile când primești oferte.' },
    ],
  },
  'romania-uk': {
    country: 'Marea Britanie',
    flag: 'gb',
    title: 'Transport România - UK | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - UK. Londra, Manchester, Birmingham. Platformă gratuită.',
    heroTitle: 'Transport România - Marea Britanie',
    heroSubtitle: 'Găsește transportatori pentru ruta România - UK',
    intro: 'Marea Britanie rămâne o destinație importantă pentru românii din diaspora. Platforma noastră te conectează cu transportatori cu experiență post-Brexit.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete toate dimensiunile', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii cu microbuze', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare mașini pe platformă', icon: 'masini' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Transportatori cu experiență post-Brexit',
      'Acoperire completă UK',
      'Recenzii reale',
      'Comunicare directă',
      'Tu alegi transportatorul',
    ],
    cities: [
      { ro: 'București', eu: 'Londra' },
      { ro: 'Cluj-Napoca', eu: 'Manchester' },
      { ro: 'Timișoara', eu: 'Birmingham' },
      { ro: 'Iași', eu: 'Leeds' },
      { ro: 'Brașov', eu: 'Glasgow' },
      { ro: 'Constanța', eu: 'Edinburgh' },
    ],
    faq: [
      { q: 'Se aplică taxe vamale după Brexit?', a: 'Depinde de tipul și valoarea transportului. Transportatorii te pot consilia când discutați detaliile.' },
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, transportatorii îți trimit oferte. Tu alegi și stabilești detaliile direct cu transportatorul.' },
    ],
  },
  'romania-austria': {
    country: 'Austria',
    flag: 'at',
    title: 'Transport România - Austria | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Austria. Viena, Graz, Salzburg. Platformă gratuită.',
    heroTitle: 'Transport România - Austria',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Austria',
    intro: 'Austria, cu Viena la doar câteva ore de România, este o destinație foarte accesibilă. Platforma noastră te ajută să găsești transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii frecvente', icon: 'persoane' },
      { name: 'Transport Marfă', description: 'Marfă comercială', icon: 'paleti' },
    ],
    benefits: [
      'Platformă gratuită',
      'Distanță scurtă - mulți transportatori',
      'Recenzii reale',
      'Comunicare directă',
      'Acoperire completă Austria',
      'Tu alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Viena' },
      { ro: 'Timișoara', eu: 'Graz' },
      { ro: 'Cluj-Napoca', eu: 'Salzburg' },
      { ro: 'Oradea', eu: 'Linz' },
      { ro: 'Arad', eu: 'Innsbruck' },
      { ro: 'Sibiu', eu: 'Klagenfurt' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi gratuit cererea, primești oferte de la transportatori, alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Pot trimite colete voluminoase?', a: 'Da, postează cererea cu detalii și vei primi oferte de la transportatori care pot prelua.' },
    ],
  },
  'romania-belgia': {
    country: 'Belgia',
    flag: 'be',
    title: 'Transport România - Belgia | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Belgia. Bruxelles, Antwerp, Gent. Platformă gratuită.',
    heroTitle: 'Transport România - Belgia',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Belgia',
    intro: 'Belgia, cu comunitatea românească în creștere, devine o destinație tot mai solicitată. Platforma noastră te conectează cu transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Documente', description: 'Transport documente', icon: 'documente' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Acoperire: Bruxelles, Antwerp, Gent',
      'Comunicare în română',
      'Recenzii reale',
      'Postare rapidă a cererii',
      'Tu alegi transportatorul',
    ],
    cities: [
      { ro: 'București', eu: 'Bruxelles' },
      { ro: 'Cluj-Napoca', eu: 'Antwerp' },
      { ro: 'Timișoara', eu: 'Gent' },
      { ro: 'Iași', eu: 'Liège' },
      { ro: 'Brașov', eu: 'Bruges' },
      { ro: 'Constanța', eu: 'Charleroi' },
    ],
    faq: [
      { q: 'Există transport spre partea flamandă?', a: 'Da, transportatorii noștri acoperă atât Belgia flamandă cât și valonă, inclusiv Bruxelles.' },
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte, alegi transportatorul și stabilești detaliile direct cu el.' },
    ],
  },
  'romania-olanda': {
    country: 'Olanda',
    flag: 'nl',
    title: 'Transport România - Olanda | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Olanda. Amsterdam, Rotterdam, Haga. Platformă gratuită.',
    heroTitle: 'Transport România - Olanda',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Olanda',
    intro: 'Olanda atrage tot mai mulți români datorită oportunităților economice. Platforma noastră facilitează găsirea transportatorilor pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii regulate', icon: 'persoane' },
      { name: 'Marfă Comercială', description: 'Transport business', icon: 'paleti' },
    ],
    benefits: [
      'Platformă gratuită',
      'Amsterdam, Rotterdam, Haga, Utrecht',
      'Transportatori experimentați',
      'Suport în română',
      'Recenzii reale',
      'Compari oferte gratuit',
    ],
    cities: [
      { ro: 'București', eu: 'Amsterdam' },
      { ro: 'Cluj-Napoca', eu: 'Rotterdam' },
      { ro: 'Timișoara', eu: 'Haga' },
      { ro: 'Iași', eu: 'Utrecht' },
      { ro: 'Brașov', eu: 'Eindhoven' },
      { ro: 'Oradea', eu: 'Groningen' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi gratuit cererea ta, transportatorii îți trimit oferte, tu alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Există restricții pentru produse?', a: 'Respectăm regulamentele UE. Produse interzise: substanțe periculoase, arme, droguri.' },
    ],
  },
};

// Export for reuse in sitemap
export const transportRoutes = Object.keys(routesData);

// Generate static params for all routes
export function generateStaticParams() {
  return transportRoutes.map((ruta) => ({ ruta }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ ruta: string }> }): Promise<Metadata> {
  const { ruta } = await params;
  const data = routesData[ruta];
  
  if (!data) {
    return {
      title: 'Transport România - Europa | Curierul Perfect',
      description: 'Găsește transportatori verificați între România și Europa. Platformă gratuită de conectare.',
    };
  }

  return {
    title: data.title + ' | Curierul Perfect',
    description: data.metaDescription,
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      type: 'website',
      locale: 'ro_RO',
      siteName: 'Curierul Perfect',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.metaDescription,
    },
    alternates: {
      canonical: `https://curierulperfect.com/transport/${ruta}`,
    },
  };
}

export default async function TransportRoutePage({ params }: { params: Promise<{ ruta: string }> }) {
  const { ruta } = await params;
  const data = routesData[ruta];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image src="/img/flag/ro.svg" alt="România" width={48} height={36} className="rounded shadow-lg" />
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <Image src={`/img/flag/${data.flag}.svg`} alt={data.country} width={48} height={36} className="rounded shadow-lg" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              {data.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {data.heroSubtitle}
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
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            {data.intro}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Servicii disponibile pe ruta România - {data.country}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.services.map((service, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <ServiceIcon service={service.icon} className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            De ce să alegi Curierul Perfect?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-12 sm:py-16 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Rute populare România - {data.country}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.cities.map((route, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Image src="/img/flag/ro.svg" alt="RO" width={24} height={18} className="rounded" />
                  <span className="text-white font-medium">{route.ro}</span>
                </div>
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{route.eu}</span>
                  <Image src={`/img/flag/${data.flag}.svg`} alt={data.country} width={24} height={18} className="rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Întrebări frecvente
          </h2>
          <div className="space-y-4">
            {data.faq.map((item, idx) => (
              <details key={idx} className="group bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <h3 className="text-white font-medium pr-4">{item.q}</h3>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pregătit să găsești transportatori pentru {data.country}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Postează cererea ta gratuit și primește oferte de la transportatori verificați.
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
              Cum funcționează?
            </Link>
          </div>
        </div>
      </section>

      {/* Other Routes */}
      <section className="py-12 sm:py-16 bg-slate-900/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Alte rute populare din România
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Object.entries(routesData)
              .filter(([key]) => key !== ruta)
              .map(([key, route]) => (
                <Link
                  key={key}
                  href={`/transport/${key}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-white/10 transition-all"
                >
                  <Image src={`/img/flag/${route.flag}.svg`} alt={route.country} width={20} height={15} className="rounded" />
                  <span className="text-sm text-gray-300">{route.country}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
