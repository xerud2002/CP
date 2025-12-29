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
  'romania-scotia': {
    country: 'Scoția',
    flag: 'sc',
    title: 'Transport România - Scoția | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Scoția. Edinburgh, Glasgow, Aberdeen. Platformă gratuită.',
    heroTitle: 'Transport România - Scoția',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Scoția',
    intro: 'Scoția, cu peisaje spectaculoase și comunitate românească în creștere, este o destinație importantă. Platforma noastră te conectează cu transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare autoturisme', icon: 'masini' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Acoperire Edinburgh, Glasgow, Aberdeen',
      'Transportatori cu experiență post-Brexit',
      'Recenzii reale de la clienți',
      'Comunicare în română',
      'Tu alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Edinburgh' },
      { ro: 'Cluj-Napoca', eu: 'Glasgow' },
      { ro: 'Timișoara', eu: 'Aberdeen' },
      { ro: 'Iași', eu: 'Dundee' },
      { ro: 'Brașov', eu: 'Inverness' },
      { ro: 'Sibiu', eu: 'Perth' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori verificați, alegi oferta potrivită și stabilești detaliile direct cu transportatorul.' },
      { q: 'Se aplică taxe vamale după Brexit?', a: 'Depinde de tipul și valoarea transportului. Transportatorii te pot consilia când discutați detaliile.' },
      { q: 'Pot transporta bunuri personale?', a: 'Da, poți transporta bunuri personale. Discută cu transportatorul pentru detalii despre documente.' },
    ],
  },
  'romania-tara-galilor': {
    country: 'Țara Galilor',
    flag: 'wls',
    title: 'Transport România - Țara Galilor | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Țara Galilor. Cardiff, Swansea, Newport. Platformă gratuită.',
    heroTitle: 'Transport România - Țara Galilor',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Țara Galilor',
    intro: 'Țara Galilor oferă oportunități excelente pentru români în diferite domenii. Platforma noastră te ajută să găsești transportatori verificați pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete toate dimensiunile', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii cu microbuze', icon: 'persoane' },
      { name: 'Documente', description: 'Transport documente importante', icon: 'documente' },
    ],
    benefits: [
      'Platformă gratuită',
      'Cardiff, Swansea, Newport, Bangor',
      'Comunicare directă cu transportatorul',
      'Transportatori cu experiență',
      'Recenzii reale',
      'Compari oferte gratuit',
    ],
    cities: [
      { ro: 'București', eu: 'Cardiff' },
      { ro: 'Cluj-Napoca', eu: 'Swansea' },
      { ro: 'Timișoara', eu: 'Newport' },
      { ro: 'Iași', eu: 'Wrexham' },
      { ro: 'Brașov', eu: 'Bangor' },
      { ro: 'Constanța', eu: 'Aberystwyth' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi cererea gratuit, transportatorii îți trimit oferte, tu alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Există restricții post-Brexit?', a: 'Da, conform regulamentelor post-Brexit. Transportatorii pot oferi detalii specifice.' },
    ],
  },
  'romania-irlanda-de-nord': {
    country: 'Irlanda de Nord',
    flag: 'nir',
    title: 'Transport România - Irlanda de Nord | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Irlanda de Nord. Belfast, Derry, Newry. Platformă gratuită.',
    heroTitle: 'Transport România - Irlanda de Nord',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Irlanda de Nord',
    intro: 'Irlanda de Nord, parte din Regatul Unit cu statut special post-Brexit, este o destinație în creștere pentru români. Platforma noastră te conectează cu transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Marfă Comercială', description: 'Transport business', icon: 'paleti' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Belfast, Derry, Newry, Lisburn',
      'Transportatori verificați',
      'Suport în limba română',
      'Recenzii reale de la clienți',
      'Compari și alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Belfast' },
      { ro: 'Cluj-Napoca', eu: 'Derry' },
      { ro: 'Timișoara', eu: 'Newry' },
      { ro: 'Iași', eu: 'Lisburn' },
      { ro: 'Brașov', eu: 'Armagh' },
      { ro: 'Craiova', eu: 'Bangor' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi oferta potrivită și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Există particularități pentru Irlanda de Nord?', a: 'Da, datorită Protocolului Irlandei de Nord există reguli specifice. Transportatorii pot oferi detalii.' },
    ],
  },
  'romania-moldova': {
    country: 'Moldova',
    flag: 'md',
    title: 'Transport România - Moldova | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Moldova. Chișinău, Bălți, Cahul. Platformă gratuită.',
    heroTitle: 'Transport România - Moldova',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Moldova',
    intro: 'Moldova, țara vecină cu legături puternice cu România, beneficiază de o rețea extinsă de transport. Platforma noastră te conectează cu transportatori pentru această rută frecventă.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete frecvent', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii zilnice', icon: 'persoane' },
      { name: 'Produse Alimentare', description: 'Transport produse proaspete', icon: 'perisabile' },
    ],
    benefits: [
      'Platformă gratuită',
      'Curse foarte frecvente',
      'Limbă comună - fără bariere',
      'Transportatori verificați',
      'Recenzii reale',
      'Acoperire completă Moldova',
    ],
    cities: [
      { ro: 'București', eu: 'Chișinău' },
      { ro: 'Iași', eu: 'Bălți' },
      { ro: 'Galați', eu: 'Cahul' },
      { ro: 'Bacău', eu: 'Soroca' },
      { ro: 'Brașov', eu: 'Ungheni' },
      { ro: 'Suceava', eu: 'Edineț' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi oferta potrivită și stabilești detaliile direct cu transportatorul.' },
      { q: 'Sunt necesare documente speciale?', a: 'Pentru bunuri personale nu sunt necesare documente speciale la trecerea frontierei România-Moldova. Pentru transport comercial discută cu transportatorul.' },
      { q: 'Cât durează transportul?', a: 'În funcție de rută, între 4-12 ore. Discută cu transportatorul pentru estimări exacte.' },
    ],
  },
  'romania-irlanda': {
    country: 'Irlanda',
    flag: 'ie',
    title: 'Transport România - Irlanda | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Irlanda. Dublin, Cork, Galway. Platformă gratuită.',
    heroTitle: 'Transport România - Irlanda',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Irlanda',
    intro: 'Irlanda continuă să fie o destinație populară pentru români, cu oportunități excelente de muncă. Platforma noastră te conectează cu transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare autoturisme', icon: 'masini' },
    ],
    benefits: [
      'Platformă gratuită',
      'Dublin, Cork, Galway, Limerick',
      'Transportatori cu experiență',
      'Comunicare în română',
      'Recenzii reale',
      'Tu alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Dublin' },
      { ro: 'Cluj-Napoca', eu: 'Cork' },
      { ro: 'Timișoara', eu: 'Galway' },
      { ro: 'Iași', eu: 'Limerick' },
      { ro: 'Brașov', eu: 'Waterford' },
      { ro: 'Constanța', eu: 'Drogheda' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi cererea gratuit, primești oferte, alegi transportatorul și stabilești detaliile direct cu el.' },
      { q: 'Se pot transporta bunuri voluminoase?', a: 'Da, mulți transportatori pot prelua colete mari. Postează cererea cu detalii complete.' },
    ],
  },
  'romania-norvegia': {
    country: 'Norvegia',
    flag: 'no',
    title: 'Transport România - Norvegia | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Norvegia. Oslo, Bergen, Trondheim. Platformă gratuită.',
    heroTitle: 'Transport România - Norvegia',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Norvegia',
    intro: 'Norvegia, cu salariile atractive și peisaje spectaculoase, atrage mulți români. Platforma noastră facilitează găsirea transportatorilor pentru această rută nordică.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii regulate', icon: 'persoane' },
      { name: 'Marfă Specială', description: 'Transport echipamente', icon: 'paleti' },
    ],
    benefits: [
      'Platformă gratuită',
      'Acoperire Oslo, Bergen, Stavanger',
      'Transportatori experimentați pe rute nordice',
      'Suport în română',
      'Recenzii verificate',
      'Compari oferte gratuit',
    ],
    cities: [
      { ro: 'București', eu: 'Oslo' },
      { ro: 'Cluj-Napoca', eu: 'Bergen' },
      { ro: 'Timișoara', eu: 'Trondheim' },
      { ro: 'Iași', eu: 'Stavanger' },
      { ro: 'Brașov', eu: 'Drammen' },
      { ro: 'Constanța', eu: 'Kristiansand' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi cererea gratuit, transportatorii îți trimit oferte, tu alegi și stabilești detaliile direct cu transportatorul.' },
      { q: 'Este transport în sezonul de iarnă?', a: 'Da, transportatorii noștri operează tot anul. Timpii pot varia în funcție de condițiile meteo.' },
    ],
  },
  'romania-suedia': {
    country: 'Suedia',
    flag: 'se',
    title: 'Transport România - Suedia | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Suedia. Stockholm, Göteborg, Malmö. Platformă gratuită.',
    heroTitle: 'Transport România - Suedia',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Suedia',
    intro: 'Suedia oferă oportunități excelente și un stil de viață de calitate pentru români. Platforma noastră te conectează cu transportatori pentru această rută nordică.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Documente', description: 'Transport documente', icon: 'documente' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Stockholm, Göteborg, Malmö',
      'Transportatori cu experiență nordică',
      'Comunicare în română',
      'Recenzii reale de la clienți',
      'Tu alegi transportatorul',
    ],
    cities: [
      { ro: 'București', eu: 'Stockholm' },
      { ro: 'Cluj-Napoca', eu: 'Göteborg' },
      { ro: 'Timișoara', eu: 'Malmö' },
      { ro: 'Iași', eu: 'Uppsala' },
      { ro: 'Brașov', eu: 'Linköping' },
      { ro: 'Constanța', eu: 'Örebro' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Cât durează transportul?', a: 'Depinde de rută și condițiile meteo. În medie 2-4 zile. Discută cu transportatorul pentru estimări.' },
    ],
  },
  'romania-danemarca': {
    country: 'Danemarca',
    flag: 'dk',
    title: 'Transport România - Danemarca | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Danemarca. Copenhaga, Aarhus, Odense. Platformă gratuită.',
    heroTitle: 'Transport România - Danemarca',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Danemarca',
    intro: 'Danemarca, cunoscută pentru calitatea vieții ridicate, atrage tot mai mulți români. Platforma noastră te ajută să găsești transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii regulate', icon: 'persoane' },
      { name: 'Marfă Comercială', description: 'Transport business', icon: 'paleti' },
    ],
    benefits: [
      'Platformă gratuită',
      'Copenhaga, Aarhus, Odense, Aalborg',
      'Transportatori verificați',
      'Suport în română',
      'Recenzii reale',
      'Comunicare directă',
    ],
    cities: [
      { ro: 'București', eu: 'Copenhaga' },
      { ro: 'Cluj-Napoca', eu: 'Aarhus' },
      { ro: 'Timișoara', eu: 'Odense' },
      { ro: 'Iași', eu: 'Aalborg' },
      { ro: 'Brașov', eu: 'Esbjerg' },
      { ro: 'Constanța', eu: 'Randers' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi oferta potrivită și stabilești detaliile direct.' },
      { q: 'Pot transporta mobilă?', a: 'Da, mulți transportatori din platformă sunt specializați în mutări și transport mobilă. Postează cererea cu detalii.' },
    ],
  },
  'romania-finlanda': {
    country: 'Finlanda',
    flag: 'fi',
    title: 'Transport România - Finlanda | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Finlanda. Helsinki, Tampere, Turku. Platformă gratuită.',
    heroTitle: 'Transport România - Finlanda',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Finlanda',
    intro: 'Finlanda, cu sistemul educațional de top și oportunități IT, atrage tot mai mulți români. Platforma noastră facilitează găsirea transportatorilor pentru această rută nordică.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete sigur', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Electronice', description: 'Transport echipamente electronice', icon: 'electronice' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Helsinki, Tampere, Turku, Oulu',
      'Transportatori cu experiență nordică',
      'Recenzii verificate',
      'Suport în română',
      'Tu alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Helsinki' },
      { ro: 'Cluj-Napoca', eu: 'Tampere' },
      { ro: 'Timișoara', eu: 'Turku' },
      { ro: 'Iași', eu: 'Oulu' },
      { ro: 'Brașov', eu: 'Jyväskylä' },
      { ro: 'Constanța', eu: 'Lahti' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori verificați, alegi oferta potrivită și stabilești detaliile.' },
      { q: 'Există transport în iarna nordică?', a: 'Da, transportatorii operează tot anul cu experiență pe rute nordice. Timpii pot varia în funcție de condițiile meteo.' },
    ],
  },
  'romania-grecia': {
    country: 'Grecia',
    flag: 'gr',
    title: 'Transport România - Grecia | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Grecia. Atena, Salonic, Patras. Platformă gratuită.',
    heroTitle: 'Transport România - Grecia',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Grecia',
    intro: 'Grecia, țara vecină cu legături istorice și culturale strânse, este o destinație populară. Platforma noastră te conectează cu transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete frecvent', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii confortabile', icon: 'persoane' },
      { name: 'Marfă', description: 'Transport marfă comercială', icon: 'paleti' },
    ],
    benefits: [
      'Platformă gratuită',
      'Atena, Salonic, insulele grecești',
      'Rută relativ scurtă',
      'Transportatori verificați',
      'Recenzii reale',
      'Comunicare în română',
    ],
    cities: [
      { ro: 'București', eu: 'Atena' },
      { ro: 'Constanța', eu: 'Salonic' },
      { ro: 'Iași', eu: 'Patras' },
      { ro: 'Brașov', eu: 'Heraklion' },
      { ro: 'Cluj-Napoca', eu: 'Larissa' },
      { ro: 'Timișoara', eu: 'Volos' },
    ],
    faq: [
      { q: 'Cum funcționează?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Există transport spre insule?', a: 'Da, unii transportatori pot asigura transport până la porturi pentru insule. Discută detaliile când primești oferte.' },
    ],
  },
  'romania-portugalia': {
    country: 'Portugalia',
    flag: 'pt',
    title: 'Transport România - Portugalia | Colete, Mobilă, Persoane',
    metaDescription: 'Găsește transportatori pentru ruta România - Portugalia. Lisabona, Porto, Braga. Platformă gratuită.',
    heroTitle: 'Transport România - Portugalia',
    heroSubtitle: 'Găsește transportatori pentru ruta România - Portugalia',
    intro: 'Portugalia, cu climă blândă și oportunități în creștere, devine tot mai populară printre români. Platforma noastră te ajută să găsești transportatori pentru această rută.',
    services: [
      { name: 'Colete & Pachete', description: 'Transport colete', icon: 'colete' },
      { name: 'Transport Mobilă', description: 'Găsește transportatori pentru mutări', icon: 'mobila' },
      { name: 'Transport Persoane', description: 'Călătorii pe distanță lungă', icon: 'persoane' },
      { name: 'Transport Auto', description: 'Livrare autoturisme', icon: 'masini' },
    ],
    benefits: [
      'Platformă gratuită de conectare',
      'Lisabona, Porto, Braga, Faro',
      'Transportatori cu experiență pe rute lungi',
      'Comunicare în română',
      'Recenzii reale de la clienți',
      'Tu alegi oferta potrivită',
    ],
    cities: [
      { ro: 'București', eu: 'Lisabona' },
      { ro: 'Cluj-Napoca', eu: 'Porto' },
      { ro: 'Timișoara', eu: 'Braga' },
      { ro: 'Iași', eu: 'Coimbra' },
      { ro: 'Brașov', eu: 'Faro' },
      { ro: 'Constanța', eu: 'Aveiro' },
    ],
    faq: [
      { q: 'Cum funcționează platforma?', a: 'Postezi cererea gratuit, primești oferte de la transportatori, alegi și stabilești detaliile direct cu transportatorul ales.' },
      { q: 'Cât durează transportul?', a: 'Transportul spre Portugalia durează 3-5 zile în funcție de rută. Discută cu transportatorul pentru estimări exacte.' },
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
      <section className="relative bg-linear-to-b from-slate-900 to-slate-950 py-16 sm:py-24">
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
            {data.services.map((service, idx) => {
              const colors = [
                { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'hover:border-blue-500/30' },
                { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'hover:border-amber-500/30' },
                { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
                { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'hover:border-purple-500/30' },
              ];
              const colorScheme = colors[idx % colors.length];
              
              return (
                <div key={idx} className={`bg-slate-800/50 rounded-2xl p-6 border border-white/10 ${colorScheme.border} transition-all group`}>
                  <div className={`w-14 h-14 ${colorScheme.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <ServiceIcon service={service.icon} className={`w-7 h-7 ${colorScheme.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </div>
              );
            })}
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
            {data.benefits.map((benefit, idx) => {
              // Different icons for different benefits
              const icons = [
                // Free/Gratuit
                <svg key="free" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>,
                // Verified/Shield
                <svg key="verified" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>,
                // Chat/Communication
                <svg key="chat" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>,
                // Clock/Fast
                <svg key="clock" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>,
                // Star/Rating
                <svg key="star" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>,
                // Check/Choice
                <svg key="check" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>,
              ];
              const colors = ['text-emerald-400', 'text-blue-400', 'text-purple-400', 'text-orange-400', 'text-yellow-400', 'text-cyan-400'];
              const bgColors = ['bg-emerald-500/20', 'bg-blue-500/20', 'bg-purple-500/20', 'bg-orange-500/20', 'bg-yellow-500/20', 'bg-cyan-500/20'];
              
              return (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className={`w-8 h-8 ${bgColors[idx % bgColors.length]} rounded-lg flex items-center justify-center shrink-0`}>
                    <span className={colors[idx % colors.length]}>{icons[idx % icons.length]}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{benefit}</p>
                </div>
              );
            })}
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
