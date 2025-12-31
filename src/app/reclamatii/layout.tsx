import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reclamații - Curierul Perfect',
  description: 'Depune o reclamație pe platforma Curierul Perfect. Echipa noastră va analiza cazul și îți va răspunde în cel mai scurt timp.',
  alternates: {
    canonical: 'https://curierulperfect.ro/reclamatii',
  },
  openGraph: {
    title: 'Reclamații | Curierul Perfect',
    description: 'Trimite o reclamație și primești răspuns rapid de la echipa noastră.',
    url: 'https://curierulperfect.ro/reclamatii',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
};

export default function ReclamatiiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
