import { MetadataRoute } from 'next';
import { serviceTypes } from '@/lib/constants';
import { transportRoutes } from './transport/[ruta]/page';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://curierulperfect.com';
  const lastModified = new Date();
  
  // Main pages - highest priority
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/comanda`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];

  // Service landing pages - derived from constants for single source of truth
  // Priority based on service popularity
  const servicePriorities: Record<string, number> = {
    colete: 0.9,
    persoane: 0.9,
    mobila: 0.85,
    animale: 0.85,
    platforma: 0.8,
    tractari: 0.8,
    electronice: 0.8,
    plicuri: 0.8,
    paleti: 0.75,
  };

  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/servicii`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...serviceTypes.map(service => ({
      url: `${baseUrl}/servicii/${service.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: servicePriorities[service.id] || 0.75,
    })),
  ];

  // Transport route pages - derived from transportRoutes export for single source of truth
  // Priority based on diaspora population size and route popularity
  const routePriorities: Record<string, number> = {
    'romania-italia': 0.9,      // Largest Romanian diaspora
    'romania-germania': 0.9,    // Second largest diaspora
    'romania-anglia': 0.85,     // Major destination, post-Brexit complexity
    'romania-spania': 0.85,     // Large diaspora
    'romania-austria': 0.8,     // Proximity, frequent routes
    'romania-belgia': 0.8,
    'romania-olanda': 0.8,
    'romania-irlanda': 0.8,     // Growing diaspora
    'romania-moldova': 0.8,     // Neighboring country, very frequent
    'romania-grecia': 0.75,     // Neighboring country
    'romania-portugalia': 0.75,
    'romania-scotia': 0.7,
    'romania-tara-galilor': 0.7,
    'romania-irlanda-de-nord': 0.7,
    'romania-norvegia': 0.7,
    'romania-suedia': 0.7,
    'romania-danemarca': 0.7,
    'romania-finlanda': 0.65,   // Furthest Nordic destination
  };

  const routePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/transport`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...transportRoutes.map(route => ({
      url: `${baseUrl}/transport/${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: routePriorities[route] || 0.7,
    })),
  ];

  // Static informational pages - important for user trust and SEO
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/cum-functioneaza`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/devino-partener`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/despre`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/preturi`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.65,
    },
  ];

  // Legal/compliance pages - lower priority but necessary for trust
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/termeni`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/confidentialitate`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/gdpr`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/reclamatii`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...mainPages, ...servicePages, ...routePages, ...staticPages, ...legalPages];
}
