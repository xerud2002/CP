import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre Noi - Curierul Perfect',
  description: 'Află povestea Curierul Perfect - platforma care conectează românii din diaspora cu transportatori verificați pentru servicii de curierat în toată Europa.',
  alternates: {
    canonical: 'https://curierulperfect.ro/despre',
  },
  openGraph: {
    title: 'Despre Curierul Perfect',
    description: 'Platforma #1 de transport pentru comunitatea românească din diaspora.',
    url: 'https://curierulperfect.ro/despre',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Despre Noi - Curierul Perfect',
    description: 'Platforma de transport pentru comunitatea românească din diaspora.',
  },
};

export default function DespreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
