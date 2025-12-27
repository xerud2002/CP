'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

const servicesData: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  benefits: string[];
  routes: { from: string; to: string; price: string }[];
  faq: { q: string; a: string }[];
  color: string;
  borderColor: string;
}> = {
  colete: {
    title: 'Transport Colete România - Europa',
    description: 'Trimite colete rapid și sigur între România și orice țară europeană. Prețuri competitive, curieri verificați.',
    longDescription: 'Serviciul nostru de transport colete conectează România cu toată Europa. Indiferent dacă trimiți pachete mici sau cutii mari, curieri verificați asigură livrarea în siguranță.',
    benefits: [
      'Livrare în 24-72 ore în majoritatea țărilor',
      'Tracking în timp real',
      'Asigurare inclusă până la 500€',
      'Ridicare de la domiciliu',
      'Prețuri transparente, fără costuri ascunse',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 15€' },
      { from: 'România', to: 'Germania', price: 'de la 12€' },
      { from: 'România', to: 'Italia', price: 'de la 10€' },
      { from: 'România', to: 'Spania', price: 'de la 18€' },
    ],
    faq: [
      { q: 'Cât durează livrarea unui colet?', a: 'În funcție de destinație, livrarea durează între 24-72 ore pentru țările europene.' },
      { q: 'Ce dimensiuni poate avea coletul?', a: 'Acceptăm colete de orice dimensiune, de la plicuri până la cutii voluminoase.' },
      { q: 'Este inclus tracking-ul?', a: 'Da, toate coletele au tracking în timp real inclus gratuit.' },
    ],
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
  },
  persoane: {
    title: 'Transport Persoane România - Europa',
    description: 'Transport persoane confortabil și sigur. Curse regulate România-Europa cu șoferi profesioniști.',
    longDescription: 'Călătorește confortabil între România și orice destinație europeană. Oferim transport cu microbuze și autocare moderne, cu șoferi experimentați.',
    benefits: [
      'Microbuze și autocare moderne, climatizate',
      'Șoferi profesioniști cu experiență',
      'Curse zilnice pe rutele populare',
      'WiFi și prize USB la bord',
      'Bagaj generos inclus',
    ],
    routes: [
      { from: 'București', to: 'Londra', price: 'de la 89€' },
      { from: 'Cluj', to: 'München', price: 'de la 59€' },
      { from: 'Iași', to: 'Roma', price: 'de la 69€' },
      { from: 'Timișoara', to: 'Madrid', price: 'de la 99€' },
    ],
    faq: [
      { q: 'Câte kg de bagaj pot lua?', a: 'Fiecare pasager are dreptul la 30kg bagaj inclus în preț.' },
      { q: 'De unde se face îmbarcarea?', a: 'Ridicăm pasagerii de la adresa dorită în majoritatea orașelor.' },
      { q: 'Copiii plătesc bilet întreg?', a: 'Copiii sub 3 ani călătoresc gratuit, iar cei între 3-12 ani au 50% reducere.' },
    ],
    color: 'from-rose-500/20 to-pink-500/20',
    borderColor: 'border-rose-500/30',
  },
  mobila: {
    title: 'Transport Mobilă și Mutări România - Europa',
    description: 'Mutări internaționale complete. Transport mobilă, electrocasnice și bunuri personale în toată Europa.',
    longDescription: 'Serviciu complet de mutări internaționale: ambalare profesională, transport sigur și dezambalare la destinație. Ideal pentru mutări complete sau transport piese mari de mobilier.',
    benefits: [
      'Ambalare profesională inclusă',
      'Echipe experimentate de mutări',
      'Asigurare completă pentru bunuri',
      'Camioane dedicate sau grupaj',
      'Dezambalare și montare la destinație',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 400€' },
      { from: 'România', to: 'Germania', price: 'de la 350€' },
      { from: 'România', to: 'Italia', price: 'de la 300€' },
      { from: 'România', to: 'Franța', price: 'de la 450€' },
    ],
    faq: [
      { q: 'Oferiți servicii de ambalare?', a: 'Da, echipa noastră poate ambala toate bunurile profesional cu materiale de calitate.' },
      { q: 'Cât durează o mutare internațională?', a: 'În funcție de distanță și volum, între 2-7 zile lucrătoare.' },
      { q: 'Ce se întâmplă dacă se strică ceva?', a: 'Toate transporturile sunt asigurate. Despăgubirea se face în maxim 14 zile.' },
    ],
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
  },
  animale: {
    title: 'Transport Animale de Companie România - Europa',
    description: 'Transport specializat pentru animale de companie. Câini, pisici și alte animale călătoresc în siguranță.',
    longDescription: 'Transport autorizat pentru animale de companie în toată Europa. Vehicule special amenajate, cu climat controlat și îngrijire pe tot parcursul călătoriei.',
    benefits: [
      'Vehicule special amenajate pentru animale',
      'Climat controlat (AC/încălzire)',
      'Pauze regulate pentru hrană și apă',
      'Personal instruit în îngrijirea animalelor',
      'Documentație completă pentru transport',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 150€' },
      { from: 'România', to: 'Germania', price: 'de la 100€' },
      { from: 'România', to: 'Italia', price: 'de la 80€' },
      { from: 'România', to: 'Spania', price: 'de la 180€' },
    ],
    faq: [
      { q: 'Ce documente sunt necesare?', a: 'Pașaport european pentru animale, vaccinări la zi și microcip obligatoriu.' },
      { q: 'Pot călători și eu cu animalul?', a: 'Da, oferim și transport combinat pasageri + animale.' },
      { q: 'Cum este monitorizat animalul?', a: 'Primești actualizări foto și video pe tot parcursul călătoriei.' },
    ],
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
  },
  platforma: {
    title: 'Transport Auto pe Platformă România - Europa',
    description: 'Transport mașini și vehicule pe platformă. Siguranță maximă pentru autoturisme, motociclete și utilaje.',
    longDescription: 'Transport profesional de vehicule pe platformă în toată Europa. Ideal pentru mașini de lux, vehicule defecte sau utilaje care nu pot circula pe drumuri publice.',
    benefits: [
      'Platforme moderne, închise sau deschise',
      'Fixare profesională cu chingi certificate',
      'Asigurare completă inclusă',
      'Transport ușă-la-ușă',
      'Documentație vamală completă',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 600€' },
      { from: 'România', to: 'Germania', price: 'de la 450€' },
      { from: 'România', to: 'Italia', price: 'de la 350€' },
      { from: 'România', to: 'Olanda', price: 'de la 550€' },
    ],
    faq: [
      { q: 'Transportați și mașini defecte?', a: 'Da, transportăm vehicule care nu pot circula, inclusiv accidentate.' },
      { q: 'Mașina este asigurată pe durata transportului?', a: 'Da, toate vehiculele sunt asigurate la valoarea declarată.' },
      { q: 'Cât durează transportul?', a: 'În funcție de destinație, între 2-5 zile pentru majoritatea țărilor europene.' },
    ],
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
  },
  tractari: {
    title: 'Tractări Auto și Asistență Rutieră Europa',
    description: 'Servicii de tractare auto și asistență rutieră în toată Europa. Disponibil 24/7 pentru urgențe.',
    longDescription: 'Asistență rutieră și tractări auto oriunde în Europa. Echipe disponibile non-stop pentru pană, accident sau orice problemă tehnică.',
    benefits: [
      'Disponibil 24/7, inclusiv sărbători',
      'Intervenție rapidă (sub 60 min în zone urbane)',
      'Platforme și utilaje pentru orice vehicul',
      'Depanare la fața locului când e posibil',
      'Acoperire în toată Europa',
    ],
    routes: [
      { from: 'Oriunde în', to: 'UK', price: 'de la 200€' },
      { from: 'Oriunde în', to: 'Germania', price: 'de la 150€' },
      { from: 'Oriunde în', to: 'Italia', price: 'de la 120€' },
      { from: 'Oriunde în', to: 'România', price: 'de la 50€' },
    ],
    faq: [
      { q: 'Cât durează până ajunge echipa?', a: 'În zone urbane, sub 60 de minute. În zone rurale, sub 2 ore.' },
      { q: 'Tractați și vehicule grele?', a: 'Da, avem echipamente pentru autoturisme, dube și vehicule până la 3.5t.' },
      { q: 'Ce se întâmplă dacă nu poate fi reparat?', a: 'Transportăm vehiculul la cel mai apropiat service sau la destinația dorită.' },
    ],
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
  },
  electronice: {
    title: 'Transport Electronice și Electrocasnice Europa',
    description: 'Transport sigur pentru TV, electrocasnice și echipamente electronice fragile.',
    longDescription: 'Serviciu specializat pentru transport echipamente electronice și electrocasnice. Ambalare profesională și manipulare cu grijă pentru a preveni deteriorarea.',
    benefits: [
      'Ambalare specială pentru electronice',
      'Manipulare cu grijă extremă',
      'Asigurare completă',
      'Transport climatizat',
      'Verificare la livrare',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 50€' },
      { from: 'România', to: 'Germania', price: 'de la 40€' },
      { from: 'România', to: 'Italia', price: 'de la 35€' },
      { from: 'România', to: 'Spania', price: 'de la 60€' },
    ],
    faq: [
      { q: 'Cum sunt ambalate electronicele?', a: 'Folosim spumă antișoc, folie cu bule și cutii rigide speciale.' },
      { q: 'Ce se întâmplă dacă ajunge stricat?', a: 'Asigurarea acoperă valoarea declarată, despăgubire în maxim 7 zile.' },
      { q: 'Transportați și electronice second-hand?', a: 'Da, transportăm orice echipament electronic, nou sau folosit.' },
    ],
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
  },
  plicuri: {
    title: 'Transport Plicuri și Documente Europa',
    description: 'Curierat rapid pentru documente importante. Livrare expresă în 24-48 ore în toată Europa.',
    longDescription: 'Serviciu de curierat expres pentru documente și plicuri. Ideal pentru acte importante, contracte sau documente care necesită semnătură.',
    benefits: [
      'Livrare expresă în 24-48 ore',
      'Tracking în timp real',
      'Confirmare de primire',
      'Manipulare confidențială',
      'Ridicare de la adresă',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 25€' },
      { from: 'România', to: 'Germania', price: 'de la 20€' },
      { from: 'România', to: 'Italia', price: 'de la 18€' },
      { from: 'România', to: 'Spania', price: 'de la 28€' },
    ],
    faq: [
      { q: 'Cât de repede ajunge un plic?', a: 'Livrare expresă în 24-48 ore pentru majoritatea destinațiilor europene.' },
      { q: 'Primesc confirmare de livrare?', a: 'Da, primești notificare instant când documentul a fost livrat.' },
      { q: 'Este confidențial conținutul?', a: 'Absolut. Nu deschidem și nu inspectăm conținutul plicurilor.' },
    ],
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
  },
  paleti: {
    title: 'Transport Paleți și Marfă Paletizată Europa',
    description: 'Transport marfă paletizată în toată Europa. Soluții flexibile pentru afaceri și particulari.',
    longDescription: 'Serviciu profesional de transport paleți pentru business și persoane fizice. De la un singur palet până la camioane complete.',
    benefits: [
      'Transport de la 1 palet',
      'Camioane complete disponibile',
      'Grupaj economic',
      'Documentație completă',
      'Livrare la rampă sau la sol',
    ],
    routes: [
      { from: 'România', to: 'UK', price: 'de la 80€/palet' },
      { from: 'România', to: 'Germania', price: 'de la 60€/palet' },
      { from: 'România', to: 'Italia', price: 'de la 50€/palet' },
      { from: 'România', to: 'Franța', price: 'de la 70€/palet' },
    ],
    faq: [
      { q: 'Ce dimensiuni are un palet standard?', a: 'Palet EURO: 120x80cm, max 120cm înălțime, max 500kg.' },
      { q: 'Oferiți și ambalare?', a: 'Da, putem paletiză și ambala marfa dacă nu este pregătită.' },
      { q: 'Aveți transport refrigerat?', a: 'Da, pentru mărfuri perisabile avem camioane frigorifice.' },
    ],
    color: 'from-slate-500/20 to-gray-500/20',
    borderColor: 'border-slate-500/30',
  },
};

