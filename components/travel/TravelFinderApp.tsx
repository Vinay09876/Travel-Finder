'use client';

import React, { useState, useEffect } from 'react';
import { SearchQuery, Destination, CalculatedCost } from '@/types';
import { AlertCircle } from 'lucide-react';
import { DESTINATIONS, DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SearchForm } from './SearchForm';
import { PopularDestinations } from './PopularDestinations';
import { SearchResultsView } from './SearchResultsView';
import { DestinationDetailView } from './DestinationDetailView';
import { TrustSection } from './TrustSection';
import { HowItWorksModal } from './HowItWorksModal';
import { AiItineraryModal } from './AiItineraryModal';
import { SavedTripsModal } from './SavedTripsModal';
import { DesignSystemModal } from './DesignSystemModal';
import { MobileQuickBar } from './MobileQuickBar';

export interface TravelFinderAppProps {
  initialDestinations?: typeof DESTINATIONS;
}

export const TravelFinderApp: React.FC<TravelFinderAppProps> = ({
  initialDestinations = DESTINATIONS,
}) => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'results' | 'detail'>('home');
  const [selectedDestId, setSelectedDestId] = useState<string>('goa');

  // Search Query State
  const [query, setQuery] = useState<SearchQuery>(DEFAULT_SEARCH_QUERY);

  // API State
  const [apiResults, setApiResults] = useState<{ destination: Destination; costInfo: CalculatedCost }[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Saved / Bookmarked Trips
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const [isLoadingSavedTrips, setIsLoadingSavedTrips] = useState(true);

  // Load Saved Trips on mount
  useEffect(() => {
    let anonId = localStorage.getItem('travelFinder_anon_userId');
    if (!anonId) {
      anonId = crypto.randomUUID();
      localStorage.setItem('travelFinder_anon_userId', anonId);
    }

    const fetchSavedTrips = async () => {
      try {
        const res = await fetch('/api/saved-trips', {
          headers: { 'x-user-id': anonId as string }
        });
        if (res.ok) {
          const data = await res.json();
          const ids = data.savedTrips.map((st: any) => st.destinationId);
          setSavedTripIds(ids);
        }
      } catch (err) {
        console.error('Failed to load saved trips:', err);
      } finally {
        setIsLoadingSavedTrips(false);
      }
    };
    
    fetchSavedTrips();
  }, []);

  // Detail View State
  const [destinationCache, setDestinationCache] = useState<Record<string, Destination>>({});
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Modal States
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAiItineraryOpen, setIsAiItineraryOpen] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  const handleSelectDestination = async (destId: string) => {
    // 1. If already in cache (previously fetched from detail API), use it immediately
    if (destinationCache[destId]) {
      setSelectedDestId(destId);
      setCurrentView('detail');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Fetch it from the /api/destinations/[id] API (even if in search results, per instructions)
    setSelectedDestId(destId);
    setCurrentView('detail');
    setIsDetailLoading(true);
    setDetailError(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch(`/api/destinations/${destId}`);
      if (!res.ok) {
        throw new Error('Destination not found');
      }
      const data = await res.json();
      if (!data.destination) {
        throw new Error('Invalid destination data');
      }
      setDestinationCache((prev) => ({ ...prev, [destId]: data.destination }));
    } catch (err) {
      console.error(err);
      setDetailError('Unable to load destination details. Please try again.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleFindTrips = async () => {
    setIsSearching(true);
    setSearchError(null);
    try {
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

      const res = await fetch(`/api/destinations/search?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch destinations');
      }
      
      const data = await res.json();
      if (!data.results) {
        throw new Error('Invalid response from server');
      }
      
      setApiResults(data.results);
      setCurrentView('results');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
      setSearchError('An error occurred while searching for trips. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleSave = async (destId: string) => {
    const anonId = localStorage.getItem('travelFinder_anon_userId');
    if (!anonId) return;

    const isSaving = !savedTripIds.includes(destId);

    try {
      if (isSaving) {
        const res = await fetch('/api/saved-trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': anonId
          },
          body: JSON.stringify({
            destinationId: destId,
            searchParams: query
          })
        });
        if (res.ok) {
          setSavedTripIds((prev) => [...prev, destId]);
        }
      } else {
        const res = await fetch(`/api/saved-trips/${destId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': anonId }
        });
        if (res.ok) {
          setSavedTripIds((prev) => prev.filter((id) => id !== destId));
        }
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const activeDestination =
    destinationCache[selectedDestId] ||
    apiResults?.find((r) => r.destination.id === selectedDestId)?.destination ||
    initialDestinations.find((d) => d.id === selectedDestId) ||
    initialDestinations[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        savedCount={savedTripIds.length}
        isLoadingSavedTrips={isLoadingSavedTrips}
        activeQuery={query}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {/* VIEW 1: HOME VIEW */}
        {currentView === 'home' && (
          <div id="homepage-view" className="w-full">
            {/* Hero Section */}
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
                  Enter your departure city, budget, group size, and travel month. We calculate realistic trip estimates covering transport, stays, food, local travel, and activities.
                </p>
              </div>

              {/* Central Search Form Card */}
              <div className="max-w-4xl mx-auto">
                <SearchForm
                  query={query}
                  onChangeQuery={setQuery}
                  onSubmitSearch={handleFindTrips}
                  isSearching={isSearching}
                />
                {searchError && (
                  <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center font-medium">
                    {searchError}
                  </div>
                )}
              </div>

              {/* Trust Section */}
              <div className="max-w-4xl mx-auto">
                <TrustSection />
              </div>

              {/* Popular Destinations Grid */}
              <div className="max-w-7xl mx-auto">
                <PopularDestinations
                  destinations={initialDestinations}
                  query={query}
                  onSelectDestination={handleSelectDestination}
                  onViewAllResults={handleFindTrips}
                  savedTripIds={savedTripIds}
                  onToggleSave={handleToggleSave}
                />
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SEARCH RESULTS VIEW */}
        {currentView === 'results' && apiResults && (
          <SearchResultsView
            apiResults={apiResults}
            query={query}
            onChangeQuery={setQuery}
            onSelectDestination={handleSelectDestination}
            onBackToHome={handleNavigateHome}
            onSearch={handleFindTrips}
            isSearching={isSearching}
            savedTripIds={savedTripIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* VIEW 3: DESTINATION DETAIL VIEW */}
        {currentView === 'detail' && (
          isDetailLoading ? (
            <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">Loading destination details...</p>
            </div>
          ) : detailError ? (
            <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Oops, something went wrong</h2>
              <p className="text-slate-600 mb-6">{detailError}</p>
              <button 
                onClick={() => setCurrentView('results')} 
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                Go Back
              </button>
            </div>
          ) : activeDestination ? (
            <DestinationDetailView
              destination={activeDestination}
              query={query}
              onChangeQuery={setQuery}
              onBackToResults={() => setCurrentView('results')}
              onOpenAiItinerary={() => setIsAiItineraryOpen(true)}
              isSaved={savedTripIds.includes(activeDestination.id)}
              onToggleSave={handleToggleSave}
            />
          ) : null
        )}
      </main>

      {/* Universal Footer with Quick Action Links for Modals */}
      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
      />

      {/* Mobile Sticky Quick Navigation */}
      <MobileQuickBar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {activeDestination && (
        <AiItineraryModal
          isOpen={isAiItineraryOpen}
          destination={activeDestination}
          query={query}
          onClose={() => setIsAiItineraryOpen(false)}
        />
      )}

      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        savedTripIds={savedTripIds}
        destinations={initialDestinations}
        query={query}
        onSelectDestination={handleSelectDestination}
        onToggleSave={handleToggleSave}
        onClose={() => setIsSavedTripsOpen(false)}
      />

      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />
    </div>
  );
};
