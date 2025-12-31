import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate - Curierul Perfect',
  description: 'Politica de confidențialitate și protecția datelor personale pe platforma Curierul Perfect.',
  alternates: {
    canonical: 'https://curierulperfect.ro/confidentialitate',
  },
  openGraph: {
    title: 'Politica de Confidențialitate | Curierul Perfect',
    description: 'Cum protejăm datele tale personale pe platforma Curierul Perfect.',
    url: 'https://curierulperfect.ro/confidentialitate',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
};

export default function ConfidentialitateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
