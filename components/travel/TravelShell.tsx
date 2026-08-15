'use client';

import React, { useMemo } from 'react';
import { useTravelContext } from './TravelContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileQuickBar } from './MobileQuickBar';
import { HowItWorksModal } from './HowItWorksModal';
import { SavedTripsModal } from './SavedTripsModal';
import { DesignSystemModal } from './DesignSystemModal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { CityOrigin, TravelCategory, StayTier, TransportPreference } from '@/types';

export function TravelShell({ children }: { children: React.ReactNode }) {
  const {
    savedTripIds,
    savedDestinations,
    isLoadingSavedTrips,
    handleToggleSave,
    isHowItWorksOpen,
    setIsHowItWorksOpen,
    isSavedTripsOpen,
    setIsSavedTripsOpen,
    isDesignSystemOpen,
    setIsDesignSystemOpen
  } = useTravelContext();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  let currentView: 'home' | 'results' | 'detail' = 'home';
  if (pathname?.startsWith('/search')) currentView = 'results';
  if (pathname?.startsWith('/destination')) currentView = 'detail';

  const activeQuery = useMemo(() => {
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

  const handleNavigateHome = () => {
    router.push('/');
  };

  const handleSelectDestination = (destId: string) => {
    router.push(`/destination/${destId}`);
    setIsSavedTripsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        savedCount={savedTripIds.length}
        isLoadingSavedTrips={isLoadingSavedTrips}
        activeQuery={activeQuery}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
      />

      <MobileQuickBar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        savedTripIds={savedTripIds}
        destinations={savedDestinations}
        query={activeQuery}
        onSelectDestination={handleSelectDestination}
        onToggleSave={(id) => handleToggleSave(id, undefined, activeQuery)}
        onClose={() => setIsSavedTripsOpen(false)}
      />

      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />
    </div>
  );
}
