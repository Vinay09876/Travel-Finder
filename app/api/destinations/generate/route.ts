/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { fetchTopOsmPois } from '@/lib/osm-poi';
import { enrichDestination } from '@/lib/gemini-enricher';
import { getDestinationImage } from '@/lib/image-provider';

const GenerateDestinationSchema = z.object({
  destinationName: z.string().min(2).max(100),
  lat: z.number(),
  lng: z.number(),
  country: z.string(),
  state: z.string().optional()
});

// Basic in-memory concurrency lock for a single Node process
const generationLocks = new Map<string, Promise<unknown>>();

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const userId = request.headers.get('x-user-id');
    
    // Rate limit: Max 10 generations per IP per hour, 3 per User ID
    try {
      await checkRateLimit(ip, userId || 'anon', 'generate-destination', 10, 3, 3600000);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'IP_RATE_LIMIT_EXCEEDED') return NextResponse.json({ error: 'Too many generations from this IP' }, { status: 429 });
      if (err.message === 'USER_RATE_LIMIT_EXCEEDED') return NextResponse.json({ error: 'Too many generations for this user' }, { status: 429 });
      throw error;
    }

    // Parse Body
    const bodyText = await request.text();
    if (bodyText.length > 2000) return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    const body = JSON.parse(bodyText);
    const { destinationName, lat, lng, country, state } = GenerateDestinationSchema.parse(body);

    const slug = destinationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // 1. Check DB Cache
    const existing = await prisma.destination.findFirst({
      where: {
        id: slug
      }
    });

    if (existing) {
      return NextResponse.json({ destinationId: existing.id, cached: true });
    }

    // 2. Concurrency check
    if (generationLocks.has(slug)) {
      const result = (await generationLocks.get(slug)) as { id: string };
      return NextResponse.json({ destinationId: result.id, cached: true });
    }

    // Create the generation promise
    const generationPromise = (async () => {
      // 3. Factual Lookup (OSM Overpass)
      const pois = await fetchTopOsmPois(lat, lng);
      
      // 4. Enrich Data (Gemini)
      const contextRegion = state || country;
      const enriched = await enrichDestination(destinationName, contextRegion, pois);

      // Fetch Hero Image using Provider
      const heroImgUrl = await getDestinationImage(destinationName);

      // 5. Save to Postgres with Nested Writes
      const existingTx = await prisma.destination.findUnique({ where: { id: slug } });
      if (existingTx) return existingTx;

      const dbActivitiesData = pois.map(poi => {
        let baseCost = 0;
        if (poi.type === 'museum' || poi.type === 'attraction') baseCost = 150;
        return { name: poi.name, costPerPerson: baseCost, tag: poi.type };
      });

      let foodB = 500, foodS = 1000, foodC = 2000, locS = 400, locC = 1500;
      const isIndia = country.toLowerCase() === 'india';
      
      if (!isIndia) {
        // Exclude from Indian pricing calculation
        foodB = -1; foodS = -1; foodC = -1; locS = -1; locC = -1;
      } else {
        if (enriched.category === 'heritage' || enriched.category === 'beach') {
          foodB += 200; foodS += 400; foodC += 500; locS += 100; locC += 300;
        }
      }

      const destinationRecord = await prisma.destination.create({
        data: {
          id: slug,
          name: destinationName,
          state: isIndia ? (state || 'India') : country,
          region: isIndia ? 'Central' : 'International',
          lat: lat,
          lng: lng,
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
            create: { foodBudget: foodB, foodStandard: foodS, foodComfort: foodC, localScooterOrAuto: locS, localCabs: locC }
          },
          activities: {
            create: dbActivitiesData
          },
          itineraryDays: {
            create: enriched.itineraryDays.map(day => ({
              dayNumber: day.dayNumber,
              title: day.title,
              theme: day.theme,
              morningActivity: day.morning.activity,
              morningDescription: day.morning.description,
              morningCost: dbActivitiesData.find(a => a.name === day.morning.activity)?.costPerPerson || 0,
              morningTip: day.morning.tip,
              afternoonActivity: day.afternoon.activity,
              afternoonDescription: day.afternoon.description,
              afternoonCost: dbActivitiesData.find(a => a.name === day.afternoon.activity)?.costPerPerson || 0,
              afternoonFoodRec: day.afternoon.foodRecommendation,
              eveningActivity: day.evening.activity,
              eveningDescription: day.evening.description,
              eveningCost: dbActivitiesData.find(a => a.name === day.evening.activity)?.costPerPerson || 0,
              eveningSunsetSpot: day.evening.sunsetSpotOrVibe,
            }))
          }
        }
      });

      return destinationRecord;
    })();

    // Store promise in lock Map
    generationLocks.set(slug, generationPromise);

    try {
      const finalDest = await generationPromise;
      return NextResponse.json({ destinationId: finalDest.id, cached: false });
    } finally {
      // Clean up lock
      generationLocks.delete(slug);
    }

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Destination Generation Error:", err);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    if (err.message === 'Destination not found or invalid') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to generate destination', details: err.message }, { status: 500 });
  }
}
