import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { SearchQuerySchema, checkPayloadSize } from '@/lib/validations';
import { getSessionUserId } from '@/lib/session-server';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    const savedTrips = await prisma.savedTrip.findMany({
      where: { userId },
      include: {
        destination: {
          include: {
            transportRoutes: true,
            accommodations: true,
            costMultiplier: true,
            activities: true,
            itineraryDays: true
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    });

    const mappedTrips = savedTrips.map(st => ({
      ...st,
      destination: mapPrismaToDestination(st.destination)
    }));

    return NextResponse.json({ savedTrips: mappedTrips });
  } catch (error) {
    console.error('Error fetching saved trips:', error);
    return NextResponse.json({ error: 'Failed to fetch saved trips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    try {
      checkPayloadSize(request, 15000);
    } catch (e) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    const body = await request.json();
    
    let parsedBody;
    try {
      parsedBody = z.object({
        destinationId: z.string().min(1).max(50),
        searchParams: SearchQuerySchema
      }).parse(body);
    } catch (e) {
      console.error('Invalid saved-trips request payload:', e);
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { destinationId, searchParams } = parsedBody;
    
    // Verify destination exists in DB before saving
    const destExists = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { id: true }
    });
    if (!destExists) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Handle duplicate constraint gracefully
    const existing = await prisma.savedTrip.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId: destinationId
        }
      }
    });

    if (existing) {
      const updated = await prisma.savedTrip.update({
        where: { id: existing.id },
        data: { searchParams }
      });
      return NextResponse.json({ savedTrip: updated });
    }

    const savedTrip = await prisma.savedTrip.create({
      data: {
        userId,
        destinationId: destinationId,
        searchParams: searchParams
      }
    });

    return NextResponse.json({ savedTrip });
  } catch (error) {
    console.error('Error saving trip:', error);
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 });
  }
}
