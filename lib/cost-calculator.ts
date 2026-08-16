import { Destination, SearchQuery, CalculatedCost, TransportOption } from '@/types';
import { ORIGIN_COORDS, calculateHaversineDistance } from './distance';

/**
 * Calculates a realistic 5-pillar estimated cost for a given destination and search query:
 * 1. Transport (Round trip based on selected preference or recommended transit)
 * 2. Accommodation (Room allocation based on traveler count and nights)
 * 3. Food & Dining (Daily budget tailored to stay comfort tier)
 * 4. Local Transport (Scooters / auto / local transit per group)
 * 5. Activities & Sightseeing (Curated key monument & cultural entries)
 * + 5% realistic contingency buffer (water, tips, unforeseen transit)
 */
export function calculateTripCost(
  destination: Destination,
  query: SearchQuery
): CalculatedCost {
  const {
    fromCity,
    budget,
    travelers,
    durationDays,
    stayTier = 'standard_homestay',
    transportPreference = 'all',
  } = query;

  console.log('DESTINATION REGION:', destination.region);
  console.log('DESTINATION STATE:', destination.state);
  console.log('DESTINATION NAME:', destination.name);

  const isInternational = destination.region === 'International';

  // 1. Calculate Transport
  let availableOptions = destination.transportOptions?.[fromCity] || [];

  // FALLBACK: Generate algorithmic transport estimate when no curated route exists
  if (availableOptions.length === 0 && destination.lat && destination.lng) {
    const originCoords = ORIGIN_COORDS[fromCity];

    if (originCoords) {
      const distKm = calculateHaversineDistance(
        originCoords.lat,
        originCoords.lng,
        destination.lat,
        destination.lng
      );

      if (isInternational) {
        availableOptions = [
          {
            mode: 'flight',
            name: `Economy Flight (${Math.round(distKm)} km)`,
            durationHours: Math.max(1, Math.round(distKm / 600)),
            costPerPersonRoundTrip: Math.round(distKm * 6.5 * 2),
            description: 'Estimated economy round-trip flight.',
            recommended: true,
          },
        ];
      } else if (distKm < 500) {
        availableOptions = [
          {
            mode: 'bus',
            name: `AC Sleeper Bus (${Math.round(distKm)} km)`,
            durationHours: Math.max(1, Math.round(distKm / 50)),
            costPerPersonRoundTrip: Math.round(distKm * 3 * 2),
            description:
              'Estimated standard AC sleeper bus for short-medium distances.',
            recommended: true,
          },
        ];
      } else {
        availableOptions = [
          {
            mode: 'flight',
            name: `Economy Flight (${Math.round(distKm)} km)`,
            durationHours: Math.max(1, Math.round(distKm / 600)),
            costPerPersonRoundTrip: Math.round(distKm * 6.5 * 2),
            description: 'Estimated economy flight for longer distances.',
            recommended: true,
          },
        ];
      }
    }
  }

  let selectedTransport: TransportOption;

  if (transportPreference !== 'all' && availableOptions.length > 0) {
    const matched = availableOptions.find(
      (opt) => opt.mode === transportPreference
    );

    selectedTransport =
      matched ||
      availableOptions.find((opt) => opt.recommended) ||
      availableOptions[0];
  } else {
    selectedTransport =
      availableOptions.find((opt) => opt.recommended) ||
      availableOptions[0] || {
        mode: 'bus',
        name: 'Default Bus Estimate',
        durationHours: 12,
        costPerPersonRoundTrip: 2000,
        description: 'Fallback transport estimate.',
        recommended: true,
      };
  }

  const transportTotal =
    (selectedTransport?.costPerPersonRoundTrip ?? 1500) * travelers;

  // 2. Calculate Accommodation
  const roomsNeeded = travelers <= 2 ? 1 : Math.ceil(travelers / 2);

  const selectedStay =
    destination.stayOptions.find((s) => s.tier === stayTier) ||
    destination.stayOptions[1] ||
    destination.stayOptions[0];

  const nights = Math.max(1, durationDays - 1);

  const stayTotal =
    (selectedStay?.costPerNightPerRoom ?? 1200) *
    roomsNeeded *
    nights;

  // 3. Calculate Food
  const foodTierRate =
    stayTier === 'budget_hostel'
      ? destination.dailyFoodCostPerPerson.budget
      : stayTier === 'comfort_hotel'
        ? destination.dailyFoodCostPerPerson.comfort
        : destination.dailyFoodCostPerPerson.standard;

  // -1 means this destination does not have a reliable
  // food estimate in the current database.
  const safeFoodRate = Math.max(0, foodTierRate);

  const foodTotal = safeFoodRate * travelers * durationDays;

  // 4. Calculate Local Transport
  const scootersNeeded = Math.ceil(travelers / 2);

  const safeLocalTransportRate = Math.max(
    0,
    destination.dailyLocalTransportCost.scooterOrAuto
  );

  const localTransportTotal =
    safeLocalTransportRate * scootersNeeded * durationDays;

  // 5. Calculate Activities
  const avgActivityPerPersonPerDay = Math.round(
    destination.keyActivities.reduce(
      (acc, curr) => acc + Math.max(0, curr.costPerPerson),
      0
    ) / Math.max(1, destination.keyActivities.length)
  );

  const activitiesTotal =
    avgActivityPerPersonPerDay *
    travelers *
    Math.min(durationDays, 3);

  // 6. Buffer
  const subtotal =
    transportTotal +
    stayTotal +
    foodTotal +
    localTransportTotal +
    activitiesTotal;

  const bufferTotal = Math.round(subtotal * 0.05);

  const totalEstimatedCost = subtotal + bufferTotal;

  const perPersonCost = Math.round(
    totalEstimatedCost / Math.max(1, travelers)
  );

  const budgetRemaining = budget - totalEstimatedCost;

  const fitsBudget = totalEstimatedCost <= budget;

  let budgetStatus: 'fits' | 'near' | 'over' = 'over';

  if (fitsBudget) {
    budgetStatus = 'fits';
  } else if (
    totalEstimatedCost <= budget * 1.15 ||
    totalEstimatedCost <= budget + 1500
  ) {
    budgetStatus = 'near';
  }

  return {
    totalEstimatedCost,
    perPersonCost,
    transportTotal,
    stayTotal,
    foodTotal,
    localTransportTotal,
    activitiesTotal,
    bufferTotal,
    budgetRemaining,
    fitsBudget,
    budgetStatus,
    selectedTransport,
    selectedStay,
    isInternational,
  };
}
