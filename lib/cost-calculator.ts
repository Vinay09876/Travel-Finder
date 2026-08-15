import { Destination, SearchQuery, CalculatedCost, TransportOption } from '@/types';

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

  // 1. Calculate Transport
  const availableOptions =
    destination.transportOptions[fromCity] || destination.transportOptions['Mumbai'] || [];
  let selectedTransport: TransportOption;

  if (transportPreference !== 'all') {
    const matched = availableOptions.find((opt) => opt.mode === transportPreference);
    selectedTransport =
      matched || availableOptions.find((opt) => opt.recommended) || availableOptions[0];
  } else {
    // Pick recommended or most budget-friendly reasonable option
    selectedTransport = availableOptions.find((opt) => opt.recommended) || availableOptions[0];
  }

  const transportTotal = (selectedTransport?.costPerPersonRoundTrip ?? 1500) * travelers;

  // 2. Calculate Accommodation
  // Calculate rooms needed: 1 traveler = 1 room/dorm, 2 travelers = 1 room, 3 travelers = 1 room (extra bed factor 1.25x), 4 travelers = 2 rooms, etc.
  const roomsNeeded = travelers <= 2 ? 1 : Math.ceil(travelers / 2);
  const selectedStay =
    destination.stayOptions.find((s) => s.tier === stayTier) ||
    destination.stayOptions[1] ||
    destination.stayOptions[0];
  const nights = Math.max(1, durationDays - 1);
  const stayTotal = (selectedStay?.costPerNightPerRoom ?? 1200) * roomsNeeded * nights;

  // 3. Calculate Food
  // Match food tier roughly with stay tier
  const foodTierRate =
    stayTier === 'budget_hostel'
      ? destination.dailyFoodCostPerPerson.budget
      : stayTier === 'comfort_hotel'
      ? destination.dailyFoodCostPerPerson.comfort
      : destination.dailyFoodCostPerPerson.standard;
  const foodTotal = foodTierRate * travelers * durationDays;

  // 4. Calculate Local Transport
  // e.g. Scooter rental: 1 scooter per 2 travelers
  const scootersNeeded = Math.ceil(travelers / 2);
  const localTransportTotal =
    destination.dailyLocalTransportCost.scooterOrAuto * scootersNeeded * durationDays;

  // 5. Calculate Activities
  const avgActivityPerPersonPerDay = Math.round(
    destination.keyActivities.reduce((acc, curr) => acc + curr.costPerPerson, 0) /
      Math.max(1, destination.keyActivities.length)
  );
  const activitiesTotal = avgActivityPerPersonPerDay * travelers * Math.min(durationDays, 3);

  // 6. Buffer (5% realistic contingency margin for chai, tips, local entry, water)
  const subtotal = transportTotal + stayTotal + foodTotal + localTransportTotal + activitiesTotal;
  const bufferTotal = Math.round(subtotal * 0.05);

  const totalEstimatedCost = subtotal + bufferTotal;
  const perPersonCost = Math.round(totalEstimatedCost / travelers);
  const budgetRemaining = budget - totalEstimatedCost;
  const fitsBudget = totalEstimatedCost <= budget;

  let budgetStatus: 'fits' | 'near' | 'over' = 'over';
  if (totalEstimatedCost <= budget) {
    budgetStatus = 'fits';
  } else if (totalEstimatedCost <= budget * 1.15 || totalEstimatedCost <= budget + 1500) {
    budgetStatus = 'near';
  } else {
    budgetStatus = 'over';
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
  };
}
