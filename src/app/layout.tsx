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
  metadataBase: new URL('https://curierulperfect.ro'),
  title: {
    default: "Curierul Perfect - Transport Complet în Europa | Colete, Persoane, Mobilă",
    template: "%s | Curierul Perfect"
  },
  description: "Platformă curierat european: transport colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări. Servicii rapide și sigure în 16+ țări europene. Conectează-te cu curieri verificați.",
  keywords: [
    "transport colete Europa",
    "curier România Europa",
    "transport persoane Europa",
    "transport mobilă Europa",
    "transport electronice",
    "transport animale de companie",
    "platformă auto Europa",
    "tractări auto internaționale",
    "transport plicuri documente",
    "curierat european",
    "trimite colete Germania",
    "trimite colete Anglia",
    "trimite colete Italia",
    "trimite colete Spania",
    "marketplace curierat",
    "transport diaspora",
  ],
  authors: [{ name: "Curierul Perfect" }],
  creator: "Curierul Perfect",
  publisher: "Curierul Perfect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Curierul Perfect - Transport Complet în Europa",
    description: "Conectează-te cu curieri de încredere pentru transport: colete, plicuri, persoane, mobilă, electronice, animale și mai mult. Servicii în 16+ țări europene.",
    type: "website",
    locale: "ro_RO",
    url: "https://curierulperfect.ro",
    siteName: "Curierul Perfect",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Curierul Perfect - Transport European",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curierul Perfect - Transport Complet în Europa",
    description: "Platformă curierat european: transport colete, plicuri, persoane, mobilă, electronice, animale și mai mult.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://curierulperfect.ro",
  },
  category: "transport",
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
