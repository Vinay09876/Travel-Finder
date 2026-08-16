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

  // 1. Calculate Transport
  let availableOptions = destination.transportOptions?.[fromCity] || [];
    
  // FALLBACK: If absolutely no curated transport routes exist (Dynamic Destination), generate algorithmic fallback
  if (availableOptions.length === 0 && destination.lat && destination.lng) {
    const originCoords = ORIGIN_COORDS[fromCity];
    if (originCoords) {
      const distKm = calculateHaversineDistance(
        originCoords.lat, originCoords.lng,
        destination.lat, destination.lng
      );
      
      if (distKm < 500) {
        availableOptions = [{
          mode: 'bus',
          name: `AC Sleeper Bus (${Math.round(distKm)} km)`,
          durationHours: Math.round(distKm / 50),
          costPerPersonRoundTrip: Math.round(distKm * 3 * 2),
          description: 'Estimated standard AC sleeper bus for short-medium distances.',
          recommended: true
        }];
      } else {
        availableOptions = [{
          mode: 'flight',
          name: `Economy Flight (${Math.round(distKm)} km)`,
          durationHours: Math.max(1, Math.round(distKm / 600)),
          costPerPersonRoundTrip: Math.round(distKm * 6.5 * 2),
          description: 'Estimated economy flight for longer distances.',
          recommended: true
        }];
      }
    }
  }

  let selectedTransport: TransportOption;

  if (transportPreference !== 'all' && availableOptions.length > 0) {
    const matched = availableOptions.find((opt) => opt.mode === transportPreference);
    selectedTransport =
      matched || availableOptions.find((opt) => opt.recommended) || availableOptions[0];
  } else {
    // Pick recommended or most budget-friendly reasonable option
    selectedTransport = availableOptions.find((opt) => opt.recommended) || availableOptions[0] || {
      mode: 'bus',
      name: 'Default Bus Estimate',
      durationHours: 12,
      costPerPersonRoundTrip: 2000,
      description: 'Fallback transport estimate.',
      recommended: true
    };
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

  let isInternational = false;
  if (destination.region === 'International') {
    isInternational = true;
  }

  return {
    totalEstimatedCost: isInternational ? 0 : (subtotal + bufferTotal),
    perPersonCost: isInternational ? 0 : Math.round((subtotal + bufferTotal) / travelers),
    transportTotal: isInternational ? 0 : transportTotal,
    stayTotal: isInternational ? 0 : stayTotal,
    foodTotal: isInternational ? 0 : foodTotal,
    localTransportTotal: isInternational ? 0 : localTransportTotal,
    activitiesTotal: isInternational ? 0 : activitiesTotal,
    bufferTotal: isInternational ? 0 : bufferTotal,
    budgetRemaining: isInternational ? budget : budgetRemaining,
    fitsBudget: isInternational ? true : fitsBudget,
    budgetStatus: isInternational ? 'fits' : budgetStatus,
    selectedTransport,
    selectedStay,
    isInternational // New flag for the frontend to show warning
  };
}
