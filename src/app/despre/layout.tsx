import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre Noi - Curierul Perfect',
  description: 'Află povestea Curierul Perfect - platforma care conectează clienții cu transportatori verificați pentru servicii de transport național și european.',
  alternates: {
    canonical: 'https://curierulperfect.ro/despre',
  },
  openGraph: {
    title: 'Despre Curierul Perfect',
    description: 'Platformă de transport național și european cu transportatori verificați.',
    url: 'https://curierulperfect.ro/despre',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Despre Noi - Curierul Perfect',
    description: 'Platformă de transport național și european cu transportatori verificați.',
  },
};

export default function DespreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
