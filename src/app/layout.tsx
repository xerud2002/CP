import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Curierul Perfect - Transport Complet în Europa | Colete, Plicuri, Persoane, Mobilă",
  description: "Platformă curierat european: transport colete, plicuri, persoane, mobilă, electronice, animale, transfer aeroport, platformă auto și tractări. Servicii rapide și sigure în 16+ țări.",
  keywords: [
    "transport colete Europa",
    "curier România Europa",
    "transport persoane",
    "transport mobilă",
    "transport electronice",
    "transport animale",
    "transfer aeroport",
    "platformă auto",
    "tractări auto",
    "transport plicuri",
    "curierat european",
    "trimite colete Europa",
    "marketplace curierat",
  ],
  openGraph: {
    title: "Curierul Perfect - Transport Complet în Europa",
    description: "Conectează-te cu curieri de încredere pentru transport: colete, plicuri, persoane, mobilă, electronice, animale și mai mult.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(30, 41, 59, 0.95)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
            },
            className: 'sonner-toast',
          }}
        />
      </body>
    </html>
  );
}
