import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { z } from 'zod';
import { generateStructured, GeminiQuotaError, isTimeoutError } from '@/lib/gemini-client';
import { AiItineraryRequestSchema, checkPayloadSize } from '@/lib/validations';
import { getClientIp } from '@/lib/client-ip';
import { checkRateLimit } from '@/lib/rate-limit';
import { getSessionUserId } from '@/lib/session-server';

// Allow enough time for up to two Gemini calls on serverless hosts.
export const maxDuration = 120;

const blockSchema = z.object({
  activity: z.string(),
  description: z.string(),
  estimatedCost: z.number(),
});

// Wrapped in an object: a top-level array is not reliably supported as a
// structured-output root by every provider/model.
const itinerarySchema = z.object({
  days: z.array(z.object({
    dayNumber: z.number(),
    title: z.string(),
    theme: z.string(),
    morning: blockSchema.extend({ tip: z.string().optional() }),
    afternoon: blockSchema.extend({ foodRecommendation: z.string().optional() }),
    evening: blockSchema.extend({ sunsetSpotOrVibe: z.string().optional() }),
  })),
});

type GeneratedDay = z.infer<typeof itinerarySchema>['days'][number];

const FALLBACK_ACTIVITY = { cost: 0, originalName: 'Local Exploration' };
const BLOCKS = ['morning', 'afternoon', 'evening'] as const;

