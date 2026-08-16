import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { OsmPoi } from './osm-poi';

export const DestinationEnrichmentSchema = z.object({
  tagline: z.string().describe("A short, catchy tagline (max 60 chars)"),
  shortDescription: z.string().describe("A 2 sentence engaging description of the destination."),
  fullDescription: z.string().describe("A full paragraph describing the overall experience."),
  category: z.enum(['beach', 'heritage', 'hills', 'adventure', 'weekend', 'city']),
  vibe: z.array(z.string()).describe("Array of 2-3 short words like 'hills', 'nature', 'spiritual'"),
  bestSeason: z.string().describe("e.g. 'Winter', 'Monsoon'"),
  bestMonths: z.array(z.string()).describe("e.g. ['Nov', 'Dec', 'Jan']"),
  weatherNotes: z.string(),
  travelTips: z.array(z.string()).describe("3-4 practical money-saving or local tips"),
  mustTryFood: z.array(z.string()).describe("3-4 specific local dishes"),
  importantInfo: z.object({
    safety: z.string(),
    connectivity: z.string(),
    nearestStation: z.string(),
    nearestAirport: z.string(),
    cashNote: z.string()
  }),
  itineraryDays: z.array(z.object({
    dayNumber: z.number(),
    title: z.string(),
    theme: z.string(),
    morning: z.object({
      activity: z.string().describe("MUST be an exact POI name from the provided list, or 'Free Time', 'Relaxation', 'Local Exploration'"),
      description: z.string(),
      tip: z.string().optional()
    }),
    afternoon: z.object({
      activity: z.string().describe("MUST be an exact POI name from the provided list, or 'Free Time', 'Relaxation', 'Local Exploration'"),
      description: z.string(),
      foodRecommendation: z.string().optional()
    }),
    evening: z.object({
      activity: z.string().describe("MUST be an exact POI name from the provided list, or 'Free Time', 'Relaxation', 'Local Exploration'"),
      description: z.string(),
      sunsetSpotOrVibe: z.string().optional()
    })
  })).describe("Exactly 3 days of itinerary utilizing ONLY the provided factual POIs. Do not invent any new places.")
});

export async function enrichDestination(destinationName: string, state: string, pois: OsmPoi[]) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_GEMINI_KEY_HERE')) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing');
  }

  const validPoiNames = pois.map(p => p.name);
  const allowedGeneric = ['Free Time', 'Relaxation', 'Local Exploration'];
  const allAllowed = [...validPoiNames, ...allowedGeneric].map(n => n.toLowerCase().trim());

  const prompt = `
You are a highly structured travel data enricher. Your job is to format factual POI data into a beautiful discovery schema.
Destination: ${destinationName}, ${state}

FACTUAL POINTS OF INTEREST (POIs) FROM OPENSTREETMAP:
${pois.length === 0 ? "No factual POIs available. You must use 'Free Time', 'Relaxation', 'Local Exploration'." : pois.map(p => `- ${p.name} (Type: ${p.type})`).join('\n')}

CRITICAL RULES:
1. DO NOT INVENT OR HALLUCINATE ANY PLACES, ATTRACTIONS, OR POIS.
2. The 'activity' field in the itinerary MUST match EXACTLY with the POI names listed above.
3. If there are not enough POIs for 3 full days, you MUST use generic fallback activities: "Free Time", "Relaxation", or "Local Exploration" instead of inventing places.
4. DO NOT invent prices or costs. Cost is handled server-side.
5. Provide realistic, factual weather, connectivity, and transport details.
6. STRICT HALLUCINATION CHECK: The POIs listed above are the ONLY real-world places you are allowed to mention anywhere in the response. Do not mention other specific monuments, parks, temples, or museums in descriptions, tips, or sunset spots.
`;

  console.log(`[enrichDestination] Starting enrichment for ${destinationName}`);
  console.log(`[enrichDestination] Received ${pois.length} POIs`);
  console.log(`[enrichDestination] All allowed activities: ${allAllowed.join(', ')}`);


  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: DestinationEnrichmentSchema,
      prompt: attempt === 1 ? prompt : prompt + `\n\nRETRY INSTRUCTION: Your previous attempt was rejected because you either invented a place not in the factual POIs list, or used an invalid activity name. You MUST ONLY use the EXACT POI names provided, or the generic terms. Do NOT include unverified places in descriptions.`,
    });

    // Validate the generated object
    let isValid = true;
    for (const day of object.itineraryDays) {
      const activities = [day.morning.activity, day.afternoon.activity, day.evening.activity];
      
      for (const act of activities) {
        if (!allAllowed.includes(act.toLowerCase().trim())) {
          console.warn(`[Validation Failed] Hallucinated or invalid activity: ${act}`);
          isValid = false;
          break;
        }
      }
      
      if (!isValid) break;
    }

    if (isValid) {
      return object;
    }
    lastError = new Error("Generated itinerary contained hallucinated places or invalid activities.");
  }

  throw lastError;
}
