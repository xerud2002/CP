import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Curier',
  description: 'Gestionează comenzile, serviciile și profilul tău de curier pe Curierul Perfect.',
  robots: { index: false, follow: false }
};

export default function CourierDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
