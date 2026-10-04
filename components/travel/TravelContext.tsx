'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Destination, SearchQuery, CityOrigin } from '@/types';
import { DEFAULT_SEARCH_QUERY } from '@/lib/destinations';
import { findNearestOriginCity } from '@/lib/distance';

interface TravelContextType {
  savedTripIds: string[];
  savedDestinations: Destination[];
  isLoadingSavedTrips: boolean;
  handleToggleSave: (destId: string, destinationObj?: Destination, query?: SearchQuery) => Promise<void>;
  detectedOriginCity: CityOrigin | null;

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
  const [detectedOriginCity, setDetectedOriginCity] = useState<CityOrigin | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearestCity = findNearestOriginCity(
          position.coords.latitude,
          position.coords.longitude
        );
        setDetectedOriginCity(nearestCity as CityOrigin);
      },
      () => {
        // Location denied or unavailable — callers fall back to the default origin city.
      },
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    const initSessionAndFetchSavedTrips = async () => {
      try {
        // Ensures a signed, HttpOnly session cookie exists before relying on
        // it for saved-trip requests — no client-supplied id is sent.
        await fetch('/api/session');

        const res = await fetch('/api/saved-trips');
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

    initSessionAndFetchSavedTrips();
  }, []);

  const handleToggleSave = useCallback(async (destId: string, destinationObj?: Destination, query?: SearchQuery) => {
    const isSaving = !savedTripIds.includes(destId);

    try {
      if (isSaving) {
        const res = await fetch('/api/saved-trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
            const getRes = await fetch('/api/saved-trips');
            if (getRes.ok) {
               const data = await getRes.json();
               setSavedDestinations(data.savedTrips.map((st: { destinationId: string, destination: Destination }) => st.destination));
            }
          }
        }
      } else {
        const res = await fetch(`/api/saved-trips/${destId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSavedTripIds((prev) => prev.filter((id) => id !== destId));
          setSavedDestinations((prev) => prev.filter((d) => d.id !== destId));
        }
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  }, [savedTripIds]);

  const value = useMemo<TravelContextType>(() => ({
    savedTripIds,
    savedDestinations,
    isLoadingSavedTrips,
    handleToggleSave,
    detectedOriginCity,
    isHowItWorksOpen,
    setIsHowItWorksOpen,
    isSavedTripsOpen,
    setIsSavedTripsOpen,
    isDesignSystemOpen,
    setIsDesignSystemOpen
  }), [
    savedTripIds,
    savedDestinations,
    isLoadingSavedTrips,
    handleToggleSave,
    detectedOriginCity,
    isHowItWorksOpen,
    isSavedTripsOpen,
    isDesignSystemOpen
  ]);

  return (
    <TravelContext.Provider value={value}>
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
