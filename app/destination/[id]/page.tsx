import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { DestinationPageClient } from '@/components/travel/DestinationPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDestination(id: string) {
  const dbDest = await prisma.destination.findUnique({
    where: { id },
    include: {
      transportRoutes: true,
      accommodations: true,
      costMultiplier: true,
      activities: true,
      itineraryDays: true,
    },
  });

  if (!dbDest) return null;
  return mapPrismaToDestination(dbDest);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    return {
      title: 'Destination Not Found — TravelFinder',
      description: 'The destination you are looking for could not be found.',
    };
  }

  const title = `${destination.name}, ${destination.state} — Trip Cost & Itinerary | TravelFinder`;
  const description = destination.shortDescription || destination.tagline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: destination.heroImage ? [{ url: destination.heroImage }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: destination.heroImage ? [destination.heroImage] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: destination.name,
    description: destination.shortDescription || destination.tagline,
    image: destination.heroImage || undefined,
    address: {
      '@type': 'PostalAddress',
      addressRegion: destination.state,
      addressCountry: 'IN',
    },
    ...(destination.lat !== undefined && destination.lng !== undefined
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: destination.lat,
            longitude: destination.lng,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationPageClient destination={destination} />
    </>
  );
}
