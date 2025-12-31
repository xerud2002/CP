import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GDPR - Curierul Perfect',
  description: 'Informații GDPR și drepturile tale privind protecția datelor personale pe platforma Curierul Perfect.',
  alternates: {
    canonical: 'https://curierulperfect.ro/gdpr',
  },
  openGraph: {
    title: 'GDPR | Curierul Perfect',
    description: 'Drepturile tale GDPR pe platforma Curierul Perfect.',
    url: 'https://curierulperfect.ro/gdpr',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
};

export default function GDPRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
