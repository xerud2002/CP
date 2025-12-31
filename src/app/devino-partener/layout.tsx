import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devino Curier Partener - Curierul Perfect',
  description: 'Alătură-te platformei de transport național și european. Zero comisioane, comenzi nelimitate, acces instant. Înregistrare gratuită!',
  alternates: {
    canonical: 'https://curierulperfect.ro/devino-partener',
  },
  openGraph: {
    title: 'Devino Curier Partener | Curierul Perfect',
    description: '100% GRATUIT pentru curieri. Zero comisioane, comenzi nelimitate, contact direct cu clienții.',
    url: 'https://curierulperfect.ro/devino-partener',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Devino Curier Partener - Curierul Perfect',
    description: '100% GRATUIT. Zero comisioane, comenzi nelimitate.',
  },
};

export default function DevinoPartenerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
