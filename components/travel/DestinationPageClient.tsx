'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DestinationDetailView } from '@/components/travel/DestinationDetailView';
import { AiItineraryModal } from '@/components/travel/AiItineraryModal';
import { Destination, SearchQuery, CityOrigin, TravelCategory, StayTier, TransportPreference } from '@/types';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { useTravelContext } from '@/components/travel/TravelContext';

export interface DestinationPageClientProps {
  destination: Destination;
}

function DestinationPageContent({ destination }: DestinationPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { savedTripIds, handleToggleSave } = useTravelContext();

  const [isAiItineraryOpen, setIsAiItineraryOpen] = useState(false);

  const query = useMemo<SearchQuery>(() => {
    if (!searchParams) return DEFAULT_SEARCH_QUERY;
    return {
      fromCity: (searchParams.get('origin') as CityOrigin) || DEFAULT_SEARCH_QUERY.fromCity,
      budget: Number(searchParams.get('budget')) || DEFAULT_SEARCH_QUERY.budget,
      travelers: Number(searchParams.get('travelers')) || DEFAULT_SEARCH_QUERY.travelers,
      durationDays: Number(searchParams.get('duration')) || DEFAULT_SEARCH_QUERY.durationDays,
      month: searchParams.get('month') || DEFAULT_SEARCH_QUERY.month,
      category: (searchParams.get('category') as TravelCategory) || DEFAULT_SEARCH_QUERY.category,
      stayTier: (searchParams.get('stayTier') as StayTier) || DEFAULT_SEARCH_QUERY.stayTier,
      transportPreference: (searchParams.get('transportPreference') as TransportPreference) || DEFAULT_SEARCH_QUERY.transportPreference,
    };
  }, [searchParams]);

  const [localQuery, setLocalQuery] = useState<SearchQuery>(query);

  return (
    <>
      <DestinationDetailView
        destination={destination}
        query={localQuery}
        onChangeQuery={setLocalQuery}
        onBackToResults={() => router.back()}
        onOpenAiItinerary={() => setIsAiItineraryOpen(true)}
        isSaved={savedTripIds.includes(destination.id)}
        onToggleSave={(id) => handleToggleSave(id, destination, localQuery)}
      />

      <AiItineraryModal
        isOpen={isAiItineraryOpen}
        destination={destination}
        query={localQuery}
        onClose={() => setIsAiItineraryOpen(false)}
      />
    </>
  );
}

export function DestinationPageClient({ destination }: DestinationPageClientProps) {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading...</div>}>
      <DestinationPageContent destination={destination} />
    </Suspense>
  );
}
