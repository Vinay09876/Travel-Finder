/* eslint-disable @typescript-eslint/no-explicit-any */
import { Destination as PrismaDestination, TransportRoute, Accommodation, CostMultiplier, Activity, CuratedItineraryDay } from '@prisma/client';
import { Destination, CityOrigin, TravelCategory, TransportOption, StayTier } from '../types';

type FullPrismaDestination = PrismaDestination & {
  transportRoutes: TransportRoute[];
  accommodations: Accommodation[];
  costMultiplier: CostMultiplier | null;
  activities: Activity[];
  itineraryDays: CuratedItineraryDay[];
};

export function mapPrismaToDestination(dbDest: FullPrismaDestination): Destination {
  // Mapping transportRoutes back to Record<CityOrigin, TransportOption[]>

  // Map transportRoutes back to Record<CityOrigin, TransportOption[]>
  const transportOptions: Record<CityOrigin, TransportOption[]> = {} as any;
  dbDest.transportRoutes.forEach((route) => {
    const origin = route.originCity as CityOrigin;
    if (!transportOptions[origin]) {
      transportOptions[origin] = [];
    }
    transportOptions[origin].push({
      mode: route.mode as any,
      name: route.name,
      durationHours: route.durationHours,
      costPerPersonRoundTrip: route.costPerPersonRoundTrip,
      description: route.description,
      recommended: route.recommended,
    });
  });

  return {
    id: dbDest.id,
    name: dbDest.name,
    state: dbDest.state,
    region: dbDest.region as any,
    lat: dbDest.lat ?? undefined,
    lng: dbDest.lng ?? undefined,
    source: dbDest.source,
    tagline: dbDest.tagline,
    shortDescription: dbDest.shortDescription,
    fullDescription: dbDest.fullDescription,
    category: dbDest.category as TravelCategory,
    heroImage: dbDest.heroImage,
    galleryImages: dbDest.galleryImages,
    vibe: dbDest.vibe,
    bestSeason: dbDest.bestSeason,
    bestMonths: dbDest.bestMonths,
    weatherNotes: dbDest.weatherNotes,
    distanceKm: dbDest.distanceKm ? (dbDest.distanceKm as Record<CityOrigin, number>) : undefined,
    transportOptions,
    stayOptions: dbDest.accommodations.map(acc => ({
      tier: acc.tier as StayTier,
      name: acc.name,
      costPerNightPerRoom: acc.costPerNightPerRoom,
      description: acc.description
    })),
    dailyFoodCostPerPerson: {
      budget: dbDest.costMultiplier?.foodBudget ?? 500,
      standard: dbDest.costMultiplier?.foodStandard ?? 1000,
      comfort: dbDest.costMultiplier?.foodComfort ?? 2000,
    },
    dailyLocalTransportCost: {
      scooterOrAuto: dbDest.costMultiplier?.localScooterOrAuto ?? 500,
      cabs: dbDest.costMultiplier?.localCabs ?? 1500,
    },
    keyActivities: dbDest.activities.map(act => ({
      name: act.name,
      costPerPerson: act.costPerPerson,
      tag: act.tag
    })),
    sampleItinerary: dbDest.itineraryDays.sort((a,b) => a.dayNumber - b.dayNumber).map(day => ({
      dayNumber: day.dayNumber,
      title: day.title,
      theme: day.theme,
      morning: {
        activity: day.morningActivity,
        description: day.morningDescription,
        estimatedCost: day.morningCost,
        tip: day.morningTip || undefined
      },
      afternoon: {
        activity: day.afternoonActivity,
        description: day.afternoonDescription,
        estimatedCost: day.afternoonCost,
        foodRecommendation: day.afternoonFoodRec || undefined
      },
      evening: {
        activity: day.eveningActivity,
        description: day.eveningDescription,
        estimatedCost: day.eveningCost,
        sunsetSpotOrVibe: day.eveningSunsetSpot || undefined
      }
    })),
    travelTips: dbDest.travelTips,
    mustTryFood: dbDest.mustTryFood,
    importantInfo: {
      safety: dbDest.infoSafety,
      connectivity: dbDest.infoConnectivity,
      nearestStation: dbDest.infoNearestStation,
      nearestAirport: dbDest.infoNearestAirport,
      cashNote: dbDest.infoCashNote,
    }
  };
}
