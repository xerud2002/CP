import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Întrebări Frecvente (FAQ) - Curierul Perfect',
  description: 'Găsește răspunsuri la cele mai comune întrebări despre transport colete, persoane, mobilă și animale între România și Europa. Aflați despre prețuri, siguranță și proces.',
  alternates: {
    canonical: 'https://curierulperfect.com/faq',
  },
};

// FAQ data for both display and structured data
const faqs = [
  {
    category: 'Despre platformă',
    questions: [
      { 
        q: 'Ce este Curierul Perfect și cum funcționează?', 
        a: 'Curierul Perfect este o platformă marketplace care conectează clienți cu transportatori verificați pentru servicii de curierat și transport în România și Europa. Funcționăm similar cu Uber sau Airbnb, dar pentru transport: tu postezi cererea (colete, mobilă, persoane, etc.), transportatorii verificați îți trimit oferte competitive, tu compari prețuri și recenzii, apoi alegi oferta potrivită.' 
      },
      { 
        q: 'Cât costă să folosesc platforma?', 
        a: 'Platforma este 100% gratuită pentru clienți. Nu percepem niciun comision, taxă de listare sau costuri ascunse. Plătești doar prețul negociat direct cu transportatorul ales.' 
      },
      { 
        q: 'În ce țări activați și ce rute acoperiți?', 
        a: 'Acoperim 20 țări din Europa: România, Anglia, Scoția, Țara Galilor, Irlanda de Nord, Germania, Franța, Italia, Spania, Belgia, Olanda, Austria, Portugalia, Grecia, Irlanda, Moldova, Danemarca, Suedia, Norvegia și Finlanda. Transportatorii noștri operează pe peste 200 rute internaționale regulate.' 
      },
      { 
        q: 'Care e diferența față de curierii tradiționali?', 
        a: 'Spre deosebire de curierii mari care au tarife fixe și proceduri rigide, Curierul Perfect îți oferă: prețuri competitive prin licitație, flexibilitate maximă în negociere, servicii personalizate pentru colete nestandard, transparență totală cu recenzii și evaluări, și suport pentru rute mai puțin comune.' 
      },
      {
        q: 'Este sigur să folosesc transportatori independenți?',
        a: 'Da. Siguranța ta este prioritatea noastră. Fiecare transportator trece prin verificare riguroasă în 3 etape: verificare identitate (CI/pașaport), verificare vehicul (asigurare RCA/CMR, ITP), și verificare licențe de transport de la ARR. Sistemul nostru de recenzii permite comunitatea să elimine natural transportatorii neserioși.'
      }
    ]
  },
  {
    category: 'Comenzi și transport',
    questions: [
      { 
        q: 'Cum plasez o comandă?', 
        a: 'Procesul e simplu în 6 pași: intri pe "Plasează comandă", completezi formularul cu detaliile transportului, creezi cont sau te loghezi, postezi cererea, primești oferte în 2-48 ore, compari ofertele și alegi transportatorul preferat. Total durează 3-5 minute să completezi formularul.' 
      },
      { 
        q: 'Cât durează până primesc oferte?', 
        a: 'Primul răspuns vine de obicei în 2-6 ore pe rutele populare (București-Germania/UK/Italia) și în 12-48 ore pe rutele mai rare. Pe rute foarte solicitate poți primi 5-10 oferte.' 
      },
      { 
        q: 'Pot anula sau modifica o comandă?', 
        a: 'Da. Înainte de a confirma un transportator - anulare/modificare 100% gratuită oricând. După confirmare dar înainte de ridicare - discuți direct cu transportatorul. După ridicare - anularea nu mai e posibilă, dar poți redirecționa coletul dacă transportatorul acceptă.' 
      },
      { 
        q: 'Ce se întâmplă dacă coletul se pierde sau e deteriorat?', 
        a: 'Avem sistem de protecție: toți transportatorii au asigurare CMR care acoperă deteriorări/pierderi. La reclamație, investigăm dovezile în max 48 ore și în funcție de vină, curierul compensează pierderea conform asigurării CMR (max 8.33 DST/kg pentru transport internațional).' 
      },
      { 
        q: 'Pot urmări coletul în timp real?', 
        a: 'Depinde de transportator - circa 60% din transportatorii noștri oferă tracking GPS live prin platformă sau aplicații externe. În profilul fiecărui transportator vezi dacă oferă "Tracking GPS" ca feature.' 
      }
    ]
  },
  {
    category: 'Prețuri și plată',
    questions: [
      { 
        q: 'Cum se stabilesc prețurile?', 
        a: 'Prețurile variază bazat pe: distanță (tarif/km scade la distanțe mari), volum/greutate, urgență (transport rapid costă mai mult), și sezon. Transportatorii concurează pentru comanda ta, ceea ce asigură prețuri competitive.' 
      },
      { 
        q: 'Există costuri ascunse?', 
        a: 'Curierul Perfect NU adaugă niciun comision sau taxă pe tranzacție - plătești exact suma negociată cu transportatorul. Pot apărea costuri suplimentare pentru cerințe speciale neprecizate inițial sau taxe vamale la transport în UK/Norvegia.' 
      },
      { 
        q: 'Cum și când plătesc transportatorul?', 
        a: 'Metoda de plată o negociezi direct cu transportatorul în chat. Opțiuni comune: cash la ridicare (40% cazuri), cash la livrare (30% cazuri), transfer bancar 50% avans + 50% la livrare (20% cazuri), sau transfer bancar 100% anticipat pentru transportatori cu rating excelent.' 
      }
    ]
  },
  {
    category: 'Curieri și siguranță',
    questions: [
      { 
        q: 'Cum sunt verificați curierii din platformă?', 
        a: 'Proces de verificare în 4 etape: verificare identitate (CI/pașaport, cazier fiscal), verificare vehicul (RCA, ITP, certificat înmatriculare), licențe și autorizații (licență ARR, asigurare CMR), și monitorizare continuă prin sistem de recenzii și rating.' 
      },
      { 
        q: 'Ce înseamnă badge-urile din profilul transportatorilor?', 
        a: 'Badge-urile ajută la identificare: ✓ VERIFICAT (a trecut verificarea), ⭐ TOP CURIER (rating 4.8+ și >50 comenzi), 🛡️ ASIGURARE EXTINSĂ (asigurare CMR peste minim), 🚛 FIRMĂ VERIFICATĂ (emite facturi), ⚡ RĂSPUNS RAPID (<2 ore), 📍 TRACKING GPS (urmărire live).' 
      },
      { 
        q: 'Ce fac dacă am probleme cu un transport?', 
        a: 'Protocol în 3 niveluri: comunicare directă prin chat în primele 24 ore, escaladare la Suport dacă nu se rezolvă (investigație în max 12 ore), și reclamație oficială pentru cazuri grave (investigație 5-7 zile, posibilă compensație financiară).' 
      }
    ]
  },
  {
    category: 'Servicii speciale',
    questions: [
      {
        q: 'Cum funcționează transportul de animale de companie?',
        a: 'Transport animale necesită: pașaport european pentru animale, vaccin antirabic valabil, cip electronic, și transportatori cu autorizație ANSVSA. Vehiculele sunt adaptate cu cuști de siguranță, aerisire și temperatură controlată. Transport câine/pisică România-Germania: 150-300 EUR.'
      },
      {
        q: 'Oferiti transport refrigerat?',
        a: 'Da, avem transportatori cu vehicule frigorifice pentru produse alimentare, medicamente și flori. Costul este +30-50% față de transport standard. Transportatori cu badge "🧊 Transport refrigerat" au certificări sanitare ANSVSA valide.'
      },
      {
        q: 'Pot trimite bunuri foarte grele sau supradimensionate?',
        a: 'Da, pentru bunuri industriale avem transportatori specializați: paleți standard (EUR 120x80cm, max 500kg), bunuri supradimensionate cu vehicule speciale (platformă, macara). Grupaj palet România-Germania: 150-400 RON.'
      }
    ]
  }
];

