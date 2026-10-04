import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { calculateTripCost } from '@/lib/cost-calculator';
import { SearchQuery } from '@/types';
import { SearchQuerySchema } from '@/lib/validations';
import { getClientIp } from '@/lib/client-ip';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const ip = getClientIp(request);
    try {
      // This endpoint has no real per-user identity, so the "user" bucket is
      // given a fresh random id per request — a single request can never
      // exceed any maxPerUser value, leaving the per-IP limit (60/min) as
      // the actual protection.
      await checkRateLimit(ip, crypto.randomUUID(), 'destinations-search', 60, 1, 60000);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'IP_RATE_LIMIT_EXCEEDED' || err.message === 'USER_RATE_LIMIT_EXCEEDED') {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
      throw error;
    }

    let query: SearchQuery;
    try {
      query = SearchQuerySchema.parse({
        fromCity: searchParams.get('origin') || '',
        budget: searchParams.get('budget') ? Number(searchParams.get('budget')) : 0,
        travelers: searchParams.get('travelers') ? Number(searchParams.get('travelers')) : 0,
        durationDays: searchParams.get('duration') ? Number(searchParams.get('duration')) : 0,
        month: searchParams.get('month') || '',
        category: searchParams.get('category') || undefined,
        stayTier: searchParams.get('stayTier') || undefined,
        transportPreference: searchParams.get('transportPreference') || undefined,
      });
    } catch (e) {
      return NextResponse.json({ error: 'Invalid search parameters', details: e }, { status: 400 });
    }

    // Filter by category at the DB level (indexed) instead of fetching
    // everything and discarding non-matching rows in JS. Budget/cost-based
    // filtering still happens below — it depends on calculateTripCost, which
    // needs per-destination pricing data that can't be expressed as a SQL
    // WHERE clause (curated transport routes, Haversine fallback, etc).
    const categoryFilter =
      query.category && query.category !== 'all' ? { category: query.category } : {};

    // Safety cap: this endpoint is meant to return "all destinations matching
    // the category filter" for the frontend's existing client-side budget
    // sort/filter/pagination — but it must never be able to return the
    // literal entire table unbounded as the destination count grows.
    const MAX_RESULTS = 200;

    const dbDestinations = await prisma.destination.findMany({
      where: categoryFilter,
      take: MAX_RESULTS,
      include: {
        transportRoutes: true,
        accommodations: true,
        costMultiplier: true,
        activities: true
        // itineraryDays intentionally omitted — calculateTripCost never reads
        // sampleItinerary, so fetching it here is pure waste on this endpoint.
      }
    });

    const results = dbDestinations.map(dbDest => {
      const destination = mapPrismaToDestination(dbDest);
      const costInfo = calculateTripCost(destination, query);
      return { destination, costInfo };
    });

    // Sort: fits > near > over, then by cost
    results.sort((a, b) => {
      const statusRank = { fits: 1, near: 2, over: 3 };
      const rankA = statusRank[a.costInfo.budgetStatus];
      const rankB = statusRank[b.costInfo.budgetStatus];
      if (rankA !== rankB) return rankA - rankB;
      return a.costInfo.totalEstimatedCost - b.costInfo.totalEstimatedCost;
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Failed to search destinations' }, { status: 500 });
  }
}
