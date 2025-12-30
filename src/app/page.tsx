'use client';

import dynamic from 'next/dynamic';
import {
  HeroSection,
  HowItWorksSection,
  PlatformVsFacebook,
  ProcessTimeline,
} from '@/components/home';
import { COMPANY_INFO, CONTACT_INFO, SOCIAL_LINKS } from '@/lib/contact';

// Lazy load WhatsApp button - not critical for initial render
const WhatsAppButton = dynamic(() => import('@/components/ui/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

// Structured data for SEO (static - defined outside component)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": COMPANY_INFO.name,
  "url": COMPANY_INFO.url,
  "logo": COMPANY_INFO.logo,
  "description": COMPANY_INFO.description,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": CONTACT_INFO.phone,
    "contactType": "customer service",
    "availableLanguage": ["Romanian", "English"]
  },
  "sameAs": [
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.instagram
  ],
  "areaServed": {
    "@type": "Place",
    "name": COMPANY_INFO.areaServed
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

// WebSite schema with search functionality - enables sitelinks searchbox in Google
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": COMPANY_INFO.name,
  "url": COMPANY_INFO.url,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://curierulperfect.com/comanda?serviciu={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <main className="min-h-screen relative bg-slate-900">
        <HeroSection />
        <PlatformVsFacebook />
        <HowItWorksSection />
        <ProcessTimeline />
        
        {/* Floating Elements */}
        <WhatsAppButton />
      </main>
    </>
  );
}

