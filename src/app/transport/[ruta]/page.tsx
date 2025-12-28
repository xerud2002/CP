'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

// Route data for SEO pages
const routesData: Record<string, {
  country: string;
  flag: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  services: { name: string; description: string; price: string; icon: string }[];
  benefits: string[];
  cities: { ro: string; eu: string }[];
  faq: { q: string; a: string }[];
  stats: { value: string; label: string }[];
}> = {
  'romania-germania': {
    country: 'Germania',
    flag: 'DE',
    title: 'Transport România - Germania | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Germania rapid și sigur. Trimite colete, mobilă sau călătorește cu curieri verificați. Prețuri de la 12€. Livrare 24-48h.',
    heroTitle: 'Transport România - Germania',
    heroSubtitle: 'Cea mai rapidă legătură între România și Germania',
    intro: 'Germania este una dintre cele mai populare destinații pentru transportul din România, cu mii de colete și pasageri care circulă zilnic între cele două țări. Platforma Curierul Perfect îți oferă acces la zeci de transportatori verificați care operează curse regulate pe această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Trimite colete de orice dimensiune, de la plicuri la cutii mari', price: 'de la 12€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări complete sau piese individuale de mobilier', price: 'de la 50€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorește confortabil cu microbuze moderne', price: 'de la 59€', icon: 'persoane' },
      { name: 'Mașini & Auto', description: 'Transport autoturisme pe platformă sau tractare', price: 'de la 350€', icon: 'masini' },
    ],
    benefits: [
      'Curse zilnice pe ruta România - Germania',
      'Livrare în 24-48 ore pentru colete',
      'Curieri verificați cu recenzii reale',
      'Tracking în timp real',
      'Asigurare inclusă pentru marfă',
      'Plată securizată prin platformă',
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
      { q: 'Cât durează transportul unui colet România-Germania?', a: 'În medie, coletele ajung în Germania în 24-48 de ore, în funcție de orașul de destinație și tipul de serviciu ales.' },
      { q: 'Ce documente sunt necesare pentru transport?', a: 'Pentru colete personale nu sunt necesare documente speciale. Pentru transport comercial, poate fi necesară o factură pro-forma.' },
      { q: 'Pot trimite mobilă din România în Germania?', a: 'Da, avem transportatori specializați în mutări și transport mobilă. Prețul se calculează în funcție de volum (m³).' },
      { q: 'Este sigur să trimit colete valoroase?', a: 'Toți transportatorii noștri sunt verificați și oferim asigurare inclusă. Poți opta și pentru asigurare suplimentară.' },
      { q: 'Cum pot urmări coletul meu?', a: 'Primești un cod de tracking și poți comunica direct cu curierul prin platformă pentru actualizări în timp real.' },
    ],
    stats: [
      { value: '24-48h', label: 'Timp livrare' },
      { value: '50+', label: 'Curse/săptămână' },
      { value: '12€', label: 'Preț minim colet' },
      { value: '4.8★', label: 'Rating mediu' },
    ],
  },
  'romania-italia': {
    country: 'Italia',
    flag: 'IT',
    title: 'Transport România - Italia | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Italia rapid și ieftin. Colete, mobilă, persoane. Curse zilnice, curieri verificați. Prețuri de la 10€.',
    heroTitle: 'Transport România - Italia',
    heroSubtitle: 'Conexiunea rapidă între România și Italia',
    intro: 'Italia găzduiește una dintre cele mai mari comunități românești din Europa, cu peste un milion de români. Curierul Perfect conectează zilnic familii și afaceri între cele două țări, oferind transport sigur și accesibil.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete de toate dimensiunile', price: 'de la 10€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări și transport piese mobilier', price: 'de la 45€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile cu microbuze', price: 'de la 49€', icon: 'persoane' },
      { name: 'Animale de Companie', description: 'Transport animale cu acte în regulă', price: 'de la 80€', icon: 'animale' },
    ],
    benefits: [
      'Curse zilnice România - Italia',
      'Acoperire completă: Nord, Centru, Sud Italia',
      'Livrare la domiciliu în 24-72h',
      'Comunicare directă cu transportatorul',
      'Prețuri negociabile pentru volume mari',
      'Opțiuni express disponibile',
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
      { q: 'Cât costă să trimit un colet în Italia?', a: 'Prețurile încep de la 10€ pentru colete mici. Prețul final depinde de greutate, dimensiuni și orașul de destinație.' },
      { q: 'Există curse și spre sudul Italiei?', a: 'Da, avem transportatori care acoperă toată Italia, inclusiv Napoli, Bari, Sicilia și Sardinia.' },
      { q: 'Pot trimite alimente în Italia?', a: 'Da, poți trimite produse alimentare ambalate. Produsele perisabile necesită transport frigorific special.' },
      { q: 'Cât durează o cursă de persoane România-Italia?', a: 'Călătoria durează în medie 18-24 ore, cu pauze incluse, în funcție de destinația finală.' },
    ],
    stats: [
      { value: '24-72h', label: 'Timp livrare' },
      { value: '70+', label: 'Curse/săptămână' },
      { value: '10€', label: 'Preț minim colet' },
      { value: '4.9★', label: 'Rating mediu' },
    ],
  },
  'romania-spania': {
    country: 'Spania',
    flag: 'ES',
    title: 'Transport România - Spania | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Spania sigur și rapid. Colete, mobilă, persoane. Curse regulate, prețuri de la 18€. Curieri verificați.',
    heroTitle: 'Transport România - Spania',
    heroSubtitle: 'Transport de încredere între România și Spania',
    intro: 'Spania este a doua destinație ca popularitate pentru românii din Europa de Vest. Cu sute de mii de români stabiliți în Madrid, Barcelona și alte orașe, nevoia de transport fiabil este constantă. Curierul Perfect îți oferă acces la transportatori de încredere.',
    services: [
      { name: 'Colete & Pachete', description: 'Trimite colete rapid în toată Spania', price: 'de la 18€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări complete sau parțiale', price: 'de la 55€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorește confortabil spre Spania', price: 'de la 79€', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare autoturisme pe platformă', price: 'de la 450€', icon: 'masini' },
    ],
    benefits: [
      'Curse săptămânale regulate',
      'Acoperire: Madrid, Barcelona, Valencia, Sevilla',
      'Livrare în 48-72h',
      'Prețuri competitive pentru distanța lungă',
      'Transportatori cu experiență pe rută',
      'Suport în limba română',
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
      { q: 'Cât durează transportul România-Spania?', a: 'Coletele ajung în 48-72 ore. Pentru transport persoane, călătoria durează aproximativ 28-36 ore.' },
      { q: 'Pot trimite mașina în Spania?', a: 'Da, avem transportatori specializați care livrează autoturisme pe platformă în toată Spania.' },
      { q: 'Există transport spre Insulele Canare?', a: 'Transportul spre Canare este disponibil cu o escală în peninsula iberică. Timpul de livrare este mai mare.' },
      { q: 'Ce se întâmplă dacă coletul meu este urgent?', a: 'Oferim opțiuni express cu livrare prioritară. Contactează-ne pentru detalii și prețuri.' },
    ],
    stats: [
      { value: '48-72h', label: 'Timp livrare' },
      { value: '30+', label: 'Curse/săptămână' },
      { value: '18€', label: 'Preț minim colet' },
      { value: '4.7★', label: 'Rating mediu' },
    ],
  },
  'romania-franta': {
    country: 'Franța',
    flag: 'FR',
    title: 'Transport România - Franța | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Franța rapid. Colete, mobilă, persoane. Curse regulate Paris, Lyon, Marseille. Prețuri de la 15€.',
    heroTitle: 'Transport România - Franța',
    heroSubtitle: 'Legătura directă între România și Franța',
    intro: 'Franța atrage tot mai mulți români pentru muncă și studii. Curierul Perfect facilitează transportul între cele două țări cu curse regulate spre Paris, Lyon, Marseille și alte orașe importante.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur și rapid', price: 'de la 15€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări și transport volum mare', price: 'de la 52€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii cu microbuze confortabile', price: 'de la 69€', icon: 'persoane' },
      { name: 'Documente & Plicuri', description: 'Transport rapid documente oficiale', price: 'de la 8€', icon: 'documente' },
    ],
    benefits: [
      'Curse regulate spre principalele orașe',
      'Livrare în 36-60h',
      'Posibilitate transport express',
      'Curieri vorbitori de română',
      'Ridicare de la adresă',
      'Notificări SMS la livrare',
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
      { q: 'Există transport direct București-Paris?', a: 'Da, avem curse directe săptămânale București-Paris cu opriri în orașele de pe traseu.' },
      { q: 'Pot trimite documente oficiale?', a: 'Da, oferim transport securizat pentru documente importante cu confirmare de primire.' },
      { q: 'Care este greutatea maximă pentru un colet?', a: 'Acceptăm colete până la 50kg per unitate. Pentru greutăți mai mari, contactează-ne pentru soluții.' },
      { q: 'Cum plătesc transportul?', a: 'Plata se face securizat prin platformă - card, transfer bancar sau numerar la ridicare.' },
    ],
    stats: [
      { value: '36-60h', label: 'Timp livrare' },
      { value: '25+', label: 'Curse/săptămână' },
      { value: '15€', label: 'Preț minim colet' },
      { value: '4.8★', label: 'Rating mediu' },
    ],
  },
  'romania-uk': {
    country: 'Marea Britanie',
    flag: 'GB',
    title: 'Transport România - UK | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România UK (Anglia) rapid și sigur. Colete, mobilă, persoane. Londra, Manchester, Birmingham. Prețuri de la 15€.',
    heroTitle: 'Transport România - Marea Britanie',
    heroSubtitle: 'Conectăm România cu Regatul Unit',
    intro: 'Marea Britanie rămâne o destinație importantă pentru românii din diaspora. În ciuda Brexit-ului, transportul continuă fără probleme. Curierul Perfect oferă curse regulate spre Londra, Manchester, Birmingham și alte orașe.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete toate dimensiunile', price: 'de la 15€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări complete sau parțiale', price: 'de la 60€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii cu microbuze moderne', price: 'de la 89€', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare mașini pe platformă', price: 'de la 500€', icon: 'masini' },
    ],
    benefits: [
      'Curse săptămânale regulate',
      'Traversare Eurotunnel sau ferry',
      'Livrare în 48-72h',
      'Asistență cu formalitățile vamale',
      'Acoperire completă UK',
      'Experiență post-Brexit',
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
      { q: 'Se aplică taxe vamale după Brexit?', a: 'Pentru colete personale până la o anumită valoare, nu se aplică taxe. Transportatorii noștri vă pot consilia.' },
      { q: 'Cât durează transportul spre UK?', a: 'În medie 48-72 ore, incluzând traversarea Canalului Mânecii.' },
      { q: 'Pot călători cu animalul de companie?', a: 'Da, dar este nevoie de pașaport pentru animale și vaccinuri la zi. Verifică cerințele UK actualizate.' },
      { q: 'Este mai scump transportul spre UK acum?', a: 'Prețurile au rămas relativ stabile. Curierul Perfect oferă prețuri competitive.' },
    ],
    stats: [
      { value: '48-72h', label: 'Timp livrare' },
      { value: '40+', label: 'Curse/săptămână' },
      { value: '15€', label: 'Preț minim colet' },
      { value: '4.8★', label: 'Rating mediu' },
    ],
  },
  'romania-austria': {
    country: 'Austria',
    flag: 'AT',
    title: 'Transport România - Austria | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Austria rapid. Colete, mobilă, persoane. Viena, Graz, Salzburg. Prețuri de la 12€. Livrare 24-48h.',
    heroTitle: 'Transport România - Austria',
    heroSubtitle: 'Transport rapid între România și Austria',
    intro: 'Austria, cu capitala Viena la doar câteva ore de România, este o destinație foarte accesibilă. Curierul Perfect oferă transport frecvent și rapid pe această rută scurtă.',
    services: [
      { name: 'Colete & Pachete', description: 'Livrare rapidă colete', price: 'de la 12€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări rapide și sigure', price: 'de la 45€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii frecvente', price: 'de la 45€', icon: 'persoane' },
      { name: 'Transport Marfă', description: 'Paleți și marfă comercială', price: 'la cerere', icon: 'paleti' },
    ],
    benefits: [
      'Distanță scurtă - livrare rapidă',
      'Curse foarte frecvente',
      'Livrare în 24-48h',
      'Prețuri accesibile',
      'Ideal pentru colete urgente',
      'Acoperire completă Austria',
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
      { q: 'Cât de rapid ajunge un colet în Austria?', a: 'Datorită distanței scurte, coletele ajung în 24-48 ore, uneori chiar în aceeași zi.' },
      { q: 'Există transport zilnic spre Viena?', a: 'Da, avem curse zilnice pe ruta România-Viena datorită cererii mari.' },
      { q: 'Pot trimite colete voluminoase?', a: 'Da, acceptăm colete de orice dimensiune. Pentru volume mari, prețul se calculează per m³.' },
      { q: 'Se face livrare la domiciliu în Austria?', a: 'Da, toți transportatorii noștri oferă livrare door-to-door.' },
    ],
    stats: [
      { value: '24-48h', label: 'Timp livrare' },
      { value: '60+', label: 'Curse/săptămână' },
      { value: '12€', label: 'Preț minim colet' },
      { value: '4.9★', label: 'Rating mediu' },
    ],
  },
  'romania-belgia': {
    country: 'Belgia',
    flag: 'BE',
    title: 'Transport România - Belgia | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Belgia sigur. Colete, mobilă, persoane. Bruxelles, Antwerp, Gent. Prețuri de la 14€.',
    heroTitle: 'Transport România - Belgia',
    heroSubtitle: 'Conexiune directă România - Belgia',
    intro: 'Belgia, cu comunitatea românească în creștere, devine o destinație tot mai solicitată. Curierul Perfect asigură transport regulat spre Bruxelles, Antwerp și alte orașe belgiene.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', price: 'de la 14€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări și mobilier', price: 'de la 50€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', price: 'de la 65€', icon: 'persoane' },
      { name: 'Documente', description: 'Transport documente rapid', price: 'de la 10€', icon: 'documente' },
    ],
    benefits: [
      'Curse regulate săptămânale',
      'Livrare în 36-60h',
      'Acoperire: Bruxelles, Antwerp, Gent, Liège',
      'Prețuri competitive',
      'Comunicare în română',
      'Tracking disponibil',
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
      { q: 'Există transport și spre partea flamandă?', a: 'Da, acoperim atât Belgia flamandă cât și valonă, inclusiv Bruxelles.' },
      { q: 'Cât durează un transport România-Belgia?', a: 'În medie 36-60 ore pentru colete, 24-30 ore pentru transport persoane.' },
      { q: 'Pot trimite cadouri de sărbători?', a: 'Desigur, multe colete conțin produse tradiționale românești. Asigură-te că sunt ambalate corect.' },
    ],
    stats: [
      { value: '36-60h', label: 'Timp livrare' },
      { value: '20+', label: 'Curse/săptămână' },
      { value: '14€', label: 'Preț minim colet' },
      { value: '4.7★', label: 'Rating mediu' },
    ],
  },
  'romania-olanda': {
    country: 'Olanda',
    flag: 'NL',
    title: 'Transport România - Olanda | Colete, Mobilă, Persoane',
    metaDescription: 'Transport România Olanda rapid. Colete, mobilă, persoane. Amsterdam, Rotterdam, Haga. Prețuri de la 14€.',
    heroTitle: 'Transport România - Olanda',
    heroSubtitle: 'Transport de încredere spre Țările de Jos',
    intro: 'Olanda atrage tot mai mulți români datorită oportunităților economice. Curierul Perfect facilitează transportul rapid și sigur între România și principalele orașe olandeze.',
    services: [
      { name: 'Colete & Pachete', description: 'Livrare colete rapid', price: 'de la 14€', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Mutări și transport mobilier', price: 'de la 50€/m³', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii regulate', price: 'de la 69€', icon: 'persoane' },
      { name: 'Marfă Comercială', description: 'Transport business', price: 'la cerere', icon: 'paleti' },
    ],
    benefits: [
      'Curse regulate spre Olanda',
      'Livrare în 40-65h',
      'Amsterdam, Rotterdam, Haga, Utrecht',
      'Transportatori experimentați',
      'Suport clienți în română',
      'Opțiuni express disponibile',
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
      { q: 'Cât costă transportul spre Amsterdam?', a: 'Prețurile pentru colete încep de la 14€. Pentru volume mari sau mobilă, prețul se calculează individual.' },
      { q: 'Există restricții pentru anumite produse?', a: 'Respectăm regulamentele UE. Produse interzise: substanțe periculoase, arme, droguri.' },
      { q: 'Pot programa o ridicare de la domiciliu?', a: 'Da, majoritatea transportatorilor oferă ridicare de la adresă la ora convenită.' },
    ],
    stats: [
      { value: '40-65h', label: 'Timp livrare' },
      { value: '18+', label: 'Curse/săptămână' },
      { value: '14€', label: 'Preț minim colet' },
      { value: '4.8★', label: 'Rating mediu' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(routesData).map((ruta) => ({ ruta }));
}

export default function TransportRoutePage() {
  const params = useParams();
  const ruta = params.ruta as string;
  const data = routesData[ruta];

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Rută negăsită</h1>
          <Link href="/" className="text-orange-400 hover:text-orange-300">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-5" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image src="/img/flag/RO.svg" alt="România" width={48} height={36} className="rounded shadow-lg" />
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
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-400">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/comanda"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
            >
              Solicită ofertă gratuită
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
                <p className="text-sm text-gray-400 mb-4">{service.description}</p>
                <p className="text-orange-400 font-semibold">{service.price}</p>
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
                  <Image src="/img/flag/RO.svg" alt="RO" width={24} height={18} className="rounded" />
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
            Pregătit să trimiți un colet în {data.country}?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Postează cererea ta gratuit și primește oferte de la transportatori verificați în câteva minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/comanda"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
            >
              Creează comandă gratuită
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