export async function POST(request: Request) {
  try {
    // 1. Payload Size Protection
    try {
      checkPayloadSize(request, 15000); // 15KB max for AI request
    } catch {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'No active session', code: 'NO_SESSION' }, { status: 401 });
    }

    // 2. Strict Zod Validation for Body
    let parsedBody;
    try {
      parsedBody = AiItineraryRequestSchema.parse(await request.json());
    } catch (e) {
      console.error('Invalid ai-itinerary request payload:', e);
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { destinationId, query, preferences } = parsedBody;
    const durationDays = query.durationDays;

    // 3. Rate Limiting (Before any DB or AI calls)
    const ip = getClientIp(request);
    try {
      await checkRateLimit(ip, userId, '/api/ai-itinerary', 20, 5, 3600000); // 20 per IP, 5 per User, 1 Hour window
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('RATE_LIMIT_EXCEEDED')) {
        return NextResponse.json(
          { error: 'You have reached the hourly limit of 5 AI itineraries. Please try again later.', code: 'RATE_LIMITED' },
          { status: 429 }
        );
      }
      throw e;
    }

    // 4. Fetch DB Context
    const dbDest = await prisma.destination.findUnique({
      where: { id: destinationId },
      include: {
        transportRoutes: true,
        accommodations: true,
        costMultiplier: true,
        activities: true,
        itineraryDays: true,
      },
    });

    if (!dbDest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const destination = mapPrismaToDestination(dbDest);

    // Map valid activities for validation
    const validActivitiesMap = new Map<string, { cost: number, originalName: string }>();
    validActivitiesMap.set('free time', { cost: 0, originalName: 'Free Time' });
    validActivitiesMap.set('relaxation', { cost: 0, originalName: 'Relaxation' });
    validActivitiesMap.set('local exploration', FALLBACK_ACTIVITY);
    destination.keyActivities.forEach(a => validActivitiesMap.set(a.name.toLowerCase().trim(), { cost: a.costPerPerson, originalName: a.name }));

    const matchActivity = (raw: string) => {
      const name = raw.toLowerCase().trim();
      if (!name) return FALLBACK_ACTIVITY;
      const exact = validActivitiesMap.get(name);
      if (exact) return exact;
      // Forgiving partial match (e.g. "Visit Baga Beach" -> "Baga Beach").
      for (const [key, value] of validActivitiesMap) {
        if (key.includes(name) || name.includes(key)) return value;
      }
      // Model invented a place: replace it with a free generic activity rather
      // than failing the whole request (which previously surfaced as a
      // generic "Unable to generate" error to the user).
      console.warn(`[ai-itinerary] Replacing unknown activity: ${raw}`);
      return FALLBACK_ACTIVITY;
    };

    /** Normalizes activities/costs in place and returns total activity cost for the group. */
    const normalize = (days: GeneratedDay[]) => {
      let total = 0;
      days.forEach((day, idx) => {
        day.dayNumber = idx + 1;
        for (const block of BLOCKS) {
          const matched = matchActivity(day[block].activity);
          day[block].activity = matched.originalName;
          day[block].estimatedCost = matched.cost; // per-person cost
          total += matched.cost * query.travelers;
        }
      });
      return total;
    };

    const basePrompt = `
You are an expert travel planner. Create a detailed ${durationDays}-day itinerary for ${destination.name}.
Do NOT invent places, activities, or costs. Use strictly the provided data.

Destination Context:
- Region: ${destination.region}, State: ${destination.state}
- Vibe: ${destination.vibe.join(', ')}
- Travel Tips: ${destination.travelTips.join(' | ')}
- Must Try Food: ${destination.mustTryFood.join(', ')}

Available Activities and their exact costs (INR per person):
${destination.keyActivities.map(a => `- "${a.name}" (Cost: ${a.costPerPerson} INR)`).join('\n')}
- "Free Time" (Cost: 0 INR)
- "Relaxation" (Cost: 0 INR)
- "Local Exploration" (Cost: 0 INR)

User Constraints:
- Duration: ${durationDays} days
- Group Size: ${query.travelers} travelers
- Overall Budget: ${query.budget} INR
- Trip Vibe: ${preferences.vibe}
- Morning Wake-up Style: ${preferences.startTime}
- Dietary Preference: ${preferences.dietary}

Instructions:
1. Return an object with a "days" array containing EXACTLY ${durationDays} entries.
2. For the 'activity' field in morning/afternoon/evening, you MUST output the EXACT name of an activity from the list above. Do NOT invent activity names.
3. For the 'estimatedCost', just use 0. The server will calculate the authoritative cost.
`;

    const generate = async (retryContext = '') =>
      (await generateStructured(itinerarySchema, basePrompt + retryContext, { timeoutMs: 50_000 })).days;

    // At most two model calls per request so the user isn't left waiting on
    // a spinner for minutes.
    let days = await generate();
    let totalActivityCost = days.length === durationDays ? normalize(days) : Infinity;

    if (days.length !== durationDays || totalActivityCost > query.budget) {
      const reason = days.length !== durationDays
        ? `You previously generated ${days.length} days. You MUST generate EXACTLY ${durationDays} days.`
        : `Your previous itinerary cost ${totalActivityCost} INR for activities alone, exceeding the budget of ${query.budget}. Prefer cheaper or free activities ("Free Time").`;
      console.warn(`[ai-itinerary] Retrying: ${reason}`);
      days = await generate(`\nCRITICAL: ${reason}\n`);

      if (days.length > durationDays) days = days.slice(0, durationDays);
      if (days.length !== durationDays) {
        return NextResponse.json({ error: 'Unable to generate an itinerary with the exact requested duration. Please try again.' }, { status: 502 });
      }
      totalActivityCost = normalize(days);
      if (totalActivityCost > query.budget) {
        return NextResponse.json({ error: 'Could not fit the activities into your budget. Try increasing the budget or choosing "Maximum Budget Saver".' }, { status: 422 });
      }
    }

    // 5. Save to Prisma ONLY after all validation succeeds
    const savedItinerary = await prisma.aiItinerary.create({
      data: {
        userId,
        destinationId: destination.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preferences: preferences as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generatedContent: days as any,
      }
    });

    return NextResponse.json({
      itineraryId: savedItinerary.id,
      generatedContent: days
    });

  } catch (error) {
    console.error('AI Itinerary Error:', error);
    if (error instanceof GeminiQuotaError) {
      return NextResponse.json(
        { error: 'Our AI planner is busy right now. Please try again in a few minutes.', code: 'AI_BUSY' },
        { status: 503 }
      );
    }
    if (isTimeoutError(error)) {
      return NextResponse.json(
        { error: 'The AI took too long to respond. Please try again.', code: 'TIMEOUT' },
        { status: 504 }
      );
    }
    return NextResponse.json({ error: 'Unable to generate a valid itinerary. Please try again.' }, { status: 500 });
  }
}
