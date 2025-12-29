import type { Metadata } from 'next';

const SITE_URL = 'https://curierulperfect.com';
const SITE_NAME = 'Curierul Perfect';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Transport Național și European | Colete, Persoane, Mobilă`,
    template: `%s | ${SITE_NAME}`
  },
  description: 'Platformă de transport național și european: colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări. Servicii rapide și sigure în România și Europa.',
  keywords: [
    'transport național România',
    'transport colete Europa',
    'curier România Europa',
    'transport persoane Europa',
    'transport mobilă Europa',
    'transport național și internațional',
    'livrări naționale',
    'transport electronice',
    'transport animale de companie',
    'platformă auto Europa',
    'tractări auto internaționale',
    'transport plicuri documente',
    'curierat european',
    'trimite colete Germania',
    'trimite colete Anglia',
    'trimite colete Italia',
    'trimite colete Spania',
    'marketplace curierat',
    'transport România',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Transport Național și European`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'transport',
};

// Page-specific metadata generators
export function generatePageMetadata(
  title: string,
  description: string,
  options?: {
    keywords?: string[];
    noIndex?: boolean;
    canonical?: string;
  }
): Metadata {
  return {
    title,
    description,
    keywords: options?.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ro_RO',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: options?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: options?.canonical ? { canonical: options.canonical } : undefined,
  };
}

// Dashboard pages should not be indexed
export const dashboardMetadata = {
  client: {
    title: 'Dashboard Client',
    description: 'Gestionează comenzile și profilul tău de client pe Curierul Perfect.',
  },
  curier: {
    title: 'Dashboard Curier',
    description: 'Gestionează comenzile, serviciile și profilul tău de curier pe Curierul Perfect.',
  },
  admin: {
    title: 'Panou Administrare',
    description: 'Panou de administrare Curierul Perfect.',
  },
};

// Structured data templates
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Platformă curierat european: transport colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Romanian', 'English'],
  },
  sameAs: [
    'https://www.facebook.com/curierulperfect',
    'https://www.instagram.com/curierulperfect',
  ],
  serviceArea: {
    '@type': 'Place',
    name: 'Europa',
  },
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Servicii de curierat și transport',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Europa',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicii de Transport',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport colete' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport plicuri' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport persoane' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport mobilă' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport electronice' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport animale' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Platformă auto' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tractări auto' } },
    ],
  },
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  image: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.4268,
    longitude: 26.1025,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
};
