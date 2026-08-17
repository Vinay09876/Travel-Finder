'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResultsView } from '@/components/travel/SearchResultsView';
import { SearchQuery, Destination, CalculatedCost, CityOrigin, TravelCategory, StayTier, TransportPreference } from '@/types';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { useTravelContext } from '@/components/travel/TravelContext';
import { AlertCircle } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { savedTripIds, handleToggleSave } = useTravelContext();

  const [apiResults, setApiResults] = useState<{ destination: Destination; costInfo: CalculatedCost }[] | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

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

  // Sync local query when URL changes
  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/destinations/search?${searchParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch destinations');
        const data = await res.json();
        if (!data.results) throw new Error('Invalid response from server');
        setApiResults(data.results);
      } catch (err) {
        console.error(err);
        setSearchError('An error occurred while searching for trips. Please try again.');
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams({
      origin: localQuery.fromCity,
      budget: localQuery.budget.toString(),
      travelers: localQuery.travelers.toString(),
      duration: localQuery.durationDays.toString(),
      month: localQuery.month,
    });
    if (localQuery.category && localQuery.category !== 'all') params.append('category', localQuery.category);
    if (localQuery.stayTier) params.append('stayTier', localQuery.stayTier);
    if (localQuery.transportPreference && localQuery.transportPreference !== 'all') params.append('transportPreference', localQuery.transportPreference);

    router.push(`/search?${params.toString()}`);
  };

  const handleSelectDestination = (destId: string) => {
    router.push(`/destination/${destId}?${searchParams.toString()}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (searchError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Oops, something went wrong</h2>
        <p className="text-slate-600 mb-6">{searchError}</p>
        <button 
          onClick={handleBackToHome} 
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Show a loading state if we don't have results yet
  if (isSearching && !apiResults) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Finding the best trips for your budget...</p>
      </div>
    );
  }

  if (!apiResults) return null;

  return (
    <SearchResultsView
      apiResults={apiResults}
      query={localQuery}
      onChangeQuery={setLocalQuery}
      onSelectDestination={handleSelectDestination}
      onBackToHome={handleBackToHome}
      onSearch={handleSearchSubmit}
      isSearching={isSearching}
      savedTripIds={savedTripIds}
      onToggleSave={(id) => handleToggleSave(id, apiResults.find(r => r.destination.id === id)?.destination, localQuery)}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
