import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termeni și Condiții - Curierul Perfect',
  description: 'Termenii și condițiile de utilizare a platformei Curierul Perfect pentru transport România-Europa.',
  alternates: {
    canonical: 'https://curierulperfect.ro/termeni',
  },
  openGraph: {
    title: 'Termeni și Condiții | Curierul Perfect',
    description: 'Citește termenii și condițiile platformei Curierul Perfect.',
    url: 'https://curierulperfect.ro/termeni',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
};

export default function TermeniLayout({ children }: { children: React.ReactNode }) {
  return children;
}
