import { calculateHaversineDistance, ORIGIN_COORDS } from './lib/distance';
import { calculateTripCost } from './lib/cost-calculator';
import { Destination, SearchQuery } from './types';

// Mock Munnar destination missing transportOptions to trigger algorithmic logic
const munnar: Destination = {
  id: 'munnar',
  name: 'Munnar',
  state: 'Kerala',
  region: 'South',
  lat: 10.0889,
  lng: 77.0595,
  source: 'dynamic',
  tagline: 'Tea gardens and misty hills.',
  shortDescription: '...',
  fullDescription: '...',
  category: 'hills',
  heroImage: '',
  galleryImages: [],
  vibe: ['hills'],
  bestSeason: 'Winter',
  bestMonths: ['Dec'],
  weatherNotes: 'Cool',
  // transportOptions omitted
  stayOptions: [{ tier: 'standard_homestay', name: 'Homestay', costPerNightPerRoom: 1500, description: '' }],
  dailyFoodCostPerPerson: { budget: 500, standard: 1000, comfort: 2000 },
  dailyLocalTransportCost: { scooterOrAuto: 400, cabs: 1500 },
  keyActivities: [{ name: 'Tea Museum', costPerPerson: 150, tag: 'culture' }],
  sampleItinerary: [],
  travelTips: [],
  mustTryFood: [],
  importantInfo: { safety: '', connectivity: '', nearestStation: '', nearestAirport: '', cashNote: '' }
};

const queryMumbai: SearchQuery = {
  fromCity: 'Mumbai',
  budget: 20000,
  travelers: 2,
  durationDays: 4,
  month: 'Oct'
};

const queryHyderabad: SearchQuery = {
  fromCity: 'Hyderabad',
  budget: 20000,
  travelers: 2,
  durationDays: 4,
  month: 'Oct'
};

console.log("=== Mumbai to Munnar ===");
const costMum = calculateTripCost(munnar, queryMumbai);
console.log("Transport Option Chosen:", costMum.selectedTransport);

console.log("\n=== Hyderabad to Munnar ===");
const costHyd = calculateTripCost(munnar, queryHyderabad);
console.log("Transport Option Chosen:", costHyd.selectedTransport);
