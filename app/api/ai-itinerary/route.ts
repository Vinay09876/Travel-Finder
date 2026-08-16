import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';
import { z } from 'zod';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { AiItineraryRequestSchema, UuidSchema, checkPayloadSize } from '@/lib/validations';
import { getClientIp } from '@/lib/client-ip';
import { checkRateLimit } from '@/lib/rate-limit';

const itinerarySchema = z.array(z.object({
  dayNumber: z.number(),
  title: z.string(),
  theme: z.string(),
  morning: z.object({
    activity: z.string(),
    description: z.string(),
    estimatedCost: z.number(),
    tip: z.string().optional()
  }),
  afternoon: z.object({
    activity: z.string(),
    description: z.string(),
    estimatedCost: z.number(),
    foodRecommendation: z.string().optional()
  }),
  evening: z.object({
    activity: z.string(),
    description: z.string(),
    estimatedCost: z.number(),
    sunsetSpotOrVibe: z.string().optional()
  })
}));

export async function POST(request: Request) {
  try {
    // 1. Payload Size Protection
    try {
      checkPayloadSize(request, 15000); // 15KB max for AI request
    } catch (e) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const rawUserId = request.headers.get('x-user-id');
    if (!rawUserId) {
      return NextResponse.json({ error: 'Missing X-User-Id' }, { status: 401 });
    }

    // 2. Strict UUID Validation
    let userId: string;
    try {
      userId = UuidSchema.parse(rawUserId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid user identity format' }, { status: 400 });
    }

    const body = await request.json();

    // 3. Strict Zod Validation for Body
    let parsedBody;
    try {
      parsedBody = AiItineraryRequestSchema.parse(body);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request payload', details: e }, { status: 400 });
    }

    const { destinationId, query, preferences } = parsedBody;
    const durationDays = query.durationDays;

    // 4. Rate Limiting (Before any DB or AI calls)
    const ip = getClientIp(request);
    try {
      await checkRateLimit(ip, userId, '/api/ai-itinerary', 20, 5, 3600000); // 20 per IP, 5 per User, 1 Hour window
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('RATE_LIMIT_EXCEEDED')) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
      throw e;
    }

    // 1. Fetch DB Context
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
    validActivitiesMap.set('local exploration', { cost: 0, originalName: 'Local Exploration' });
    destination.keyActivities.forEach(a => validActivitiesMap.set(a.name.toLowerCase().trim(), { cost: a.costPerPerson, originalName: a.name }));

    const generateItinerary = async (retryContext = '') => {
      const contextPrompt = `
You are an expert travel planner for India. Create a detailed ${durationDays}-day itinerary for ${destination.name}.
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

Daily Food Cost (per person): Budget: ${destination.dailyFoodCostPerPerson.budget}, Standard: ${destination.dailyFoodCostPerPerson.standard}
Daily Local Transport Cost (per group): ${destination.dailyLocalTransportCost.scooterOrAuto}

User Constraints:
- Duration: ${durationDays} days
- Group Size: ${query.travelers} travelers
- Overall Budget: ${query.budget} INR
- Trip Vibe: ${preferences.vibe}
- Morning Wake-up Style: ${preferences.startTime}
- Dietary Preference: ${preferences.dietary}

Instructions:
1. Generate EXACTLY ${durationDays} days.
2. For the 'activity' field in morning/afternoon/evening, you MUST output the EXACT name of an activity from the list above. Do NOT invent activity names.
3. For the 'estimatedCost', just use 0. The server will calculate the authoritative cost.
${retryContext}
      `;

      const { object } = await generateObject({
        model: google('gemini-3.6-flash'),
        schema: itinerarySchema,
        prompt: contextPrompt,
      });
      return object;
    };

    let generatedItinerary = await generateItinerary();

    // 2. Validate Duration (with 1 retry)
    if (generatedItinerary.length !== durationDays) {
      console.warn(`Duration mismatch. Expected ${durationDays}, got ${generatedItinerary.length}. Retrying...`);
      generatedItinerary = await generateItinerary(`CRITICAL: You previously generated ${generatedItinerary.length} days. You MUST generate EXACTLY ${durationDays} days.`);
      if (generatedItinerary.length !== durationDays) {
        return NextResponse.json({ error: 'Unable to generate an itinerary with the exact requested duration.' }, { status: 400 });
      }
    }

    // 3. Validate Activities and Costs
    let totalActivityCost = 0;
    for (const day of generatedItinerary) {
      day.dayNumber = generatedItinerary.indexOf(day) + 1;
      const blocks = ['morning', 'afternoon', 'evening'] as const;
      
      for (const block of blocks) {
        const activityName = day[block].activity.toLowerCase().trim();
        
        // Find matching activity or fallback
        let matchedActivity = validActivitiesMap.get(activityName);
        
        if (matchedActivity === undefined) {
          // Check for partial match to be forgiving but safe
          const partialMatchKey = Array.from(validActivitiesMap.keys()).find(k => k.includes(activityName) || activityName.includes(k));
          if (partialMatchKey !== undefined) {
             matchedActivity = validActivitiesMap.get(partialMatchKey)!;
          } else {
             // Invalid activity hallucinated by Gemini
             console.error(`Invalid activity generated: ${day[block].activity}`);
             return NextResponse.json({ error: 'Unable to generate a valid itinerary' }, { status: 400 });
          }
        }
        
        // Normalize cost to DB value and restore original casing
        day[block].activity = matchedActivity.originalName;
        day[block].estimatedCost = matchedActivity.cost; // Output exactly the per-person cost
        totalActivityCost += matchedActivity.cost * query.travelers; // Total cost must still factor in travelers
      }
    }

    // 4. Budget Validation (Approximate check)
    // We only check if the activities alone blow past the total budget to avoid impossible itineraries
    if (totalActivityCost > query.budget) {
        console.warn(`Generated itinerary exceeds budget. Total Activity Cost: ${totalActivityCost}, Budget: ${query.budget}. Retrying...`);
        generatedItinerary = await generateItinerary(`CRITICAL: Your previous itinerary cost ${totalActivityCost} for activities alone, which exceeds the budget of ${query.budget}. You MUST select cheaper or free activities ("Free Time").`);
        
        // Re-validate cost
        totalActivityCost = 0;
        for (const day of generatedItinerary) {
          const blocks = ['morning', 'afternoon', 'evening'] as const;
          for (const block of blocks) {
            const activityName = day[block].activity.toLowerCase().trim();
            let matchedActivity = validActivitiesMap.get(activityName);
            
            if (matchedActivity === undefined) {
              const partialMatchKey = Array.from(validActivitiesMap.keys()).find(k => k.includes(activityName) || activityName.includes(k));
              if (partialMatchKey !== undefined) {
                 matchedActivity = validActivitiesMap.get(partialMatchKey)!;
              } else {
                 console.error(`Invalid activity generated on retry: ${day[block].activity}`);
                 return NextResponse.json({ error: 'Unable to generate a valid itinerary within budget constraints (invalid activity).' }, { status: 400 });
              }
            }
            
            day[block].activity = matchedActivity.originalName;
            day[block].estimatedCost = matchedActivity.cost; // Output exactly the per-person cost
            totalActivityCost += matchedActivity.cost * query.travelers;
          }
        }
        
        if (totalActivityCost > query.budget) {
           return NextResponse.json({ error: 'Unable to generate a valid itinerary within the requested budget.' }, { status: 400 });
        }
    }

    // 5. Ensure anonymous user exists
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@anonymous.local`,
          name: 'Anonymous Traveler',
        }
      });
    }

    // 6. Save to Prisma ONLY after all validation succeeds
    const savedItinerary = await prisma.aiItinerary.create({
      data: {
        userId: user.id,
        destinationId: destination.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preferences: preferences as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generatedContent: generatedItinerary as any,
      }
    });

    return NextResponse.json({
      itineraryId: savedItinerary.id,
      generatedContent: generatedItinerary
    });

  } catch (error) {
    console.error('AI Itinerary Error:', error);
    return NextResponse.json({ error: 'Unable to generate a valid itinerary' }, { status: 500 });
  }
}
