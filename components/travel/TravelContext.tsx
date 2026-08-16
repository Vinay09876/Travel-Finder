'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Destination, SearchQuery } from '@/types';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { getAnonymousUserId } from '@/lib/user-identity';

interface TravelContextType {
  savedTripIds: string[];
  savedDestinations: Destination[];
  isLoadingSavedTrips: boolean;
  handleToggleSave: (destId: string, destinationObj?: Destination, query?: SearchQuery) => Promise<void>;
  
  isHowItWorksOpen: boolean;
  setIsHowItWorksOpen: (val: boolean) => void;
  isSavedTripsOpen: boolean;
  setIsSavedTripsOpen: (val: boolean) => void;
  isDesignSystemOpen: boolean;
  setIsDesignSystemOpen: (val: boolean) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [isLoadingSavedTrips, setIsLoadingSavedTrips] = useState(true);

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  useEffect(() => {
    const anonId = getAnonymousUserId();
    if (!anonId) return;

    const fetchSavedTrips = async () => {
      try {
        const res = await fetch('/api/saved-trips', {
          headers: { 'x-user-id': anonId as string }
        });
        if (res.ok) {
          const data = await res.json();
          const ids = data.savedTrips.map((st: { destinationId: string, destination: Destination }) => st.destinationId);
          const dests = data.savedTrips.map((st: { destinationId: string, destination: Destination }) => st.destination);
          setSavedTripIds(ids);
          setSavedDestinations(dests);
        }
      } catch (err) {
        console.error('Failed to load saved trips:', err);
      } finally {
        setIsLoadingSavedTrips(false);
      }
    };
    
    fetchSavedTrips();
  }, []);

  const handleToggleSave = async (destId: string, destinationObj?: Destination, query?: SearchQuery) => {
    const anonId = getAnonymousUserId();
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
            searchParams: query || DEFAULT_SEARCH_QUERY
          })
        });
        if (res.ok) {
          setSavedTripIds((prev) => [...prev, destId]);
          if (destinationObj) {
            setSavedDestinations((prev) => [...prev, destinationObj]);
          } else {
            // Refresh saved trips to fetch the newly saved destination object from db
            const getRes = await fetch('/api/saved-trips', { headers: { 'x-user-id': anonId } });
            if (getRes.ok) {
               const data = await getRes.json();
               setSavedDestinations(data.savedTrips.map((st: { destinationId: string, destination: Destination }) => st.destination));
            }
          }
        }
      } else {
        const res = await fetch(`/api/saved-trips/${destId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': anonId }
        });
        if (res.ok) {
          setSavedTripIds((prev) => prev.filter((id) => id !== destId));
          setSavedDestinations((prev) => prev.filter((d) => d.id !== destId));
        }
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  return (
    <TravelContext.Provider value={{
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
    }}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
}
