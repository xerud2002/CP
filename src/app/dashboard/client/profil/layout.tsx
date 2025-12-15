import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil Client | Curierul Perfect',
  description: 'Gestionează profilul tău de client. Actualizează datele personale, adresa și informațiile companiei pentru o experiență optimizată de transport.',
  keywords: 'profil client, date personale, actualizare profil, transport colete',
  openGraph: {
    title: 'Profil Client | Curierul Perfect',
    description: 'Gestionează profilul tău de client. Actualizează datele personale, adresa și informațiile companiei.',
  }
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
