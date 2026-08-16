import { z } from 'zod';

export const CityOriginSchema = z.enum([
  'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Kochi'
]);

export const TravelCategorySchema = z.enum([
  'all', 'beach', 'heritage', 'hills', 'adventure', 'weekend'
]);

export const StayTierSchema = z.enum([
  'budget_hostel', 'standard_homestay', 'comfort_hotel'
]);

export const TransportPreferenceSchema = z.enum([
  'all', 'train', 'bus', 'flight', 'drive', 'cab'
]);

export const UuidSchema = z.string().uuid('Invalid UUID format');

export const SearchQuerySchema = z.object({
  fromCity: CityOriginSchema,
  budget: z.coerce.number().int().positive().max(10000000),
  travelers: z.coerce.number().int().min(1).max(10),
  durationDays: z.coerce.number().int().min(1).max(14),
  month: z.string().min(1).max(20),
  category: TravelCategorySchema.optional().default('all'),
  stayTier: StayTierSchema.optional(),
  transportPreference: TransportPreferenceSchema.optional(),
});

export const AiPreferencesSchema = z.object({
  vibe: z.enum(['relaxed', 'active', 'foodie', 'culture', 'budget_saver']),
  startTime: z.enum(['early', 'leisure']),
  dietary: z.enum(['all', 'veg', 'cafe'])
});

export const AiItineraryRequestSchema = z.object({
  destinationId: z.string().min(1).max(50),
  query: SearchQuerySchema,
  preferences: AiPreferencesSchema
});

// Helper to check payload size (approximate using headers if available)
export function checkPayloadSize(request: Request, maxBytes: number = 10000) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    throw new Error('Payload too large');
  }
}
