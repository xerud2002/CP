/**
 * Structured Data (JSON-LD Schema) Generator for Transport Routes
 * Adds rich snippets to Google Search results
 */

interface RouteData {
  title: string;
  country: string;
  description: string;
  url: string;
  cities: { ro: string; eu: string }[];
}

export function generateTransportServiceSchema(routeData: RouteData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Transport și Curierat Internațional",
    "name": routeData.title,
    "description": routeData.description,
    "url": routeData.url,
    "provider": {
      "@type": "Organization",
      "name": "Curierul Perfect",
      "url": "https://curierulperfect.com",
      "logo": "https://curierulperfect.com/logo.png",
      "sameAs": [
        "https://www.facebook.com/curierulperfect",
        "https://www.instagram.com/curierulperfect"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": ["Romanian", "English"],
        "url": "https://curierulperfect.com/contact"
      }
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "România"
      },
      {
        "@type": "Country",
        "name": routeData.country
      }
    ],
    "serviceOutput": {
      "@type": "Thing",
      "name": `Transport de colete și persoane între România și ${routeData.country}`
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0",
      "description": "Platformă gratuită - comparați oferte și plătiți doar transportatorul ales",
      "availability": "https://schema.org/InStock",
      "url": routeData.url
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "termsOfService": "https://curierulperfect.com/termeni",
    "hasPart": routeData.cities.slice(0, 3).map(city => ({
      "@type": "Service",
      "name": `Transport ${city.ro} - ${city.eu}`,
      "serviceType": "Transport Colete"
    }))
  };
}

export function generateBreadcrumbSchema(routeName: string, routeUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": "https://curierulperfect.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Transport Europa",
        "item": "https://curierulperfect.com/transport"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": routeName,
        "item": routeUrl
      }
    ]
  };
}

export function generateFAQSchema(faqItems: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Curierul Perfect",
    "url": "https://curierulperfect.com",
    "logo": "https://curierulperfect.com/logo.png",
    "description": "Platformă de transport România-Europa. Conectăm clienți cu curieri verificați.",
    "foundingDate": "2025",
    "founder": {
      "@type": "Person",
      "name": "Curierul Perfect Team"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO"
    },
    "sameAs": [
      "https://www.facebook.com/curierulperfect",
      "https://www.instagram.com/curierulperfect"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5"
    }
  };
}
