import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentificare - Curierul Perfect | Transport Europa",
  description: "Autentificare Curierul Perfect - Marketplace curierat european pentru transport colete, plicuri, persoane, mobilă, electronice, animale, transfer aeroport, platformă și tractări auto în toată Europa.",
  keywords: [
    "autentificare curier",
    "login transport",
    "transport colete Europa",
    "transport persoane",
    "transport mobilă",
    "transfer aeroport",
    "platformă auto",
    "tractări auto",
    "curier România Europa",
    "trimite colete Europa",
    "transport electronice",
    "transport animale",
  ],
  openGraph: {
    title: "Autentificare - Curierul Perfect",
    description: "Transport complet în Europa: colete, plicuri, persoane, mobilă, electronice, animale, aeroport, platformă și tractări auto.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
