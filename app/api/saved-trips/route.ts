import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { UuidSchema, SearchQuerySchema, checkPayloadSize } from '@/lib/validations';
import { z } from 'zod';

// Helper to get or create anonymous user
async function getOrCreateUser(anonId: string | null) {
  if (!anonId) throw new Error('Missing X-User-Id header');
  const validId = UuidSchema.parse(anonId);
  const email = `anon-${validId}@travelfinder.local`;
  
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: 'Anonymous Traveler',
      }
    });
  }
  return user;
}

export async function GET(request: Request) {
  const anonId = request.headers.get('x-user-id');
  try {
    let user;
    try {
      user = await getOrCreateUser(anonId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid user identity' }, { status: 400 });
    }
    
    const savedTrips = await prisma.savedTrip.findMany({
      where: { userId: user.id },
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
  const anonId = request.headers.get('x-user-id');
  try {
    try {
      checkPayloadSize(request, 15000);
    } catch (e) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    let user;
    try {
      user = await getOrCreateUser(anonId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid user identity' }, { status: 400 });
    }

    const body = await request.json();
    
    let parsedBody;
    try {
      parsedBody = z.object({
        destinationId: z.string().min(1).max(50),
        searchParams: SearchQuerySchema
      }).parse(body);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request payload', details: e }, { status: 400 });
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
          userId: user.id,
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
        userId: user.id,
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
