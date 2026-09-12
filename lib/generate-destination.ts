import prisma from './prisma';
import { fetchTopOsmPois } from './osm-poi';
import { enrichDestination } from './gemini-enricher';
import { getDestinationImage } from './image-provider';
import { allKeysExhausted } from './gemini-client';

export interface GenerateDestinationInput {
  destinationName: string;
  lat: number;
  lng: number;
  country: string;
  state?: string;
}

export type GenerateDestinationResult =
  | { status: 'created'; id: string }
  | { status: 'cached'; id: string }
  | { status: 'error'; destinationName: string; error: string };

/**
 * Core destination generation logic shared by the /api/destinations/generate
 * route and the batch seeding script (scripts/batch-generate-destinations.ts).
 * Fetches real POIs from OpenStreetMap, enriches them via Gemini, and persists
 * a full Destination row. No rate limiting here — callers are responsible for
 * pacing (the API route rate-limits per request; the batch script paces itself
 * to stay within Overpass/Gemini usage limits).
 */
export async function generateDestination(
  input: GenerateDestinationInput
): Promise<GenerateDestinationResult> {
  const { destinationName, lat, lng, country, state } = input;
  const slug = destinationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  try {
    const existing = await prisma.destination.findUnique({ where: { id: slug } });
    if (existing) {
      return { status: 'cached', id: existing.id };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'error', destinationName, error: message };
  }

  if (allKeysExhausted()) {
    return {
      status: 'error',
      destinationName,
      error: 'QUOTA_EXCEEDED: All configured Gemini API keys have exhausted their daily quota.',
    };
  }

  try {
    const pois = await fetchTopOsmPois(lat, lng);
    const contextRegion = state || country;
    const enriched = await enrichDestination(destinationName, contextRegion, pois);
    const heroImgUrl = await getDestinationImage(destinationName);

    // Guard against a duplicate created by a concurrent request while this ran.
    const existingRace = await prisma.destination.findUnique({ where: { id: slug } });
    if (existingRace) {
      return { status: 'cached', id: existingRace.id };
    }

    const dbActivitiesData = pois.map((poi) => {
      let baseCost = 0;
      if (poi.type === 'museum' || poi.type === 'attraction') baseCost = 150;
      return { name: poi.name, costPerPerson: baseCost, tag: poi.type };
    });

    let foodB = 500, foodS = 1000, foodC = 2000, locS = 400, locC = 1500;
    const isIndia = country.toLowerCase() === 'india';

    if (!isIndia) {
      foodB = -1; foodS = -1; foodC = -1; locS = -1; locC = -1;
    } else if (enriched.category === 'heritage' || enriched.category === 'beach') {
      foodB += 200; foodS += 400; foodC += 500; locS += 100; locC += 300;
    }

    const destinationRecord = await prisma.destination.create({
      data: {
        id: slug,
        name: destinationName,
        state: isIndia ? (state || 'India') : country,
        region: isIndia ? 'Central' : 'International',
        lat,
        lng,
        source: 'dynamic',
        tagline: enriched.tagline,
        shortDescription: enriched.shortDescription,
        fullDescription: enriched.fullDescription,
        category: enriched.category,
        heroImage: heroImgUrl,
        galleryImages: [],
        vibe: enriched.vibe,
        bestSeason: enriched.bestSeason,
        bestMonths: enriched.bestMonths,
        weatherNotes: enriched.weatherNotes,
        distanceKm: {},
        infoSafety: enriched.importantInfo.safety,
        infoConnectivity: enriched.importantInfo.connectivity,
        infoNearestStation: enriched.importantInfo.nearestStation,
        infoNearestAirport: enriched.importantInfo.nearestAirport,
        infoCashNote: enriched.importantInfo.cashNote,
        travelTips: enriched.travelTips,
        mustTryFood: enriched.mustTryFood,

        costMultiplier: {
          create: { foodBudget: foodB, foodStandard: foodS, foodComfort: foodC, localScooterOrAuto: locS, localCabs: locC },
        },
        activities: {
          create: dbActivitiesData,
        },
        itineraryDays: {
          create: enriched.itineraryDays.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            theme: day.theme,
            morningActivity: day.morning.activity,
            morningDescription: day.morning.description,
            morningCost: dbActivitiesData.find((a) => a.name === day.morning.activity)?.costPerPerson || 0,
            morningTip: day.morning.tip,
            afternoonActivity: day.afternoon.activity,
            afternoonDescription: day.afternoon.description,
            afternoonCost: dbActivitiesData.find((a) => a.name === day.afternoon.activity)?.costPerPerson || 0,
            afternoonFoodRec: day.afternoon.foodRecommendation,
            eveningActivity: day.evening.activity,
            eveningDescription: day.evening.description,
            eveningCost: dbActivitiesData.find((a) => a.name === day.evening.activity)?.costPerPerson || 0,
            eveningSunsetSpot: day.evening.sunsetSpotOrVibe,
          })),
        },
      },
    });

    return { status: 'created', id: destinationRecord.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'error', destinationName, error: message };
  }
}
