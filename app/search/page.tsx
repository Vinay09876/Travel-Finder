'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResultsView } from '@/components/travel/SearchResultsView';
import { SearchQuery, Destination, CalculatedCost, CityOrigin, TravelCategory, StayTier, TransportPreference } from '@/types';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { useTravelContext } from '@/components/travel/TravelContext';
import { AlertCircle } from 'lucide-react';
import { fetchJson } from '@/lib/fetch-json';

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

  // Local edits to the criteria; reset whenever the URL query changes
  // (adjust-state-during-render pattern instead of a setState-in-effect).
  const [localQuery, setLocalQuery] = useState<SearchQuery>(query);
  const [prevQuery, setPrevQuery] = useState<SearchQuery>(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setLocalQuery(query);
  }

  const [retryToken, setRetryToken] = useState(0);
  const paramsString = searchParams.toString();

  useEffect(() => {
    // Abort superseded requests so an older, slower response can't replace
    // newer results (or flip the spinner off early).
    const controller = new AbortController();

    const fetchResults = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await fetchJson<{ results?: { destination: Destination; costInfo: CalculatedCost }[] }>(
          `/api/destinations/search?${paramsString}`,
          { signal: controller.signal, timeoutMs: 30_000 }
        );
        if (!res.ok || !res.data?.results) {
          if (res.timedOut) setSearchError('The search is taking too long. Please try again.');
          else if (res.status === 429) setSearchError('Too many searches in a short time. Please wait a moment and try again.');
          else if (res.status === 400) setSearchError('Some search details look invalid. Please go back and adjust your search.');
          else setSearchError('An error occurred while searching for trips. Please try again.');
        } else {
          setApiResults(res.data.results);
        }
      } catch {
        return; // aborted by a newer search / unmount
      }
      setIsSearching(false);
    };

    fetchResults();
    return () => controller.abort();
  }, [paramsString, retryToken]);

  const handleSearchSubmit = (queryToSubmit?: SearchQuery) => {
    const q = queryToSubmit || localQuery;
    const params = new URLSearchParams({
      origin: q.fromCity,
      budget: q.budget.toString(),
      travelers: q.travelers.toString(),
      duration: q.durationDays.toString(),
      month: q.month,
    });
    if (q.category && q.category !== 'all') params.append('category', q.category);
    if (q.stayTier) params.append('stayTier', q.stayTier);
    if (q.transportPreference && q.transportPreference !== 'all') params.append('transportPreference', q.transportPreference);

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
        <p className="text-slate-600 mb-6 text-center">{searchError}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setRetryToken((t) => t + 1)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={handleBackToHome}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
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
