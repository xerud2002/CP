import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicii Transport | Curierul Perfect',
  description: 'Descoperă toate serviciile de transport oferite: colete, persoane, mobilă, electronice, animale, platformă, tractări și perisabile. Transport sigur România - Europa.',
  alternates: {
    canonical: 'https://curierulperfect.com/servicii',
  },
  openGraph: {
    title: 'Servicii Transport | Curierul Perfect',
    description: 'Descoperă toate serviciile de transport disponibile pe platforma Curierul Perfect.',
    url: 'https://curierulperfect.com/servicii',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Servicii Transport - Curierul Perfect',
    description: 'Transport colete, persoane, mobilă, electronice și animale în toată Europa.',
  },
};

export default function ServiciiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
