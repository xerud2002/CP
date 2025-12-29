import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://curierulperfect.com';
  const lastModified = new Date();
  
  // Main pages
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
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Service landing pages - important for SEO
  const services = [
    { slug: 'colete', priority: 0.9 },
    { slug: 'plicuri', priority: 0.8 },
    { slug: 'persoane', priority: 0.9 },
    { slug: 'mobila', priority: 0.85 },
    { slug: 'electronice', priority: 0.8 },
    { slug: 'animale', priority: 0.85 },
    { slug: 'platforma', priority: 0.8 },
    { slug: 'tractari', priority: 0.8 },
    { slug: 'paleti', priority: 0.75 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map(service => ({
    url: `${baseUrl}/servicii/${service.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: service.priority,
  }));

  // Route pages for popular corridors
  const popularRoutes = [
    'romania-uk',
    'romania-germania',
    'romania-italia',
    'romania-spania',
    'romania-franta',
    'romania-belgia',
    'romania-olanda',
    'romania-austria',
  ];

  const routePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/transport`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...popularRoutes.map(route => ({
      url: `${baseUrl}/transport/${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  // Static pages - important for user trust and SEO
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/despre`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
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
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/devino-partener`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/preturi`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.65,
    },
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
      url: `${baseUrl}/cookies`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gdpr`,
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

  return [...mainPages, ...servicePages, ...routePages, ...staticPages];
}
