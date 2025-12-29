import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cum Funcționează | Curierul Perfect',
  description: 'Află cum funcționează Curierul Perfect în 5 pași simpli. Postezi cererea gratuit, primești oferte de la transportatori verificați și alegi cel mai bun preț.',
  openGraph: {
    title: 'Cum Funcționează Curierul Perfect',
    description: 'Transport România-Europa în 5 pași simpli. Postezi gratuit, primești oferte, alegi transportatorul. Fără comisioane!',
    type: 'website',
    locale: 'ro_RO',
    url: 'https://curierulperfect.com/cum-functioneaza',
    siteName: 'Curierul Perfect',
    images: [
      {
        url: '/og/cum-functioneaza.png',
        width: 1200,
        height: 630,
        alt: 'Curierul Perfect - Cum Funcționează',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cum Funcționează Curierul Perfect',
    description: 'Transport România-Europa în 5 pași simpli. Postezi gratuit, primești oferte, alegi transportatorul.',
    images: ['/og/cum-functioneaza.png'],
  },
  alternates: {
    canonical: 'https://curierulperfect.com/cum-functioneaza',
  },
};

export default function CumFunctioneazaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
