'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchForm } from '@/components/travel/SearchForm';
import { DirectDestinationSearch } from '@/components/travel/DirectDestinationSearch';
import { PopularDestinations } from '@/components/travel/PopularDestinations';
import { TrustSection } from '@/components/travel/TrustSection';
import { DESTINATIONS, DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { SearchQuery } from '@/types';
import { useTravelContext } from '@/components/travel/TravelContext';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState<SearchQuery>(DEFAULT_SEARCH_QUERY);
  const [isSearching, setIsSearching] = useState(false);

  const { savedTripIds, handleToggleSave } = useTravelContext();

  const handleFindTrips = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);
    
    const params = new URLSearchParams({
      origin: query.fromCity,
      budget: query.budget.toString(),
      travelers: query.travelers.toString(),
      duration: query.durationDays.toString(),
      month: query.month,
    });
    if (query.category && query.category !== 'all') {
      params.append('category', query.category);
    }
    if (query.stayTier) {
      params.append('stayTier', query.stayTier);
    }
    if (query.transportPreference && query.transportPreference !== 'all') {
      params.append('transportPreference', query.transportPreference);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleSelectDestination = (destId: string) => {
    const params = new URLSearchParams({
      origin: query.fromCity,
      budget: query.budget.toString(),
      travelers: query.travelers.toString(),
      duration: query.durationDays.toString(),
      month: query.month,
    });
    if (query.category && query.category !== 'all') {
      params.append('category', query.category);
    }
    if (query.stayTier) {
      params.append('stayTier', query.stayTier);
    }
    if (query.transportPreference && query.transportPreference !== 'all') {
      params.append('transportPreference', query.transportPreference);
    }
    router.push(`/destination/${destId}?${params.toString()}`);
  };

  return (
    <div id="homepage-view" className="w-full">
      <section
        id="hero-section"
        className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-4 shadow-2xs">
            <span>Budget-First Travel Discovery for India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-3 sm:mb-4">
            Find trips that fit your budget.
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Search for a specific destination anywhere in India, or use Budget Discovery to find places you can afford.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <DirectDestinationSearch />
          
          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative bg-[#f8fafc] px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR USE BUDGET DISCOVERY</div>
          </div>

          <SearchForm
            query={query}
            onChangeQuery={setQuery}
            onSubmitSearch={handleFindTrips}
            isSearching={isSearching}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <TrustSection />
        </div>

        <div className="max-w-7xl mx-auto">
          <PopularDestinations
            destinations={DESTINATIONS}
            query={query}
            onSelectDestination={handleSelectDestination}
            onViewAllResults={handleFindTrips}
            savedTripIds={savedTripIds}
            onToggleSave={(id) => handleToggleSave(id, DESTINATIONS.find(d => d.id === id), query)}
          />
        </div>
      </section>
    </div>
  );
}
