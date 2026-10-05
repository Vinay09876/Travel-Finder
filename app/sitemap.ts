import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const destinations = await prisma.destination.findMany({
    select: { id: true, updatedAt: true },
  });

  const destinationEntries: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${baseUrl}/destination/${dest.id}`,
    lastModified: dest.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  return [...staticEntries, ...destinationEntries];
}
