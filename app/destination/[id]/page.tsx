'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DestinationDetailView } from '@/components/travel/DestinationDetailView';
import { AiItineraryModal } from '@/components/travel/AiItineraryModal';
import { Destination, SearchQuery, CityOrigin, TravelCategory, StayTier, TransportPreference } from '@/types';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { useTravelContext } from '@/components/travel/TravelContext';
import { AlertCircle } from 'lucide-react';

function DestinationDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const destId = params?.id as string;
  const { savedTripIds, handleToggleSave } = useTravelContext();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!destId) return;

    const fetchDestination = async () => {
      setIsDetailLoading(true);
      setDetailError(null);
      try {
        const res = await fetch(`/api/destinations/${destId}`);
        if (!res.ok) throw new Error('Destination not found');
        const data = await res.json();
        if (!data.destination) throw new Error('Invalid destination data');
        setDestination(data.destination);
      } catch (err) {
        console.error(err);
        setDetailError('Unable to load destination details. Please try again.');
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchDestination();
  }, [destId]);

  if (detailError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Oops, something went wrong</h2>
        <p className="text-slate-600 mb-6">{detailError}</p>
        <button 
          onClick={() => router.back()} 
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isDetailLoading || !destination) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Loading destination details...</p>
      </div>
    );
  }

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

export default function DestinationPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading...</div>}>
      <DestinationDetailContent />
    </Suspense>
  );
}
