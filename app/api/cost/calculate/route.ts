import { NextResponse } from 'next/server';
import { calculateTripCost } from '@/lib/cost-calculator';
import { SearchQuery } from '@/types';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destinationId, query } = body as { destinationId: string, query: SearchQuery };

    if (!destinationId || !query) {
      return NextResponse.json({ error: 'Missing destinationId or query' }, { status: 400 });
    }

    // Fetch the destination and all required pricing data from PostgreSQL securely
    const dbDest = await prisma.destination.findUnique({
      where: { id: destinationId },
      include: {
        transportRoutes: true,
        accommodations: true,
        costMultiplier: true,
        activities: true,
        itineraryDays: true
      }
    });

    if (!dbDest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const destination = mapPrismaToDestination(dbDest);
    
    // Server-side calculation using trusted DB data
    const costInfo = calculateTripCost(destination, query);
    
    return NextResponse.json({ costInfo });
  } catch (error) {
    console.error('Error in cost calculation API:', error);
    return NextResponse.json({ error: 'Failed to calculate cost' }, { status: 500 });
  }
}
