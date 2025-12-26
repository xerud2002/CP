import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://curierulperfect.ro'),
  title: {
    default: "Curierul Perfect - Transport Național și European | Colete, Persoane, Mobilă",
    template: "%s | Curierul Perfect"
  },
  description: "Platformă de transport național și european: colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări. Servicii rapide și sigure în România și 16+ țări europene. Conectă-te cu curieri verificați.",
  keywords: [
    "transport național România",
    "transport colete Europa",
    "curier România Europa",
    "transport persoane Europa",
    "transport mobilă Europa",
    "transport național și internațional",
    "livrări naționale",
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
    "transport România",
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Curierul Perfect',
  url: 'https://curierulperfect.ro',
  logo: 'https://curierulperfect.ro/logo.png',
  description: 'Platformă curierat european: transport colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Romanian', 'English'],
  },
  sameAs: [
    'https://www.facebook.com/curierulperfect',
    'https://www.instagram.com/curierulperfect',
  ],
  serviceArea: {
    '@type': 'Place',
    name: 'Europa',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicii de Transport',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport colete' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport plicuri' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport persoane' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport mobilă' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport electronice' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transport animale' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Platformă auto' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tractări auto' } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to Firebase for faster auth/db connections */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
