import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { calculateTripCost } from '@/lib/cost-calculator';
import { SearchQuery } from '@/types';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { SearchQuerySchema, checkPayloadSize } from '@/lib/validations';
import { getClientIp } from '@/lib/client-ip';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    try {
      checkPayloadSize(request, 10000);
    } catch (e) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const ip = getClientIp(request);
    try {
      // This endpoint has no real per-user identity, so the "user" bucket is
      // given a fresh random id per request — a single request can never
      // exceed any maxPerUser value, leaving the per-IP limit (60/min) as
      // the actual protection.
      await checkRateLimit(ip, crypto.randomUUID(), 'cost-calculate', 60, 1, 60000);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'IP_RATE_LIMIT_EXCEEDED' || err.message === 'USER_RATE_LIMIT_EXCEEDED') {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
      throw error;
    }

    const body = await request.json();
    
    let parsedBody;
    try {
      parsedBody = z.object({
        destinationId: z.string().min(1).max(50),
        query: SearchQuerySchema
      }).parse(body);
    } catch (e) {
      console.error('Invalid cost-calculate request payload:', e);
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { destinationId, query } = parsedBody as { destinationId: string, query: SearchQuery };

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
