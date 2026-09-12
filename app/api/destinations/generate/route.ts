import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { generateDestination } from '@/lib/generate-destination';

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

    // Concurrency check — avoid duplicate generation for the same slug within this process
    if (generationLocks.has(slug)) {
      const result = (await generationLocks.get(slug)) as { id: string };
      return NextResponse.json({ destinationId: result.id, cached: true });
    }

    const generationPromise = generateDestination({ destinationName, lat, lng, country, state });
    generationLocks.set(slug, generationPromise);

    try {
      const result = await generationPromise;
      if (result.status === 'error') {
        return NextResponse.json({ error: 'Failed to generate destination', details: result.error }, { status: 500 });
      }
      return NextResponse.json({ destinationId: result.id, cached: result.status === 'cached' });
    } finally {
      generationLocks.delete(slug);
    }

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Destination Generation Error:", err);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate destination', details: err.message }, { status: 500 });
  }
}
