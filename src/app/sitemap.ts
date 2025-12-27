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

  const routePages: MetadataRoute.Sitemap = popularRoutes.map(route => ({
    url: `${baseUrl}/transport/${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...mainPages, ...servicePages, ...routePages];
}
