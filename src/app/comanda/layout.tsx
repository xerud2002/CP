import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comandă Transport | Curierul Perfect',
  description: 'Creează o comandă de transport pentru colete, plicuri, persoane sau alte servicii. Transport rapid și sigur în Europa cu curieri verificați.',
  keywords: 'comandă transport, transport colete, transport plicuri, transport persoane, transport Europa, comandă curier',
  openGraph: {
    title: 'Comandă Transport | Curierul Perfect',
    description: 'Creează o comandă de transport pentru colete, plicuri, persoane sau alte servicii în Europa.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://curierulperfect.com/comanda',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function ComandaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
