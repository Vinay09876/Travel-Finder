export type CityOrigin = 
  | 'Mumbai'
  | 'Delhi'
  | 'Bengaluru'
  | 'Pune'
  | 'Hyderabad'
  | 'Chennai'
  | 'Kolkata'
  | 'Ahmedabad'
  | 'Jaipur'
  | 'Chandigarh'
  | 'Kochi';

export type TravelCategory = 'all' | 'beach' | 'heritage' | 'hills' | 'adventure' | 'weekend';

export type StayTier = 'budget_hostel' | 'standard_homestay' | 'comfort_hotel';

export type TransportPreference = 'all' | 'train' | 'bus' | 'flight' | 'drive' | 'cab';

export type TripVibe = 'relaxed' | 'active' | 'foodie' | 'culture' | 'budget_saver';

export interface SearchQuery {
  fromCity: CityOrigin;
  budget: number; // in INR (Total for group)
  travelers: number;
  durationDays: number;
  month: string;
  category?: TravelCategory;
  stayTier?: StayTier;
  transportPreference?: TransportPreference;
}

export interface TransportOption {
  mode: 'train' | 'bus' | 'flight' | 'cab';
  name: string; // e.g. "Konkan Kanya Express (3AC)", "Zingbus AC Sleeper"
  durationHours: number;
  costPerPersonRoundTrip: number;
  description: string;
  recommended: boolean;
}

export interface StayOption {
  tier: StayTier;
  name: string; // e.g. "Clean Beachside Hostel / Guesthouse"
  costPerNightPerRoom: number; // Assuming 2 travelers per room or dorm bed
  description: string;
}

export interface ActivityItem {
  name: string;
  costPerPerson: number;
  tag: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  morning: {
    activity: string;
    description: string;
    estimatedCost: number;
    tip?: string;
  };
  afternoon: {
    activity: string;
    description: string;
    estimatedCost: number;
    foodRecommendation?: string;
  };
  evening: {
    activity: string;
    description: string;
    estimatedCost: number;
    sunsetSpotOrVibe?: string;
  };
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'International';
  lat?: number;
  lng?: number;
  source?: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: TravelCategory;
  heroImage: string;
  galleryImages: string[];
  vibe: string[];
  bestSeason: string;
  bestMonths: string[];
  weatherNotes: string;
  distanceKm?: Record<CityOrigin, number>;
  transportOptions?: Record<CityOrigin, TransportOption[]>;
  stayOptions: StayOption[];
  dailyFoodCostPerPerson: {
    budget: number;
    standard: number;
    comfort: number;
  };
  dailyLocalTransportCost: {
    scooterOrAuto: number;
    cabs: number;
  };
  keyActivities: ActivityItem[];
  sampleItinerary: ItineraryDay[];
  travelTips: string[];
  mustTryFood: string[];
  importantInfo: {
    safety: string;
    connectivity: string;
    nearestStation: string;
    nearestAirport: string;
    cashNote: string;
  };
}

export type BudgetStatus = 'fits' | 'near' | 'over';

export interface CalculatedCost {
  totalEstimatedCost: number;
  perPersonCost: number;
  transportTotal: number;
  stayTotal: number;
  foodTotal: number;
  localTransportTotal: number;
  activitiesTotal: number;
  bufferTotal: number;
  budgetRemaining: number;
  fitsBudget: boolean;
  budgetStatus: BudgetStatus;
  selectedTransport: TransportOption;
  selectedStay?: StayOption;
  isInternational?: boolean;
}

export interface SavedTrip {
  destinationId: string;
  savedAt: string;
  searchSnapshot: SearchQuery;
}
