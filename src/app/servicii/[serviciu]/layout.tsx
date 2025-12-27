import { Metadata } from 'next';

const servicesMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  colete: {
    title: 'Transport Colete România - Europa | Curierul Perfect',
    description: 'Trimite colete rapid și sigur între România și UK, Germania, Italia, Spania. Prețuri de la 10€, curieri verificați, tracking în timp real. Livrare în 24-72h.',
    keywords: ['transport colete romania', 'trimite colete uk', 'curier romania germania', 'transport colete europa', 'colete romania anglia'],
  },
  persoane: {
    title: 'Transport Persoane România - Europa | Curse Zilnice',
    description: 'Transport persoane România-Europa. Curse zilnice către UK, Germania, Italia. Microbuze moderne, WiFi, bagaj 30kg inclus. De la 59€.',
    keywords: ['transport persoane romania', 'curse romania anglia', 'transport persoane germania', 'microbuz romania uk', 'curse romania italia'],
  },
  mobila: {
    title: 'Transport Mobilă și Mutări Internaționale România - Europa',
    description: 'Mutări complete România-Europa. Transport mobilă, electrocasnice, ambalare profesională. Asigurare inclusă. De la 300€.',
    keywords: ['mutari internationale', 'transport mobila romania', 'mutari romania anglia', 'transport mobilier europa', 'mutari romania germania'],
  },
  animale: {
    title: 'Transport Animale de Companie România - Europa',
    description: 'Transport autorizat animale de companie. Vehicule climatizate, îngrijire pe drum. Transport câini și pisici în UK, Germania. De la 80€.',
    keywords: ['transport animale romania', 'transport caini uk', 'transport pisici europa', 'transport animale companie', 'curier animale'],
  },
  platforma: {
    title: 'Transport Auto pe Platformă România - Europa',
    description: 'Transport mașini pe platformă în toată Europa. Vehicule de lux, defecte sau utilaje. Asigurare completă. De la 350€.',
    keywords: ['transport auto platforma', 'transport masini europa', 'platforma auto romania', 'transport vehicule', 'transport auto uk'],
  },
  tractari: {
    title: 'Tractări Auto și Asistență Rutieră Europa | 24/7',
    description: 'Tractări auto și asistență rutieră 24/7 în toată Europa. Intervenție rapidă, depanare la fața locului. De la 50€.',
    keywords: ['tractari auto', 'asistenta rutiera europa', 'tractari romania', 'depanare auto', 'tractari 24/7'],
  },
  electronice: {
    title: 'Transport Electronice și Electrocasnice România - Europa',
    description: 'Transport sigur TV, electrocasnice, echipamente IT. Ambalare profesională, asigurare. România-Europa de la 35€.',
    keywords: ['transport electronice', 'transport electrocasnice', 'transport tv europa', 'curier electronice', 'transport it'],
  },
  plicuri: {
    title: 'Transport Plicuri și Documente Expres România - Europa',
    description: 'Curierat expres documente în 24-48h. Confirmare livrare, tracking. România-Europa de la 18€.',
    keywords: ['curierat documente', 'transport plicuri', 'curier expres', 'transport documente europa', 'curierat rapid'],
  },
  paleti: {
    title: 'Transport Paleți și Marfă Paletizată România - Europa',
    description: 'Transport paleți de la 1 palet la camioane complete. Grupaj economic, documentație completă. De la 50€/palet.',
    keywords: ['transport paleti', 'transport marfa paletizata', 'grupaj romania', 'transport paleti europa', 'logistica'],
  },
};

type Props = {
  params: Promise<{ serviciu: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviciu } = await params;
  const meta = servicesMetadata[serviciu];
  
  if (!meta) {
    return {
      title: 'Serviciu negăsit | Curierul Perfect',
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: 'ro_RO',
      url: `https://curierulperfect.com/servicii/${serviciu}`,
      siteName: 'Curierul Perfect',
    },
    alternates: {
      canonical: `https://curierulperfect.com/servicii/${serviciu}`,
    },
  };
}

export function generateStaticParams() {
  return [
    { serviciu: 'colete' },
    { serviciu: 'persoane' },
    { serviciu: 'mobila' },
    { serviciu: 'animale' },
    { serviciu: 'platforma' },
    { serviciu: 'tractari' },
    { serviciu: 'electronice' },
    { serviciu: 'plicuri' },
    { serviciu: 'paleti' },
  ];
}

export default function ServiciiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}