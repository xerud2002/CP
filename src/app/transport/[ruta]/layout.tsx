import type { Metadata } from 'next';

// Route metadata for SEO
const routesMeta: Record<string, { title: string; description: string }> = {
  'romania-germania': {
    title: 'Transport România - Germania | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Germania rapid și sigur. Trimite colete, mobilă sau călătorește cu curieri verificați. Prețuri de la 12€. Livrare 24-48h.',
  },
  'romania-italia': {
    title: 'Transport România - Italia | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Italia rapid și ieftin. Colete, mobilă, persoane. Curse zilnice, curieri verificați. Prețuri de la 10€.',
  },
  'romania-spania': {
    title: 'Transport România - Spania | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Spania sigur și rapid. Colete, mobilă, persoane. Curse regulate, prețuri de la 18€. Curieri verificați.',
  },
  'romania-franta': {
    title: 'Transport România - Franța | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Franța rapid. Colete, mobilă, persoane. Curse regulate Paris, Lyon, Marseille. Prețuri de la 15€.',
  },
  'romania-uk': {
    title: 'Transport România - UK (Anglia) | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România UK (Anglia) rapid și sigur. Colete, mobilă, persoane. Londra, Manchester, Birmingham. Prețuri de la 15€.',
  },
  'romania-austria': {
    title: 'Transport România - Austria | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Austria rapid. Colete, mobilă, persoane. Viena, Graz, Salzburg. Prețuri de la 12€. Livrare 24-48h.',
  },
  'romania-belgia': {
    title: 'Transport România - Belgia | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Belgia sigur. Colete, mobilă, persoane. Bruxelles, Antwerp, Gent. Prețuri de la 14€.',
  },
  'romania-olanda': {
    title: 'Transport România - Olanda | Colete, Mobilă, Persoane | Curierul Perfect',
    description: 'Transport România Olanda rapid. Colete, mobilă, persoane. Amsterdam, Rotterdam, Haga. Prețuri de la 14€.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ ruta: string }> }): Promise<Metadata> {
  const { ruta } = await params;
  const meta = routesMeta[ruta];
  
  if (!meta) {
    return {
      title: 'Transport România - Europa | Curierul Perfect',
      description: 'Transport colete, mobilă și persoane între România și Europa. Curieri verificați, prețuri transparente.',
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: 'ro_RO',
      siteName: 'Curierul Perfect',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://curierulperfect.ro/transport/${ruta}`,
    },
  };
}

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
