import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Întrebări Frecvente (FAQ) | Curierul Perfect',
  description: 'Răspunsuri la cele mai frecvente întrebări despre transportul coletelor, persoanelor și mobilei între România și Europa pe platforma Curierul Perfect.',
  alternates: {
    canonical: 'https://curierulperfect.ro/faq',
  },
  openGraph: {
    title: 'Întrebări Frecvente (FAQ) | Curierul Perfect',
    description: 'Răspunsuri la cele mai frecvente întrebări despre serviciile de transport.',
    url: 'https://curierulperfect.ro/faq',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'FAQ - Curierul Perfect',
    description: 'Răspunsuri la întrebările frecvente despre transport România-Europa.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
