/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { calculateTripCost } from '@/lib/cost-calculator';
import { SearchQuery } from '@/types';
import { SearchQuerySchema } from '@/lib/validations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
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

    // Fetch all destinations from DB (or filter by category directly in DB if we want to optimize)
    const dbDestinations = await prisma.destination.findMany({
      include: {
        transportRoutes: true,
        accommodations: true,
        costMultiplier: true,
        activities: true,
        itineraryDays: true
      }
    });

    let results = dbDestinations.map(dbDest => {
      const destination = mapPrismaToDestination(dbDest);
      const costInfo = calculateTripCost(destination, query);
      return { destination, costInfo };
    });

    if (query.category && query.category !== 'all') {
      results = results.filter(r => r.destination.category === query.category);
    }

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
