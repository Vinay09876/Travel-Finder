import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { getClientIp } from '@/lib/client-ip';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ip = getClientIp(request);
    try {
      // This endpoint has no real per-user identity, so the "user" bucket is
      // given a fresh random id per request — a single request can never
      // exceed any maxPerUser value, leaving the per-IP limit (60/min) as
      // the actual protection.
      await checkRateLimit(ip, crypto.randomUUID(), 'destinations-detail', 60, 1, 60000);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'IP_RATE_LIMIT_EXCEEDED' || err.message === 'USER_RATE_LIMIT_EXCEEDED') {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
      throw error;
    }

    const { id } = await params;
    const dbDest = await prisma.destination.findUnique({
      where: { id },
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
    return NextResponse.json({ destination });
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
