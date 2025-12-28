'use client';

import dynamic from 'next/dynamic';
import {
  HeroSection,
  HowItWorksSection,
  BenefitsSection,
  PlatformVsFacebook,
  ProcessTimeline,
  BecomeCourierCTA,
  TrustCoverage,
} from '@/components/home';

// Lazy load WhatsApp button - not critical for initial render
const WhatsAppButton = dynamic(() => import('@/components/ui/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

// Structured data for SEO (static - defined outside component)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Curierul Perfect",
  "url": "https://curierulperfect.com",
  "logo": "https://curierulperfect.com/logo.png",
  "description": "Curierul Perfect - Platformă de transport și curierat în România și Europa. Servicii de transport colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări. Compară oferte, alege curierul potrivit și primește livrări rapide și sigure.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+40-XXX-XXX-XXX",
    "contactType": "customer service",
    "availableLanguage": ["Romanian", "English"]
  },
  "sameAs": [
    "https://www.facebook.com/curierulperfect",
    "https://www.instagram.com/curierulperfect"
  ],
  "areaServed": {
    "@type": "Place",
    "name": "Europa"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicii de Transport",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport colete" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport plicuri" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport persoane" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport mobilă" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport electronice" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport animale" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transport cu platformă" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tractări auto" } }
    ]
  }
};

export default function Home() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen relative bg-slate-900">
        <HeroSection />
        <PlatformVsFacebook />
        <HowItWorksSection />
        <BenefitsSection />
        <ProcessTimeline />
        <BecomeCourierCTA />
        <TrustCoverage />
        
        {/* Floating Elements */}
        <WhatsAppButton />
      </main>
    </>
  );
}

