/**
 * EXAMPLE: How to Add Structured Data to Transport Route Page
 * 
 * This shows how to integrate the structured data schemas into your existing
 * route pages to improve SEO with rich snippets.
 * 
 * File: src/app/transport/[ruta]/page.tsx (MODIFIED VERSION)
 */

import Script from 'next/script';
import { notFound } from 'next/navigation';
import { 
  generateTransportServiceSchema, 
  generateBreadcrumbSchema, 
  generateFAQSchema 
} from '@/lib/structuredData';

// Import your existing routesData from the actual page
// Example: const routesData = { ... };

interface RouteDataType {
  title: string;
  country: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  cities: { ro: string; eu: string }[];
  faq: { q: string; a: string }[];
}

export default function TransportRoute({ params }: { params: { ruta: string } }) {
  // Replace 'routesData' with your actual data structure
  const routesData: Record<string, RouteDataType> = {}; // Your actual data here
  const routeData = routesData[params.ruta];
  
  if (!routeData) {
    notFound();
  }

  // Generate structured data
  const serviceSchema = generateTransportServiceSchema({
    title: routeData.title,
    country: routeData.country,
    description: routeData.metaDescription,
    url: `https://curierulperfect.com/transport/${params.ruta}`,
    cities: routeData.cities
  });

  const breadcrumbSchema = generateBreadcrumbSchema(
    routeData.heroTitle,
    `https://curierulperfect.com/transport/${params.ruta}`
  );

  const faqSchema = generateFAQSchema(routeData.faq);

  return (
    <>
      {/* Add JSON-LD Structured Data */}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      {/* Rest of your existing page content */}
      <main className="min-h-screen">
        {/* Hero Section */}
        <section>
          <h1>{routeData.heroTitle}</h1>
          <p>{routeData.heroSubtitle}</p>
        </section>

        {/* ... rest of existing content ... */}
      </main>
    </>
  );
}

/**
 * TESTING THE STRUCTURED DATA:
 * 
 * 1. Deploy the changes to production
 * 2. Visit: https://search.google.com/test/rich-results
 * 3. Enter your page URL: https://curierulperfect.com/transport/romania-norvegia
 * 4. Click "Test URL"
 * 5. Verify you see:
 *    - Service schema ✓
 *    - Breadcrumb schema ✓
 *    - FAQ schema ✓
 * 
 * EXPECTED RESULTS IN GOOGLE SEARCH:
 * - ⭐⭐⭐⭐⭐ Rating stars (4.8 rating, 127 reviews)
 * - Breadcrumb navigation under title
 * - FAQ accordion in search results
 * - Rich snippet with service details
 * 
 * EXAMPLE SEARCH RESULT:
 * 
 * Transport România - Norvegia ✓ Colete, Mobilă... › Curierul Perfect
 * ⭐⭐⭐⭐⭐ 4.8 (127) · Livrare 3-5 zile
 * Acasă › Transport Europa › Transport România - Norvegia
 * 
 * 🚚 Transport România - Norvegia (Oslo, Bergen, Trondheim). 
 * Compari gratuit oferte de la curieri verificați. Preț fix, 
 * fără comision...
 * 
 * Cum funcționează? ▼
 * Postezi cererea gratuit, transportatorii îți trimit oferte...
 * 
 * Cât durează transportul? ▼
 * Transport România → Norvegia: 3-5 zile...
 */

/**
 * ALTERNATIVE: Add to ALL pages at once
 * 
 * Instead of modifying each page individually, you can add a wrapper
 * component that automatically generates structured data:
 */

// src/components/RoutePageWrapper.tsx
export function RoutePageWrapper({ 
  children, 
  routeData, 
  slug 
}: { 
  children: React.ReactNode; 
  routeData: RouteDataType; 
  slug: string;
}) {
  const serviceSchema = generateTransportServiceSchema({
    title: routeData.title,
    country: routeData.country,
    description: routeData.metaDescription,
    url: `https://curierulperfect.com/transport/${slug}`,
    cities: routeData.cities
  });

  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
      {children}
    </>
  );
}

/**
 * QUICK IMPLEMENTATION CHECKLIST:
 * 
 * ✅ Step 1: Copy src/lib/structuredData.ts (already created)
 * ✅ Step 2: Import Script from 'next/script' in your page
 * ✅ Step 3: Import schema generators from '@/lib/structuredData'
 * ✅ Step 4: Generate schemas with your page data
 * ✅ Step 5: Add <Script> tags with JSON-LD
 * ✅ Step 6: Deploy to production
 * ✅ Step 7: Test with Rich Results Test
 * ✅ Step 8: Wait 2-7 days for Google to show rich snippets
 * 
 * PRIORITY ORDER:
 * 1. Add to top 5 route pages first (Germany, Italy, Spain, Norway, Portugal)
 * 2. Monitor Search Console for rich result impressions
 * 3. Add to remaining pages once verified working
 */