// Generate FAQPage structured data
function generateFAQSchema() {
  const allQuestions = faqs.flatMap(section => 
    section.questions.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions
  };
}

// Generate BreadcrumbList structured data
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Acasă',
      item: 'https://curierulperfect.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Întrebări Frecvente',
      item: 'https://curierulperfect.com/faq'
    }
  ]
};

export default function FAQPage() {
  const faqSchema = generateFAQSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="min-h-screen bg-slate-900">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-4xl mx-auto px-4 pt-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-orange-400 transition-colors">Acasă</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">Întrebări Frecvente</span>
            </li>
          </ol>
        </nav>

        <section className="py-16 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Întrebări <span className="text-gradient">Frecvente</span>
            </h1>
            <p className="text-xl text-gray-300">
              Găsește răspunsuri rapide la cele mai comune întrebări despre Curierul Perfect
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-white mb-6">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((item, qIdx) => (
                    <details key={qIdx} className="card group">
                      <summary className="p-6 cursor-pointer flex justify-between items-center">
                        <span className="font-semibold text-white">{item.q}</span>
                        <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-6 border-t border-white/5 pt-4 text-gray-300 leading-relaxed">{item.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Nu ai găsit răspunsul?</h2>
            <p className="text-gray-300 mb-8">Echipa noastră de suport e aici să te ajute!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-3">Contactează-ne</Link>
              <a href="https://wa.me/447880312621" target="_blank" rel="noopener noreferrer" className="btn-secondary px-8 py-3 inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
