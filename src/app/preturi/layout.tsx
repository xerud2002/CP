import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cum Funcționează Prețurile - Curierul Perfect',
  description: 'Află cum se calculează prețurile pentru transport colete, mobilă, persoane și animale România-Europa. Zero comisioane pentru clienți!',
  alternates: {
    canonical: 'https://curierulperfect.com/preturi',
  },
  openGraph: {
    title: 'Cum Funcționează Prețurile | Curierul Perfect',
    description: '100% GRATUIT pentru clienți. Compară oferte de la curieri verificați. Zero comisioane!',
    url: 'https://curierulperfect.com/preturi',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Prețuri Transport - Curierul Perfect',
    description: 'Zero comisioane pentru clienți. Compară oferte gratuit.',
  },
};

export default function PreturiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
