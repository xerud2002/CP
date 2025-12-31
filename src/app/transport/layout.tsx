import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transport România - Europa | Curierul Perfect',
  description: 'Găsește transportatori verificați pentru rute între România și Europa. Colete, persoane, mobilă - peste 20 de țări acoperite.',
  alternates: {
    canonical: 'https://curierulperfect.ro/transport',
  },
  openGraph: {
    title: 'Transport România - Europa | Curierul Perfect',
    description: 'Transportatori verificați pentru toate rutele dintre România și Europa.',
    url: 'https://curierulperfect.ro/transport',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Transport România - Europa - Curierul Perfect',
    description: 'Transportatori verificați pentru toate rutele dintre România și Europa.',
  },
};

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