export default function ServiciuPage() {
  const params = useParams();
  const serviciu = params.serviciu as string;
  
  const data = servicesData[serviciu];
  
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Serviciu negăsit</h1>
          <Link href="/" className="btn-primary">Înapoi acasă</Link>
        </div>
      </div>
    );
  }

  // Structured data for this service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.title,
    "description": data.description,
    "provider": {
      "@type": "Organization",
      "name": "Curierul Perfect",
      "url": "https://curierulperfect.com"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Europa"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": data.title,
      "itemListElement": data.routes.map(route => ({
        "@type": "Offer",
        "name": `${route.from} - ${route.to}`,
        "price": route.price,
        "priceCurrency": "EUR"
      }))
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className={`relative py-16 sm:py-20 px-4 bg-linear-to-br ${data.color}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-slate-800/80 border ${data.borderColor} flex items-center justify-center`}>
                <ServiceIcon service={serviciu} className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Servicii de transport</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{data.title}</h1>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mb-8">{data.longDescription}</p>
            <Link 
              href={`/comanda?serviciu=${serviciu}`} 
              className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2"
            >
              Solicită ofertă
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">De ce să alegi Curierul Perfect?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.benefits.map((benefit, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prices Section */}
        <section className="py-16 px-4 bg-slate-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Prețuri orientative</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.routes.map((route, idx) => (
                <div key={idx} className={`bg-slate-800 border ${data.borderColor} rounded-xl p-5`}>
                  <div className="text-gray-400 text-sm mb-2">{route.from} → {route.to}</div>
                  <div className="text-2xl font-bold text-white">{route.price}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4">* Prețurile sunt orientative și pot varia în funcție de dimensiuni, greutate și urgență.</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Întrebări frecvente</h2>
            <div className="space-y-4">
              {data.faq.map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-linear-to-r from-orange-500/20 to-red-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Gata să plasezi o comandă?</h2>
            <p className="text-gray-300 mb-8">Primești oferte de la curieri verificați în câteva minute.</p>
            <Link 
              href={`/comanda?serviciu=${serviciu}`} 
              className="btn-primary px-8 py-4 text-lg"
            >
              Plasează comandă acum
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}