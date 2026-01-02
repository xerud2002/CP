import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Curierul Perfect',
  description: 'Contactează echipa Curierul Perfect. Suntem aici să te ajutăm cu orice întrebare despre transport colete, persoane sau mobilă în România și Europa.',
  alternates: {
    canonical: 'https://curierulperfect.com/contact',
  },
  openGraph: {
    title: 'Contactează-ne | Curierul Perfect',
    description: 'Ai întrebări? Scrie-ne și îți răspundem rapid. Suport pentru transport România-Europa.',
    url: 'https://curierulperfect.com/contact',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
  twitter: {
    card: 'summary',
    title: 'Contact - Curierul Perfect',
    description: 'Contactează echipa Curierul Perfect pentru întrebări despre transport.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
