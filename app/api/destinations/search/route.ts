/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { calculateTripCost } from '@/lib/cost-calculator';
import { SearchQuery } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const query: SearchQuery = {
      fromCity: searchParams.get('origin') as any,
      budget: Number(searchParams.get('budget')),
      travelers: Number(searchParams.get('travelers')),
      durationDays: Number(searchParams.get('duration')),
      month: searchParams.get('month') || '',
      category: searchParams.get('category') as any || 'all',
      stayTier: searchParams.get('stayTier') as any || undefined,
      transportPreference: searchParams.get('transportPreference') as any || undefined,
    };

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
