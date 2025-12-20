import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Client',
  description: 'Gestionează comenzile și profilul tău de client pe Curierul Perfect.',
  robots: { index: false, follow: false }
};

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
