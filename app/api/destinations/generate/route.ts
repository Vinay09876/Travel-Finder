import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { getSessionUserId } from '@/lib/session-server';
import { generateDestination, slugifyDestinationName, GenerateDestinationResult } from '@/lib/generate-destination';

// OSM lookup + Gemini enrichment can take a while; allow the function to run
// long enough on serverless hosts instead of being killed mid-generation.
export const maxDuration = 120;

const GenerateDestinationSchema = z.object({
  destinationName: z.string().min(2).max(100),
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  country: z.string(),
  state: z.string().optional()
});

// Basic in-memory concurrency lock for a single Node process
const generationLocks = new Map<string, Promise<GenerateDestinationResult>>();

function errorResponse(result: Extract<GenerateDestinationResult, { status: 'error' }>) {
  if (result.error.includes('QUOTA_EXCEEDED')) {
    return NextResponse.json(
      { error: 'Our AI planner is busy right now. Please try again in a few minutes.', code: 'AI_BUSY' },
      { status: 503 }
    );
  }
  if (/timeout|aborted/i.test(result.error)) {
    return NextResponse.json(
      { error: 'Generating this destination took too long. Please try again.', code: 'TIMEOUT' },
      { status: 504 }
    );
  }
  if (result.error.includes('does not normalize')) {
    return NextResponse.json({ error: 'Please pick a destination with a Latin-script name.', code: 'INVALID_NAME' }, { status: 400 });
  }
  return NextResponse.json({ error: 'Failed to generate destination' }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    // Parse Body
    const bodyText = await request.text();
    if (bodyText.length > 2000) return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    const { destinationName, lat, lng, country, state } = GenerateDestinationSchema.parse(JSON.parse(bodyText));

    const slug = slugifyDestinationName(destinationName);

    // Already generated? Serve it without consuming the user's generation quota.
    if (slug) {
      const existing = await prisma.destination.findUnique({ where: { id: slug }, select: { id: true } });
      if (existing) return NextResponse.json({ destinationId: existing.id, cached: true });
    }

    // Rate limit: max 10 generations per IP per hour, 3 per session user.
    // The user bucket is the signed session id — NOT a client header. Before
    // this, every caller fell into one shared 'anon' bucket, so after 3
    // generations site-wide every user got 429s for an hour.
    const ip = getClientIp(request);
    const userId = (await getSessionUserId(request)) ?? `anon-${crypto.randomUUID()}`;
    try {
      await checkRateLimit(ip, userId, 'generate-destination', 10, 3, 3600000);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'IP_RATE_LIMIT_EXCEEDED' || err.message === 'USER_RATE_LIMIT_EXCEEDED') {
        return NextResponse.json(
          { error: 'You have reached the hourly limit for new destinations. Please try again later.', code: 'RATE_LIMITED' },
          { status: 429 }
        );
      }
      throw error;
    }

    // Concurrency check — avoid duplicate generation for the same slug within this process
    const inFlight = generationLocks.get(slug);
    if (inFlight) {
      const result = await inFlight;
      if (result.status === 'error') return errorResponse(result);
      return NextResponse.json({ destinationId: result.id, cached: true });
    }

    const generationPromise = generateDestination({ destinationName, lat, lng, country, state });
    generationLocks.set(slug, generationPromise);

    try {
      const result = await generationPromise;
      if (result.status === 'error') {
        console.error('Destination generation failed:', result.error);
        return errorResponse(result);
      }
      return NextResponse.json({ destinationId: result.id, cached: result.status === 'cached' });
    } finally {
      generationLocks.delete(slug);
    }

  } catch (error: unknown) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    // The underlying error (which may include internal details like a raw DB
    // connection error) is logged server-side, not returned to the client.
    console.error('Destination Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate destination' }, { status: 500 });
  }
}
