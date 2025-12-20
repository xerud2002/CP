import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administrare',
  description: 'Panou de administrare Curierul Perfect.',
  robots: { index: false, follow: false }
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
