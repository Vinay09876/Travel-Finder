'use client';

import React, { useState } from 'react';
import { SearchQuery } from '@/types';
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

  // Saved / Bookmarked Trips
  const [savedTripIds, setSavedTripIds] = useState<string[]>(['goa', 'rishikesh']);

  // Modal States
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAiItineraryOpen, setIsAiItineraryOpen] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  const handleSelectDestination = (destId: string) => {
    setSelectedDestId(destId);
    setCurrentView('detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFindTrips = () => {
    setCurrentView('results');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleSave = (destId: string) => {
    setSavedTripIds((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const activeDestination =
    initialDestinations.find((d) => d.id === selectedDestId) || initialDestinations[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        savedCount={savedTripIds.length}
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
                />
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
                />
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SEARCH RESULTS VIEW */}
        {currentView === 'results' && (
          <SearchResultsView
            destinations={initialDestinations}
            query={query}
            onChangeQuery={setQuery}
            onSelectDestination={handleSelectDestination}
            onBackToHome={handleNavigateHome}
          />
        )}

        {/* VIEW 3: DESTINATION DETAIL VIEW */}
        {currentView === 'detail' && activeDestination && (
          <DestinationDetailView
            destination={activeDestination}
            query={query}
            onChangeQuery={setQuery}
            onBackToResults={() => setCurrentView('results')}
            onOpenAiItinerary={() => setIsAiItineraryOpen(true)}
          />
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
