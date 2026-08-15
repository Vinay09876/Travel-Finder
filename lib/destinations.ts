/**
 * STATIC / CURATED APPLICATION DATA (UI Phase)
 * 
 * Note: This data serves as static curated application data for the initial UI phase.
 * It contains realistic travel estimates, sample itineraries, and distance matrices.
 * It is structured to facilitate clean migration into PostgreSQL schemas in the backend phase.
 */
import { Destination, CityOrigin, SearchQuery } from '@/types';
export { calculateTripCost } from './cost-calculator';
export { formatINR } from './utils';


export const POPULAR_CITIES: CityOrigin[] = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Kochi',
];

export const MONTHS = [
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
  'April 2027',
  'May 2027',
  'June 2027',
  'July 2027',
];

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    region: 'West',
    tagline: 'Sun-drenched beaches, Portuguese villas & coastal cuisine',
    shortDescription: 'Golden sandy beaches, vibrant coastal cafes, water sports, and tranquil Portuguese colonial heritage quarters.',
    fullDescription: 'Goa offers the quintessential Indian coastal escape. From the lively shacks of North Goa (Anjuna, Vagator, Calangute) to the pristine, serene beaches of South Goa (Palolem, Agonda, Benaulim), Goa caters seamlessly to budget backpackers and leisurely groups alike. Renting a scooter and exploring coastal lanes, eating fish curry thalis, and catching Arabian Sea sunsets make for an unforgettable affordable holiday.',
    category: 'beach',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['Coastal', 'Nightlife', 'Heritage', 'Relaxed', 'Seafood'],
    bestSeason: 'Oct – Mar (Peak), Jul – Sep (Lush Monsoon)',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'August', 'September'],
    weatherNotes: 'Tropical coastal climate; pleasant evenings from November to February, refreshing greenery during monsoon.',
    distanceKm: {
      Mumbai: 580,
      Pune: 450,
      Bengaluru: 560,
      Hyderabad: 660,
      Delhi: 1850,
      Chennai: 900,
      Kolkata: 2100,
      Ahmedabad: 1100,
      Jaipur: 1650,
      Chandigarh: 2050,
      Kochi: 780,
    },
    transportOptions: {
      Mumbai: [
        { mode: 'train', name: 'Tejas / Konkan Kanya Express (3AC)', durationHours: 9, costPerPersonRoundTrip: 1900, description: 'Scenic Western Ghats railway route with clean berths and meal services.', recommended: true },
        { mode: 'bus', name: 'IntrCity / Neeta AC Sleeper', durationHours: 12, costPerPersonRoundTrip: 1600, description: 'Overnight comfortable multi-axle sleeper bus.', recommended: false },
        { mode: 'flight', name: 'IndiGo / Akasa Air (BOM - GOX)', durationHours: 1.2, costPerPersonRoundTrip: 5200, description: 'Non-stop fast flight to Mopa / Dabolim.', recommended: false }
      ],
      Pune: [
        { mode: 'bus', name: 'Konduskar / Kadamba Volvo AC Sleeper', durationHours: 9.5, costPerPersonRoundTrip: 1400, description: 'Direct overnight sleeper bus via Kolhapur ghats.', recommended: true },
        { mode: 'train', name: 'Goa Express (3AC / Sleeper)', durationHours: 11, costPerPersonRoundTrip: 1500, description: 'Passes directly by Dudhsagar waterfalls.', recommended: false },
        { mode: 'cab', name: 'Self Drive / Shared Carpool', durationHours: 8, costPerPersonRoundTrip: 2400, description: 'Scenic road trip via Anmod Ghat.', recommended: false }
      ],
      Bengaluru: [
        { mode: 'bus', name: 'KSRTC Airavat / GreenLine Sleeper', durationHours: 11, costPerPersonRoundTrip: 1800, description: 'Reliable overnight bus via Hubli / Karwar.', recommended: true },
        { mode: 'train', name: 'Yesvantpur - Vasco Express', durationHours: 14, costPerPersonRoundTrip: 1600, description: 'Affordable overnight sleeper/3AC.', recommended: false },
        { mode: 'flight', name: 'IndiGo Economy Non-stop', durationHours: 1.2, costPerPersonRoundTrip: 4800, description: 'Quick 70-min flight.', recommended: false }
      ],
      Delhi: [
        { mode: 'flight', name: 'IndiGo / SpiceJet Direct (DEL - GOI)', durationHours: 2.5, costPerPersonRoundTrip: 7200, description: 'Direct economy round-trip flight.', recommended: true },
        { mode: 'train', name: 'Goa Sampark Kranti Express (3AC)', durationHours: 26, costPerPersonRoundTrip: 3600, description: 'Long-distance express train for budget travelers.', recommended: false },
        { mode: 'bus', name: 'Connecting Bus via Mumbai', durationHours: 36, costPerPersonRoundTrip: 4200, description: 'Long distance combination.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'bus', name: 'Orange Travels AC Sleeper', durationHours: 13, costPerPersonRoundTrip: 2200, description: 'Comfortable overnight bus via Raichur.', recommended: true },
        { mode: 'train', name: 'Kacheguda - Vasco Express', durationHours: 15, costPerPersonRoundTrip: 1900, description: 'Twice-weekly direct train.', recommended: false },
        { mode: 'flight', name: 'IndiGo / Alliance Air', durationHours: 1.5, costPerPersonRoundTrip: 5500, description: 'Quick direct flight.', recommended: false }
      ],
      Chennai: [
        { mode: 'train', name: 'Chennai Central - Vasco Superfast (3AC)', durationHours: 18, costPerPersonRoundTrip: 2200, description: 'Direct weekly superfast train.', recommended: true },
        { mode: 'flight', name: 'IndiGo Direct Flight', durationHours: 2, costPerPersonRoundTrip: 5900, description: 'Direct flight option.', recommended: false },
        { mode: 'bus', name: 'Connecting sleeper via Bengaluru', durationHours: 17, costPerPersonRoundTrip: 2600, description: 'Two-leg bus connection.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Economy Connecting Flight', durationHours: 4.5, costPerPersonRoundTrip: 8500, description: 'Connecting via Mumbai or Bengaluru.', recommended: true },
        { mode: 'train', name: 'Howrah - Vasco Amaravati Express (3AC)', durationHours: 38, costPerPersonRoundTrip: 3900, description: 'Budget cross-country rail.', recommended: false },
        { mode: 'bus', name: 'Not recommended due to distance', durationHours: 48, costPerPersonRoundTrip: 6000, description: 'Long transit.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'train', name: 'Madgaon Express (3AC)', durationHours: 18, costPerPersonRoundTrip: 2600, description: 'Direct train through Gujarat & Maharashtra.', recommended: true },
        { mode: 'flight', name: 'IndiGo Non-stop', durationHours: 1.8, costPerPersonRoundTrip: 6200, description: 'Direct flight.', recommended: false },
        { mode: 'bus', name: 'Sleeper bus via Mumbai', durationHours: 22, costPerPersonRoundTrip: 3200, description: 'Overnight bus connection.', recommended: false }
      ],
      Jaipur: [
        { mode: 'train', name: 'Marusagar Express (3AC)', durationHours: 25, costPerPersonRoundTrip: 3100, description: 'Direct weekly rail link.', recommended: true },
        { mode: 'flight', name: 'Connecting Flight', durationHours: 3.5, costPerPersonRoundTrip: 7600, description: 'Quick air connection.', recommended: false },
        { mode: 'bus', name: 'Interstate Sleeper via Pune', durationHours: 28, costPerPersonRoundTrip: 4100, description: 'Multi-leg bus.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'flight', name: 'Connecting Flight via Delhi', durationHours: 4, costPerPersonRoundTrip: 8200, description: 'Connecting flight.', recommended: true },
        { mode: 'train', name: 'Goa Sampark Kranti (3AC)', durationHours: 29, costPerPersonRoundTrip: 3800, description: 'Direct long-haul train.', recommended: false },
        { mode: 'bus', name: 'Multi-leg bus', durationHours: 36, costPerPersonRoundTrip: 5000, description: 'Transit connection.', recommended: false }
      ],
      Kochi: [
        { mode: 'train', name: 'Netravati / Ernakulam Express (3AC)', durationHours: 12, costPerPersonRoundTrip: 1800, description: 'Scenic Konkan coast train.', recommended: true },
        { mode: 'bus', name: 'KSRTC SWIFT Sleeper', durationHours: 14, costPerPersonRoundTrip: 1700, description: 'Direct coastal highway bus.', recommended: false },
        { mode: 'flight', name: 'Direct/Connecting flight', durationHours: 1.5, costPerPersonRoundTrip: 4900, description: 'Fast flight.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'Clean Beach Hostel / Guesthouse (Zostel/Bunked)', costPerNightPerRoom: 950, description: 'AC dorm bed or cozy basic room near Anjuna/Vagator with good Wi-Fi and social common areas.' },
      { tier: 'standard_homestay', name: 'Charming Portuguese Homestay or 2-Star Inn', costPerNightPerRoom: 1900, description: 'Private AC double room with attached bath, balcony, and pool or garden access.' },
      { tier: 'comfort_hotel', name: '3-Star Boutique Resort with Pool', costPerNightPerRoom: 3400, description: 'Spacious resort room with complimentary breakfast and quick beach access.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 450,
      standard: 750,
      comfort: 1300
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 450, // per scooter per day + fuel (shared by 2)
      cabs: 1800
    },
    keyActivities: [
      { name: 'Scooter beach hopping (Vagator, Morjim, Arambol)', costPerPerson: 250, tag: 'Sightseeing' },
      { name: 'Aguada Fort & Chapora Dil Chahta Hai Fort Entry', costPerPerson: 100, tag: 'Heritage' },
      { name: 'Mandovi Sunset River Cruise', costPerPerson: 500, tag: 'Experience' },
      { name: 'Kayaking in Sal Backwaters / Watersports', costPerPerson: 600, tag: 'Adventure' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'Arrival, Scooter Pick & North Beach Sunset',
        theme: 'Coastal Vibe & Sea Breezes',
        morning: {
          activity: 'Check-in at hostel/hotel, pick up rented Activa scooter near station/airport',
          description: 'Settle in, freshen up, and grab a quick Goan breakfast of poi bread, omelette, and chai at a local bakery.',
          estimatedCost: 150,
          tip: 'Take photos of the scooter before driving off to document existing scratches.'
        },
        afternoon: {
          activity: 'Authentic Goan Fish Curry Thali lunch & explore Anjuna Flea Market streets',
          description: 'Head to Anand Seafood or Vinayak Family Restaurant in Assagao for fresh Kingfish thali.',
          estimatedCost: 350,
          foodRecommendation: 'Vinayak Family Restaurant, Assagao'
        },
        evening: {
          activity: 'Sunset at Chapora Fort followed by lively beach shack vibes at Vagator',
          description: 'Hike the short trail to Chapora Fort for sweeping views of the Arabian sea, then relax at Curlies or Thalassa area.',
          estimatedCost: 400,
          sunsetSpotOrVibe: 'Chapora Fort Cliff Edge'
        }
      },
      {
        dayNumber: 2,
        title: 'Heritage Old Goa Churches & South Goa Calm',
        theme: 'Culture & Clean Beaches',
        morning: {
          activity: 'Visit Basilica of Bom Jesus and Se Cathedral in Old Goa',
          description: 'Walk through 400-year-old UNESCO world heritage cathedrals with intricate baroque architecture.',
          estimatedCost: 80,
          tip: 'Dress respectfully with shoulders covered when entering active churches.'
        },
        afternoon: {
          activity: 'Fontainhas Latin Quarter photo walk & Portuguese bakery pastries',
          description: 'Stroll through pastel-colored Portuguese villas in Panjim and try fresh Bebinca and coffee at Joseph Bar / Confeitaria 31 De Janeiro.',
          estimatedCost: 280,
          foodRecommendation: 'Confeitaria 31 De Janeiro'
        },
        evening: {
          activity: 'Miramar beach sunset or Mandovi river ferry ride',
          description: 'Catch the twilight ferry breeze or relax with tender coconut on the shoreline.',
          estimatedCost: 200,
          sunsetSpotOrVibe: 'Miramar Boardwalk'
        }
      },
      {
        dayNumber: 3,
        title: 'Morjim Olive Ridley Beach, Watersports & Souvenir Shopping',
        theme: 'Adventure & Memories',
        morning: {
          activity: 'Early morning dolphin sighting or kayaking in Chapora backwaters',
          description: 'Paddle through serene mangroves and coconut groves in calm morning waters.',
          estimatedCost: 500,
          tip: 'Book local water sports at the beach counter rather than through middlemen for best rates.'
        },
        afternoon: {
          activity: 'Relax at Morjim beach shack with fresh juice & cashew nut shopping',
          description: 'Buy authentic Goan cashews, feni, and spices from Mapusa local market at fair wholesale rates.',
          estimatedCost: 400,
          foodRecommendation: 'Burger Factory, Morjim'
        },
        evening: {
          activity: 'Farewell sunset dinner by the Arabian sea and return journey',
          description: 'Drop off scooters, collect luggage, and head to railway station / airport with plenty of time.',
          estimatedCost: 300,
          sunsetSpotOrVibe: 'Arambol Sweet Water Lake Cliff'
        }
      }
    ],
    travelTips: [
      'Renting an automatic scooter (₹350-₹450/day) is 4x cheaper than local taxis.',
      'Always use helmet — Goa police strictly fine helmetless riders on NH66.',
      'Eat at local family-run eateries (Udupi/Goan thalis) rather than fancy beach clubs to cut food spend in half.',
      'Pre-book train tickets on IRCTC 45 days in advance for confirmed 3AC berths.'
    ],
    mustTryFood: ['Goan Fish Curry Thali', 'Chicken Xacuti with Poi', 'Bebinca Layered Cake', 'Pork Vindaloo / Mushroom Xacuti', 'Ros Omelette'],
    importantInfo: {
      safety: 'Very safe for solo and group travelers; avoid swimming in sea during red flag monsoon warnings.',
      connectivity: 'Jio and Airtel have strong 4G/5G across North & South Goa; Vodafone patchy in interior villages.',
      nearestStation: 'Madgaon Junction (MAO) / Thivim (THVM)',
      nearestAirport: 'Manohar International Airport, Mopa (GOX) / Dabolim (GOI)',
      cashNote: 'UPI accepted in 95% of places; keep ₹1,000 cash for beach parking and small shack deposits.'
    }
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    region: 'North',
    tagline: 'The romantic City of Lakes, royal palaces & majestic sunsets',
    shortDescription: 'Gleaming lakefront ghats, 400-year-old Mewar palaces, rooftop sunset cafes, and lively artisan bazaars.',
    fullDescription: 'Udaipur is renowned as one of India’s most picturesque historic cities. Centered around Lake Pichola and Fateh Sagar, it lets budget travelers experience the grandeur of Rajput royalty without luxury prices. Wandering the Old City alleyways, watching the sunset from Ambrai Ghat, visiting City Palace, and sipping masala chai by the water make it a dream weekend getaway.',
    category: 'heritage',
    heroImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['Royalty', 'Lakes', 'Romance', 'Heritage', 'Rajasthani Thali'],
    bestSeason: 'Sep – Mar (Pleasant breezes & festivals)',
    bestMonths: ['September', 'October', 'November', 'December', 'January', 'February', 'March'],
    weatherNotes: 'Pleasant winter days (20°C-25°C) and crisp cool evenings; monsoon transforms Aravalli hills to emerald green.',
    distanceKm: {
      Mumbai: 750,
      Pune: 880,
      Bengaluru: 1400,
      Hyderabad: 1100,
      Delhi: 650,
      Chennai: 1750,
      Kolkata: 1650,
      Ahmedabad: 260,
      Jaipur: 390,
      Chandigarh: 890,
      Kochi: 1900,
    },
    transportOptions: {
      Mumbai: [
        { mode: 'train', name: 'Bandra - Udaipur SF Express (3AC)', durationHours: 15, costPerPersonRoundTrip: 2100, description: 'Comfortable overnight train reaching Udaipur morning.', recommended: true },
        { mode: 'bus', name: 'Shreenath / Eagle AC Sleeper', durationHours: 14, costPerPersonRoundTrip: 1800, description: 'Direct highway sleeper bus.', recommended: false },
        { mode: 'flight', name: 'IndiGo / SpiceJet Direct', durationHours: 1.3, costPerPersonRoundTrip: 6400, description: 'Direct flight to Maharana Pratap Airport.', recommended: false }
      ],
      Delhi: [
        { mode: 'train', name: 'Chetak Express / Mewar Express (3AC)', durationHours: 11.5, costPerPersonRoundTrip: 1700, description: 'Overnight train departing Delhi Sarai Rohilla.', recommended: true },
        { mode: 'bus', name: 'Zingbus / IntrCity Volvo Sleeper', durationHours: 12, costPerPersonRoundTrip: 1500, description: 'Smooth expressway overnight sleeper.', recommended: false },
        { mode: 'flight', name: 'Direct flight (DEL - UDR)', durationHours: 1.2, costPerPersonRoundTrip: 5200, description: 'Fast 75-min flight.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'bus', name: 'GSRTC / Patel Travels AC Seater/Sleeper', durationHours: 5, costPerPersonRoundTrip: 700, description: 'Frequent short 5-hour highway ride through Himatnagar.', recommended: true },
        { mode: 'train', name: 'Asarva - Udaipur Express (3AC)', durationHours: 5.5, costPerPersonRoundTrip: 950, description: 'Brand new broad gauge scenic train.', recommended: false },
        { mode: 'cab', name: 'Self Drive or Shared Cab', durationHours: 4.5, costPerPersonRoundTrip: 1500, description: 'Smooth NH48 highway.', recommended: false }
      ],
      Bengaluru: [
        { mode: 'flight', name: 'Direct/Connecting flight', durationHours: 2.5, costPerPersonRoundTrip: 6800, description: 'Direct IndiGo flight on selected days.', recommended: true },
        { mode: 'train', name: 'Yesvantpur - Ajmer Garib Nawaz (3AC)', durationHours: 32, costPerPersonRoundTrip: 3200, description: 'Weekly express train.', recommended: false },
        { mode: 'bus', name: 'Connecting sleeper via Pune/Ahmedabad', durationHours: 28, costPerPersonRoundTrip: 3800, description: 'Long bus journey.', recommended: false }
      ],
      Pune: [
        { mode: 'train', name: 'Pune - Bhagat Ki Kothi Express', durationHours: 18, costPerPersonRoundTrip: 2200, description: 'Overnight train.', recommended: true },
        { mode: 'bus', name: 'Direct AC Sleeper', durationHours: 16, costPerPersonRoundTrip: 1900, description: 'Overnight bus service.', recommended: false },
        { mode: 'flight', name: 'Connecting flight via Mumbai', durationHours: 4, costPerPersonRoundTrip: 6900, description: 'Air link.', recommended: false }
      ],
      Jaipur: [
        { mode: 'train', name: 'Udaipur City Vande Bharat / Intercity Express', durationHours: 6, costPerPersonRoundTrip: 1300, description: 'Fast premium express train with scenic Aravalli views.', recommended: true },
        { mode: 'bus', name: 'RSRTC Goldline / AC Volvo', durationHours: 7, costPerPersonRoundTrip: 1100, description: 'Hourly state and private buses.', recommended: false },
        { mode: 'cab', name: 'Shared Taxi / Self drive', durationHours: 6, costPerPersonRoundTrip: 1800, description: 'Direct highway.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'train', name: 'Direct / Connecting 3AC via Ahmedabad', durationHours: 24, costPerPersonRoundTrip: 2800, description: 'Comfortable long-haul rail.', recommended: true },
        { mode: 'flight', name: 'Connecting flight', durationHours: 3.5, costPerPersonRoundTrip: 7200, description: 'Quick flight.', recommended: false },
        { mode: 'bus', name: 'Connecting sleeper', durationHours: 26, costPerPersonRoundTrip: 3600, description: 'Bus route.', recommended: false }
      ],
      Chennai: [
        { mode: 'flight', name: 'Connecting flight', durationHours: 4, costPerPersonRoundTrip: 7900, description: 'Air route.', recommended: true },
        { mode: 'train', name: 'Connecting via Surat/Ahmedabad', durationHours: 32, costPerPersonRoundTrip: 3300, description: 'Rail connection.', recommended: false },
        { mode: 'bus', name: 'Connecting bus', durationHours: 34, costPerPersonRoundTrip: 4500, description: 'Long transit.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Connecting flight via Delhi', durationHours: 4.5, costPerPersonRoundTrip: 8100, description: 'Air travel.', recommended: true },
        { mode: 'train', name: 'Ananya Express (3AC)', durationHours: 30, costPerPersonRoundTrip: 3400, description: 'Direct train.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 40, costPerPersonRoundTrip: 5500, description: 'Not recommended.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'train', name: 'Connecting 3AC via Delhi', durationHours: 16, costPerPersonRoundTrip: 2400, description: 'Overnight train combo.', recommended: true },
        { mode: 'bus', name: 'Direct Volvo Sleeper', durationHours: 17, costPerPersonRoundTrip: 2200, description: 'Direct bus.', recommended: false },
        { mode: 'flight', name: 'Connecting flight', durationHours: 3.5, costPerPersonRoundTrip: 7500, description: 'Air option.', recommended: false }
      ],
      Kochi: [
        { mode: 'flight', name: 'Connecting flight', durationHours: 4.5, costPerPersonRoundTrip: 8600, description: 'Fastest connection.', recommended: true },
        { mode: 'train', name: 'Connecting train', durationHours: 36, costPerPersonRoundTrip: 3700, description: 'Long rail.', recommended: false },
        { mode: 'bus', name: 'Multi-leg', durationHours: 40, costPerPersonRoundTrip: 5000, description: 'Not recommended.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'Old City Lakeview Hostel (Zostel/Moustache)', costPerNightPerRoom: 850, description: 'Rooftop lake-facing dorm or private room right next to Gangaur Ghat.' },
      { tier: 'standard_homestay', name: 'Traditional Haveli Guesthouse', costPerNightPerRoom: 1750, description: 'Carved jharokha windows, courtyard seating, and warm Mewari hospitality.' },
      { tier: 'comfort_hotel', name: 'Heritage Boutique Hotel with Rooftop Pool', costPerNightPerRoom: 3200, description: 'Historic architecture with modern plush rooms overlooking Lake Pichola.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 400,
      standard: 700,
      comfort: 1200
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 350,
      cabs: 1400
    },
    keyActivities: [
      { name: 'City Palace Complex Museum Entry', costPerPerson: 350, tag: 'Heritage' },
      { name: 'Lake Pichola Shared Boat Ride at Sunset', costPerPerson: 450, tag: 'Experience' },
      { name: 'Bagore Ki Haveli Dharohar Folk Dance Show', costPerPerson: 150, tag: 'Culture' },
      { name: 'Karni Mata Ropeway Cable Car Ride', costPerPerson: 120, tag: 'Views' },
      { name: 'Fateh Sagar Lake Chowpatty Evening Walk', costPerPerson: 50, tag: 'Local' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'City Palace Grandeur & Sunset at Ambrai Ghat',
        theme: 'Mewari Royalty & Sacred Ghats',
        morning: {
          activity: 'Tour the grand Udaipur City Palace and royal crystal gallery',
          description: 'Marvel at colorful stained glass, mirror mosaics, and sprawling balconies overlooking Lake Pichola.',
          estimatedCost: 350,
          tip: 'Enter right at 9:30 AM before tourist tour buses arrive to avoid long queues.'
        },
        afternoon: {
          activity: 'Traditional Rajasthani Dal Baati Churma lunch at Krishna Dal Bati Restro',
          description: 'Unlimited pure ghee Dal Baati Churma thali served with kadi and spicy garlic chutney.',
          estimatedCost: 280,
          foodRecommendation: 'Krishna Dal Bati Restro, Jal Borg'
        },
        evening: {
          activity: 'Golden hour at Ambrai Ghat and Dharohar Cultural Dance at Bagore Ki Haveli',
          description: 'Watch the sun dip behind the Lake Palace from the marble steps of Ambrai Ghat, followed by the electrifying 7 PM folk dance.',
          estimatedCost: 200,
          sunsetSpotOrVibe: 'Ambrai Ghat Steps'
        }
      },
      {
        dayNumber: 2,
        title: 'Lake Pichola Boat Ride, Jagdish Temple & Saheliyon Ki Bari',
        theme: 'Serene Waters & Mughal Gardens',
        morning: {
          activity: 'Visit historic Jagdish Temple & walk through old artisan silver bazaars',
          description: '350-year-old carved stone Hindu temple bustling with morning spiritual chants and brass bells.',
          estimatedCost: 50,
          tip: 'Bargain gently in Hathi Pol market for miniature Rajput paintings and handcrafted leather journals.'
        },
        afternoon: {
          activity: 'Stroll around Saheliyon-Ki-Bari royal fountains & coffee by Fateh Sagar',
          description: 'Historic garden built for royal maidens with marble elephant fountains and lush lotus pools.',
          estimatedCost: 180,
          foodRecommendation: 'Sukhadia Circle Street Food Pav Bhaji'
        },
        evening: {
          activity: 'Karni Mata Ropeway sunset ride for 360° city panorama',
          description: 'Cable car ride to hilltop shrine with mesmerizing views of illuminated palaces reflected on the lake.',
          estimatedCost: 150,
          sunsetSpotOrVibe: 'Karni Mata Hilltop Platform'
        }
      },
      {
        dayNumber: 3,
        title: 'Monsoon Palace (Sajjangarh) & Lake Pichola Boating',
        theme: 'High Peaks & Farewell Royalty',
        morning: {
          activity: 'Drive up to Sajjangarh Monsoon Palace atop Aravalli hills',
          description: 'Hilltop white marble palace offering sweeping views of the entire Udaipur valley and wildlife sanctuary.',
          estimatedCost: 250,
          tip: 'Take a shared jeep or electric shuttle from the sanctuary base to save cost.'
        },
        afternoon: {
          activity: 'Lake Pichola shared boat ride passing Jag Mandir island',
          description: 'Glide on shimmering waters past the floating Lake Palace and royal bathing ghats.',
          estimatedCost: 450,
          foodRecommendation: 'Jheel’s Ginger Coffee Hut (Rooftop)'
        },
        evening: {
          activity: 'Rooftop cafe dinner overlooking sparkling illuminated ghats',
          description: 'Enjoy Mewari curry or wood-fired pizza under fairy lights with views of the illuminated palace.',
          estimatedCost: 350,
          sunsetSpotOrVibe: 'Gangaur Ghat Waterfront'
        }
      }
    ],
    travelTips: [
      'The Old City streets are too narrow for cars; walk or take shared electric autos (₹20-₹40/seat).',
      'Bagore Ki Haveli Dharohar show tickets sell out by 4 PM; buy your ticket in the afternoon at the counter.',
      'Rooftop cafes near Gangaur Ghat provide 5-star views at standard cafe prices.',
      'Winter evenings get chilly (10°C); pack a light jacket or shawl.'
    ],
    mustTryFood: ['Authentic Dal Baati Churma', 'Laal Maas / Gatta Curry', 'Sukhadia Circle Pav Bhaji', 'Poha & Jalebi at Jagdish Chowk', 'Kulhad Masala Chai at Fateh Sagar'],
    importantInfo: {
      safety: 'Extremely welcoming and tourist-friendly; low crime rate.',
      connectivity: 'Excellent 4G/5G throughout city and lakeside.',
      nearestStation: 'Udaipur City Railway Station (UDZ) — 2.5 km from Lake Pichola.',
      nearestAirport: 'Maharana Pratap Airport, Dabok (UDR) — 24 km from city center.',
      cashNote: 'Digital payments widely accepted in cafes and shops; carry cash for auto-rickshaws and temple offerings.'
    }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North',
    tagline: 'The iconic Pink City, colossal hill forts & bustling street bazaars',
    shortDescription: 'Terracotta pink historic walls, Hawa Mahal honeycomb windows, Amer Fort ramparts, and legendary kachoris.',
    fullDescription: 'Jaipur, the capital of Rajasthan, is an energetic blend of royal antiquity and buzzing modern culture. Part of the famed Golden Triangle, it offers towering hill forts (Amer, Nahargarh, Jaigarh), astronomical wonders at Jantar Mantar, and mouth-watering street delicacies like Pyaz Kachori and Lassi. It is extraordinarily cost-effective for groups traveling from North or West India.',
    category: 'heritage',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['Forts', 'Bazaars', 'Architecture', 'Street Food', 'Culture'],
    bestSeason: 'Oct – Mar (Pleasant sunny days & cool nights)',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    weatherNotes: 'Crisp sunny winter weather (22°C); summer is hot, but monsoon brings scenic misty clouds over Nahargarh Fort.',
    distanceKm: {
      Mumbai: 1150,
      Pune: 1250,
      Bengaluru: 1800,
      Hyderabad: 1450,
      Delhi: 270,
      Chennai: 2000,
      Kolkata: 1500,
      Ahmedabad: 650,
      Jaipur: 0,
      Chandigarh: 500,
      Kochi: 2200,
    },
    transportOptions: {
      Delhi: [
        { mode: 'train', name: 'Ajmer Shatabdi / Vande Bharat Express (Chair Car)', durationHours: 3.5, costPerPersonRoundTrip: 1400, description: 'Superfast express with complimentary morning breakfast.', recommended: true },
        { mode: 'bus', name: 'RSRTC AC Volvo / Zingbus via Delhi-Mumbai Expressway', durationHours: 4.5, costPerPersonRoundTrip: 900, description: 'Smooth non-stop highway bus service.', recommended: false },
        { mode: 'cab', name: 'Self Drive or Carpool via NE4 Expressway', durationHours: 3.8, costPerPersonRoundTrip: 1600, description: 'Fast expressway drive.', recommended: false }
      ],
      Mumbai: [
        { mode: 'train', name: 'Jaipur Superfast / Garib Rath (3AC)', durationHours: 16, costPerPersonRoundTrip: 2200, description: 'Convenient overnight train from Bandra Terminus.', recommended: true },
        { mode: 'flight', name: 'IndiGo / SpiceJet Direct (BOM - JAI)', durationHours: 1.8, costPerPersonRoundTrip: 5400, description: 'Direct flight under 2 hours.', recommended: false },
        { mode: 'bus', name: 'Interstate Sleeper Bus', durationHours: 20, costPerPersonRoundTrip: 2400, description: 'Long bus transit.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'train', name: 'Ashram Express / Yoga Express (3AC)', durationHours: 9, costPerPersonRoundTrip: 1500, description: 'Overnight train arriving early morning.', recommended: true },
        { mode: 'bus', name: 'AC Sleeper Bus via Udaipur', durationHours: 11, costPerPersonRoundTrip: 1200, description: 'Overnight highway bus.', recommended: false },
        { mode: 'flight', name: 'Direct Flight', durationHours: 1.1, costPerPersonRoundTrip: 4600, description: 'Short flight.', recommended: false }
      ],
      Bengaluru: [
        { mode: 'flight', name: 'IndiGo Direct (BLR - JAI)', durationHours: 2.5, costPerPersonRoundTrip: 6900, description: 'Non-stop flight.', recommended: true },
        { mode: 'train', name: 'Jaipur Express (3AC)', durationHours: 40, costPerPersonRoundTrip: 3600, description: 'Long-haul train.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 45, costPerPersonRoundTrip: 4800, description: 'Not recommended.', recommended: false }
      ],
      Pune: [
        { mode: 'train', name: 'Pune - Jaipur SF Express (3AC)', durationHours: 20, costPerPersonRoundTrip: 2400, description: 'Direct train service.', recommended: true },
        { mode: 'flight', name: 'Direct / Connecting flight', durationHours: 2, costPerPersonRoundTrip: 5800, description: 'Air option.', recommended: false },
        { mode: 'bus', name: 'Overnight connecting bus', durationHours: 22, costPerPersonRoundTrip: 2600, description: 'Bus route.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'train', name: 'Jaipur Express (3AC)', durationHours: 28, costPerPersonRoundTrip: 2900, description: 'Direct weekly rail.', recommended: true },
        { mode: 'flight', name: 'IndiGo Direct Flight', durationHours: 2, costPerPersonRoundTrip: 5900, description: 'Direct air link.', recommended: false },
        { mode: 'bus', name: 'Connecting sleeper', durationHours: 30, costPerPersonRoundTrip: 3500, description: 'Long bus.', recommended: false }
      ],
      Chennai: [
        { mode: 'flight', name: 'Direct/Connecting flight', durationHours: 2.8, costPerPersonRoundTrip: 7200, description: 'Air route.', recommended: true },
        { mode: 'train', name: 'Jaipur SF Express (3AC)', durationHours: 36, costPerPersonRoundTrip: 3400, description: 'Direct train.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 42, costPerPersonRoundTrip: 4500, description: 'Long transit.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Direct flight (CCU - JAI)', durationHours: 2.3, costPerPersonRoundTrip: 6800, description: 'Fast flight.', recommended: true },
        { mode: 'train', name: 'Pratham Swatantrata Sangram (3AC)', durationHours: 24, costPerPersonRoundTrip: 2600, description: 'Direct express.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 36, costPerPersonRoundTrip: 4000, description: 'Not recommended.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'train', name: 'Chandigarh - Jaipur Intercity Express (3AC)', durationHours: 8, costPerPersonRoundTrip: 1200, description: 'Direct daytime / overnight train.', recommended: true },
        { mode: 'bus', name: 'Haryana Roadways / Private Volvo', durationHours: 9, costPerPersonRoundTrip: 1000, description: 'Smooth highway bus via Ambala & Delhi.', recommended: false },
        { mode: 'cab', name: 'Self drive via Western Peripheral Expressway', durationHours: 7, costPerPersonRoundTrip: 1700, description: 'Road trip.', recommended: false }
      ],
      Kochi: [
        { mode: 'flight', name: 'Connecting flight', durationHours: 4.5, costPerPersonRoundTrip: 8400, description: 'Air travel.', recommended: true },
        { mode: 'train', name: 'Marusagar Express (3AC)', durationHours: 42, costPerPersonRoundTrip: 3800, description: 'Cross-country train.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 48, costPerPersonRoundTrip: 5500, description: 'Not practical.', recommended: false }
      ],
      Jaipur: [
        { mode: 'cab', name: 'Local transit / Metro', durationHours: 0.5, costPerPersonRoundTrip: 300, description: 'Starting city local transit.', recommended: true },
        { mode: 'bus', name: 'Local Low Floor Bus', durationHours: 0.8, costPerPersonRoundTrip: 100, description: 'City bus.', recommended: false },
        { mode: 'train', name: 'Jaipur Metro Line 1', durationHours: 0.4, costPerPersonRoundTrip: 80, description: 'Metro connection.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'Vibrant Boutique Hostel (Zostel/Hosteller/Moustache)', costPerNightPerRoom: 750, description: 'Clean dorm or private room with social rooftop cafe near MI Road / Station.' },
      { tier: 'standard_homestay', name: 'Traditional Rajasthani Haveli Homestay', costPerNightPerRoom: 1600, description: 'Spacious room with ornate block-print decor, courtyard, and homemade parathas.' },
      { tier: 'comfort_hotel', name: '3-Star Heritage Heritage Hotel with Courtyard', costPerNightPerRoom: 2900, description: 'Colonial Rajput architecture, pool, and curated Rajasthani breakfast.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 350,
      standard: 650,
      comfort: 1100
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 350,
      cabs: 1300
    },
    keyActivities: [
      { name: 'Amer Fort & Sheesh Mahal Entry Ticket', costPerPerson: 100, tag: 'Heritage' },
      { name: 'Sunset from Nahargarh Fort Padao Restaurant Cliff', costPerPerson: 200, tag: 'Sunset' },
      { name: 'Hawa Mahal & Jantar Mantar Composite Pass', costPerPerson: 150, tag: 'Culture' },
      { name: 'Special Lassi at Lassiwala (Since 1944) on MI Road', costPerPerson: 90, tag: 'Food' },
      { name: 'Albert Hall Museum Night Illumination Walk', costPerPerson: 100, tag: 'Photo' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'Hawa Mahal, City Palace & Historic Old City Bazaars',
        theme: 'Pink City Architecture & Spices',
        morning: {
          activity: 'Early morning coffee opposite Hawa Mahal honeycomb facade',
          description: 'Capture morning sunlight hitting the 953 pink sandstone windows from Tattoo Cafe rooftop.',
          estimatedCost: 150,
          tip: 'Visit Hawa Mahal before 9 AM to get photos without heavy street traffic.'
        },
        afternoon: {
          activity: 'City Palace, Jantar Mantar and Rawat Mishthan Bhandar Pyaz Kachori',
          description: 'Explore the royal armory and colossal sundial, then savor piping hot onion kachoris and mawa kachoris.',
          estimatedCost: 350,
          foodRecommendation: 'Rawat Mishthan Bhandar, Station Road'
        },
        evening: {
          activity: 'Bapu Bazaar block print shopping & Lassiwala clay-cup lassi',
          description: 'Shop for Jaipuri quilts, mojari leather shoes, and blue pottery, then drink thick malai lassi.',
          estimatedCost: 250,
          sunsetSpotOrVibe: 'Albert Hall Museum Pigeon Square'
        }
      },
      {
        dayNumber: 2,
        title: 'Amer Fort Splendor, Panna Meena Stepwell & Nahargarh Sunset',
        theme: 'Colossal Forts & Aravalli Ridges',
        morning: {
          activity: 'Explore Amer Fort Sheesh Mahal (Mirror Palace) & Panna Meena Ka Kund',
          description: 'Climb the historic cobblestone ramparts and admire the symmetrical geometric stepwell.',
          estimatedCost: 180,
          tip: 'Hire an official audio guide at the Amer ticket counter for just ₹150 for detailed historical stories.'
        },
        afternoon: {
          activity: 'Jaigarh Fort world’s largest wheeled cannon & Rajasthani Thali lunch',
          description: 'Walk the subterranean secret tunnels connecting Amer and Jaigarh forts.',
          estimatedCost: 300,
          foodRecommendation: '1135 AD or Local Dhaba outside Amer'
        },
        evening: {
          activity: 'Sunset at Nahargarh Fort ramparts overlooking the pink illuminated city',
          description: 'Sit along the iconic fort boundary wall as dusk falls and the entire city below lights up like gold.',
          estimatedCost: 200,
          sunsetSpotOrVibe: 'Nahargarh Fort Sunset Viewpoint'
        }
      },
      {
        dayNumber: 3,
        title: 'Jal Mahal Water Palace & Patrika Gate Heritage Park',
        theme: 'Water Palaces & Modern Heritage',
        morning: {
          activity: 'Morning sunrise walk along Jal Mahal Man Sagar lakefront',
          description: 'Watch migratory birds and morning mist surrounding the 5-story submerged royal summer palace.',
          estimatedCost: 50,
          tip: 'Street vendors sell delicious masala chai and spicy samosas along the promenade.'
        },
        afternoon: {
          activity: 'Photowalk at colorful hand-painted Patrika Gate Jawahar Circle',
          description: 'Walk beneath rainbow-hued painted arches showcasing every region of Rajasthan.',
          estimatedCost: 100,
          foodRecommendation: 'Masala Chowk Open Air Food Court'
        },
        evening: {
          activity: 'Albert Hall Museum illuminated evening light show and farewell dinner',
          description: 'Watch hundreds of pigeons flock around the lit-up Indo-Saracenic palace before departure.',
          estimatedCost: 250,
          sunsetSpotOrVibe: 'Albert Hall Museum Plaza'
        }
      }
    ],
    travelTips: [
      'Buy the Composite Tourist Ticket (₹300 for students/₹400 for adults) covering Amer, Hawa Mahal, Jantar Mantar, Albert Hall and Nahargarh.',
      'Always look for "Lassiwala (Shop 312)" on MI Road — ignore duplicate copycat shops next door.',
      'Auto-rickshaws can be booked easily via Ola / Uber Auto at fixed transparent fares.',
      'Keep your composite ticket receipt safe on your phone or pocket as it is valid for 2 full days.'
    ],
    mustTryFood: ['Rawat Pyaz Kachori', 'Lassiwala Cream Lassi', 'Ghevar from LMB (Laxmi Mishthan Bhandar)', 'Dal Baati with Gatta Curry', 'Pandit Kulfi on Sirah Deori Bazaar'],
    importantInfo: {
      safety: 'Safe for tourists; beware of aggressive touts claiming gem discounts near Hawa Mahal.',
      connectivity: 'Superfast 5G everywhere; reliable across old and new city.',
      nearestStation: 'Jaipur Junction (JP) / Gandhinagar Jaipur (GADJ).',
      nearestAirport: 'Jaipur International Airport (JAI), Sanganer — 12 km from city center.',
      cashNote: 'UPI is ubiquitous even with roadside kachori vendors; small cash handy for parking.'
    }
  },
  {
    id: 'manali',
    name: 'Manali & Old Manali',
    state: 'Himachal Pradesh',
    region: 'North',
    tagline: 'Snow-capped Himalayan peaks, pine forest trails & riverside cafes',
    shortDescription: 'Majestic deodar forests, Beas river rapids, Old Manali wooden cafes, Solang Valley viewpoints, and Atal Tunnel gateway.',
    fullDescription: 'Nestled along the Beas River valley under towering Pir Panjal peaks, Manali is India’s ultimate Himalayan playground. Old Manali offers charming wooden heritage chalets, live music cafes, apple orchards, and relaxed mountain vibes, while Solang Valley and the Atal Tunnel provide instant access to high-altitude snow adventures and breathtaking mountain panoramas.',
    category: 'hills',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['Mountains', 'Snow', 'Riverside', 'Cafes', 'Hiking'],
    bestSeason: 'Oct – Feb (Snow & Winter), Mar – Jun (Pleasant Summer), Aug – Sep (Apple Harvest)',
    bestMonths: ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
    weatherNotes: 'Chilly to freezing in winter (-2°C to 12°C); pleasant spring and summer (15°C to 25°C).',
    distanceKm: {
      Mumbai: 1950,
      Pune: 2050,
      Bengaluru: 2600,
      Hyderabad: 2200,
      Delhi: 530,
      Chennai: 2750,
      Kolkata: 2050,
      Ahmedabad: 1450,
      Jaipur: 790,
      Chandigarh: 280,
      Kochi: 3000,
    },
    transportOptions: {
      Delhi: [
        { mode: 'bus', name: 'HRTC Himsuta / Zingbus AC Volvo Sleeper', durationHours: 13, costPerPersonRoundTrip: 2400, description: 'Direct overnight AC Volvo bus departing Kashmiri Gate / Majnu Ka Tila.', recommended: true },
        { mode: 'train', name: 'Train to Chandigarh (Vande Bharat) + Volvo Bus', durationHours: 10, costPerPersonRoundTrip: 2800, description: 'Fast train to Chandigarh followed by hill bus.', recommended: false },
        { mode: 'flight', name: 'Flight to Bhuntar Airport (KUU) + Taxi', durationHours: 1.5, costPerPersonRoundTrip: 11000, description: 'Direct regional flight into Kullu-Manali airport.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'bus', name: 'HRTC / Private AC Volvo Bus', durationHours: 7.5, costPerPersonRoundTrip: 1600, description: 'Frequent daytime and overnight buses via Kiratpur-Manali four-lane highway.', recommended: true },
        { mode: 'cab', name: 'Self-drive / Shared Cab via 4-lane Highway', durationHours: 6.5, costPerPersonRoundTrip: 2500, description: 'Fast expressway drive through tunnels.', recommended: false },
        { mode: 'train', name: 'No rail line beyond Kiratpur', durationHours: 8, costPerPersonRoundTrip: 1800, description: 'Combo route.', recommended: false }
      ],
      Jaipur: [
        { mode: 'bus', name: 'Direct Volvo Bus or Transit via Delhi', durationHours: 17, costPerPersonRoundTrip: 2900, description: 'Overnight bus connection via Delhi.', recommended: true },
        { mode: 'flight', name: 'Connecting flight via Delhi to Bhuntar', durationHours: 4, costPerPersonRoundTrip: 12500, description: 'Air option.', recommended: false },
        { mode: 'train', name: 'Train to Chandigarh + Bus', durationHours: 15, costPerPersonRoundTrip: 2800, description: 'Train + bus combo.', recommended: false }
      ],
      Mumbai: [
        { mode: 'flight', name: 'Flight to Delhi/Chandigarh + Volvo Bus', durationHours: 16, costPerPersonRoundTrip: 7800, description: 'Flight to Delhi + overnight Volvo bus is the most cost-effective route.', recommended: true },
        { mode: 'train', name: 'Paschim Express to Chandigarh + Bus', durationHours: 32, costPerPersonRoundTrip: 3800, description: 'Budget rail and bus.', recommended: false },
        { mode: 'bus', name: 'Multi-day bus not recommended', durationHours: 40, costPerPersonRoundTrip: 5500, description: 'Not practical.', recommended: false }
      ],
      Bengaluru: [
        { mode: 'flight', name: 'Flight to Delhi/Chandigarh + Volvo Bus', durationHours: 17, costPerPersonRoundTrip: 8600, description: 'Flight to Delhi followed by overnight Volvo bus.', recommended: true },
        { mode: 'train', name: 'Karnataka Express to Delhi + Bus', durationHours: 48, costPerPersonRoundTrip: 4500, description: 'Long rail combo.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 52, costPerPersonRoundTrip: 6500, description: 'Not recommended.', recommended: false }
      ],
      Pune: [
        { mode: 'flight', name: 'Flight to Delhi + Volvo Bus', durationHours: 16, costPerPersonRoundTrip: 7900, description: 'Flight to Delhi followed by Volvo sleeper.', recommended: true },
        { mode: 'train', name: 'Goa Express to Delhi + Bus', durationHours: 38, costPerPersonRoundTrip: 4200, description: 'Rail + Bus combo.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 46, costPerPersonRoundTrip: 5800, description: 'Not recommended.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'flight', name: 'Flight to Delhi + Volvo Bus', durationHours: 16, costPerPersonRoundTrip: 8100, description: 'Flight to Delhi + Volvo bus.', recommended: true },
        { mode: 'train', name: 'Telangana Express to Delhi + Bus', durationHours: 38, costPerPersonRoundTrip: 4300, description: 'Train + Bus.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 48, costPerPersonRoundTrip: 6000, description: 'Not recommended.', recommended: false }
      ],
      Chennai: [
        { mode: 'flight', name: 'Flight to Delhi + Volvo Bus', durationHours: 17, costPerPersonRoundTrip: 8800, description: 'Flight to Delhi + Volvo bus.', recommended: true },
        { mode: 'train', name: 'GT Express to Delhi + Bus', durationHours: 44, costPerPersonRoundTrip: 4600, description: 'Train + Bus.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 50, costPerPersonRoundTrip: 6500, description: 'Not recommended.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Flight to Delhi + Volvo Bus', durationHours: 16, costPerPersonRoundTrip: 8400, description: 'Flight to Delhi + Volvo bus.', recommended: true },
        { mode: 'train', name: 'Rajdhani to Delhi + Bus', durationHours: 30, costPerPersonRoundTrip: 4500, description: 'Train + Bus combo.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 48, costPerPersonRoundTrip: 6200, description: 'Not recommended.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'flight', name: 'Flight to Delhi/Chandigarh + Volvo Bus', durationHours: 16, costPerPersonRoundTrip: 7600, description: 'Flight + Volvo bus.', recommended: true },
        { mode: 'train', name: 'Ashram Express to Delhi + Bus', durationHours: 26, costPerPersonRoundTrip: 3400, description: 'Overnight train + bus.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 38, costPerPersonRoundTrip: 5200, description: 'Not recommended.', recommended: false }
      ],
      Kochi: [
        { mode: 'flight', name: 'Flight to Delhi + Volvo Bus', durationHours: 18, costPerPersonRoundTrip: 9500, description: 'Air + Volvo bus.', recommended: true },
        { mode: 'train', name: 'Kerala Express to Delhi + Bus', durationHours: 52, costPerPersonRoundTrip: 4900, description: 'Rail + Bus.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 60, costPerPersonRoundTrip: 7000, description: 'Not recommended.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'Old Manali Apple Orchard Hostel (Zostel/The Hosteller)', costPerNightPerRoom: 700, description: 'Cozy dorm or wooden room with mountain view balcony, bonfire & cafe.' },
      { tier: 'standard_homestay', name: 'Traditional Himachali Wooden Cottage Homestay', costPerNightPerRoom: 1600, description: 'Warm cedar wood interiors, geyser, home-cooked Siddu and mountain panorama.' },
      { tier: 'comfort_hotel', name: '3-Star Riverside Resort with Valley View', costPerNightPerRoom: 3100, description: 'Balcony overlooking Beas river, buffet breakfast, central heating.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 380,
      standard: 680,
      comfort: 1150
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 450, // Royal Enfield or Activa rental
      cabs: 1700
    },
    keyActivities: [
      { name: 'Hadimba Wooden Temple & Dhungri Van Vihar Walk', costPerPerson: 50, tag: 'Culture' },
      { name: 'Jogini Waterfall Trek from Vashisht Village', costPerPerson: 0, tag: 'Hiking' },
      { name: 'Solang Valley Ropeway & Adventure Sports', costPerPerson: 650, tag: 'Adventure' },
      { name: 'Atal Tunnel & Sissu Lahaul Waterfall Drive', costPerPerson: 600, tag: 'Snow/Lakes' },
      { name: 'Cafe Hopping in Old Manali (Drifters / Cafe 1947)', costPerPerson: 350, tag: 'Vibe' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Manali, Hadimba Forest & Old Manali Cafes',
        theme: 'Deodar Groves & Mountain Acoustics',
        morning: {
          activity: 'Check-in, rent a scooter or mountain bike, visit Hadimba Devi Temple',
          description: 'Walk under colossal 200-foot ancient cedar pines to the 16th-century pagoda-style wooden temple.',
          estimatedCost: 50,
          tip: 'Taste hot walnut and apple cinnamon muffins from nearby bakeries.'
        },
        afternoon: {
          activity: 'Old Manali village walk and riverside wood-fired pizza at Cafe 1947',
          description: 'Sit right by the rushing Manalsu river stream with fresh trout or Margherita pizza.',
          estimatedCost: 350,
          foodRecommendation: 'Cafe 1947 / Drifters Cafe, Old Manali'
        },
        evening: {
          activity: 'Club House Beas riverfront stroll and evening live acoustic music session',
          description: 'Soak in the mountain chill by a bonfire with traveler jam sessions in Old Manali.',
          estimatedCost: 200,
          sunsetSpotOrVibe: 'Old Manali Bridge Stream'
        }
      },
      {
        dayNumber: 2,
        title: 'Solang Valley & Epic Atal Tunnel Drive to Sissu (Lahaul)',
        theme: 'Snow Peaks & High Altitude Wonder',
        morning: {
          activity: 'Drive through the 9-km Atal Tunnel to the stark, magical landscapes of Lahaul Valley',
          description: 'Transition from lush green Manali to dramatic snow-covered Himalayan peaks in Sissu.',
          estimatedCost: 400,
          tip: 'Carry an extra warm jacket — temperatures drop significantly on the north portal of Atal Tunnel.'
        },
        afternoon: {
          activity: 'Sissu Waterfall hike, hot Maggi with mountain chai, & Solang ropeway',
          description: 'Watch the glacial waterfall plunge down sheer rock walls, then ride the Solang cable car.',
          estimatedCost: 550,
          foodRecommendation: 'Lahauli Dhaba near Sissu Lake'
        },
        evening: {
          activity: 'Warm natural sulfur hot springs at Vashisht Temple village',
          description: 'Relax sore muscles in the ancient medicinal natural mineral springs.',
          estimatedCost: 50,
          sunsetSpotOrVibe: 'Vashisht Temple Balcony'
        }
      },
      {
        dayNumber: 3,
        title: 'Jogini Waterfall Pine Trek & Mall Road Souvenirs',
        theme: 'Alpine Waterfalls & Local Flavors',
        morning: {
          activity: 'Scenic 1.5-hour easy trek through apple orchards to cascading Jogini Waterfalls',
          description: 'Walk past traditional Himachali mud-and-wood houses with panoramic views of Beas river below.',
          estimatedCost: 0,
          tip: 'Wear good-grip sports shoes or trekking shoes for wet rock paths.'
        },
        afternoon: {
          activity: 'Try authentic Himachali Siddu (steamed walnut-poppy seed bun) with pure ghee',
          description: 'Local culinary specialty served hot with mint chutney and spicy dal.',
          estimatedCost: 150,
          foodRecommendation: 'Chopsticks Restaurant / Local Siddu Shack'
        },
        evening: {
          activity: 'Mall Road shopping for Kullu wool shawls, apple jams, and boarding evening Volvo',
          description: 'Pick up authentic handwoven woolens and take in the crisp twilight mountain air.',
          estimatedCost: 250,
          sunsetSpotOrVibe: 'Van Vihar Pine Canopy'
        }
      }
    ],
    travelTips: [
      'Overnight Volvo buses from Delhi / Chandigarh drop you right at Manali Private Bus Stand by 8 AM.',
      'Stay in Old Manali (1.5 km uphill from Mall Road) for serene vibes, affordable cafes, and no traffic noise.',
      'Shared cabs to Atal Tunnel and Sissu (₹500-₹700 per seat) save thousands over private taxis.',
      'Avoid high-season taxi scams by booking Himachal Tourism (HPTDC) day tour buses.'
    ],
    mustTryFood: ['Himachali Steamed Siddu', 'Fresh River Trout (Fish Fry)', 'Tibetan Thukpa & Steamed Tingmo', 'Wood-fired thin crust pizza', 'Hot Apple Pie with Custard'],
    importantInfo: {
      safety: 'Safe for all travelers; exercise caution during monsoon landslide alerts in July/August.',
      connectivity: 'Jio and Airtel have solid 4G/5G in Manali and Sissu; BSNL works well.',
      nearestStation: 'Chandigarh Junction (CDG) — 280 km (connected via fast 4-lane expressway).',
      nearestAirport: 'Kullu-Manali Airport, Bhuntar (KUU) — 50 km.',
      cashNote: 'UPI works throughout cafes and shops; carry cash for Sissu rural tea stalls.'
    }
  },
  {
    id: 'gokarna',
    name: 'Gokarna',
    state: 'Karnataka',
    region: 'South',
    tagline: 'Untouched beaches, Om Beach cliff trek & tranquil temple town vibes',
    shortDescription: 'Pristine secluded coves, iconic Om Beach, cliff-side cafe sunsets, Mahabaleshwar temple, and laid-back coastal serenity.',
    fullDescription: 'Gokarna is the chilled-out, unspoiled alternative to commercial beaches. Famous for its dramatic 5-beach cliff trek (Kudle, Om, Half Moon, Paradise, Gokarna Beach), it lets travelers hop from pristine turquoise coves to rustic wooden beach shacks with zero chaos. Extremely popular among students and young professionals seeking tranquility and low costs.',
    category: 'beach',
    heroImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['Beaches', 'Trekking', 'Peaceful', 'Shacks', 'Yoga'],
    bestSeason: 'Oct – Mar (Gentle sea breeze & clear waters)',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    weatherNotes: 'Pleasant warm tropical climate; cool evening sea breezes on Kudle beach.',
    distanceKm: {
      Bengaluru: 490,
      Pune: 540,
      Mumbai: 690,
      Hyderabad: 640,
      Chennai: 820,
      Kochi: 580,
      Delhi: 1950,
      Kolkata: 2000,
      Ahmedabad: 1190,
      Jaipur: 1720,
      Chandigarh: 2150,
    },
    transportOptions: {
      Bengaluru: [
        { mode: 'bus', name: 'KSRTC Airavat Club Class / Sugama AC Sleeper', durationHours: 9.5, costPerPersonRoundTrip: 1700, description: 'Direct overnight sleeper bus dropping at Gokarna town.', recommended: true },
        { mode: 'train', name: 'Panchaganga Superfast Express (3AC)', durationHours: 11, costPerPersonRoundTrip: 1400, description: 'Scenic train route via Western Ghats.', recommended: false },
        { mode: 'cab', name: 'Self Drive via Tumkur - Shimoga Highway', durationHours: 8.5, costPerPersonRoundTrip: 2400, description: 'Smooth road trip.', recommended: false }
      ],
      Pune: [
        { mode: 'bus', name: 'VRL Travels / SRS AC Sleeper', durationHours: 11, costPerPersonRoundTrip: 1800, description: 'Direct overnight sleeper bus on NH66.', recommended: true },
        { mode: 'train', name: 'Train to Gokarna Road (GOK)', durationHours: 12.5, costPerPersonRoundTrip: 1600, description: 'Direct rail option.', recommended: false },
        { mode: 'cab', name: 'Self drive via Kolhapur - Karwar', durationHours: 10, costPerPersonRoundTrip: 2600, description: 'Scenic drive.', recommended: false }
      ],
      Mumbai: [
        { mode: 'train', name: 'Matsyagandha Express (3AC)', durationHours: 12, costPerPersonRoundTrip: 1800, description: 'Direct Konkan railway train stopping at Gokarna Road.', recommended: true },
        { mode: 'bus', name: 'Canara Pinto / VRL AC Sleeper', durationHours: 14, costPerPersonRoundTrip: 2100, description: 'Overnight coastal bus.', recommended: false },
        { mode: 'flight', name: 'Flight to Goa (Dabolim/Mopa) + 3hr Taxi/Train', durationHours: 5, costPerPersonRoundTrip: 6400, description: 'Air + scenic train/cab combo.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'bus', name: 'Orange Travels AC Sleeper', durationHours: 13, costPerPersonRoundTrip: 2200, description: 'Overnight bus via Hubli.', recommended: true },
        { mode: 'train', name: 'Train to Hubli + Connecting KSRTC Bus', durationHours: 14, costPerPersonRoundTrip: 1900, description: 'Budget train + bus.', recommended: false },
        { mode: 'flight', name: 'Flight to Goa + train to Gokarna', durationHours: 6, costPerPersonRoundTrip: 6800, description: 'Air combo.', recommended: false }
      ],
      Chennai: [
        { mode: 'bus', name: 'Connecting sleeper via Bengaluru', durationHours: 15, costPerPersonRoundTrip: 2400, description: 'Two-stage bus.', recommended: true },
        { mode: 'train', name: 'Train to Mangaluru + train to Gokarna', durationHours: 16, costPerPersonRoundTrip: 2000, description: 'Scenic rail.', recommended: false },
        { mode: 'flight', name: 'Flight to Goa + taxi', durationHours: 5.5, costPerPersonRoundTrip: 7200, description: 'Flight combo.', recommended: false }
      ],
      Delhi: [
        { mode: 'flight', name: 'Flight to Goa (GOI/GOX) + Train/Taxi to Gokarna', durationHours: 6, costPerPersonRoundTrip: 7900, description: 'Fly to Goa and take 2.5hr scenic train/cab down south.', recommended: true },
        { mode: 'train', name: 'Goa Sampark Kranti + Local passenger', durationHours: 28, costPerPersonRoundTrip: 3800, description: 'Rail connection.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 38, costPerPersonRoundTrip: 5500, description: 'Not recommended.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Flight to Goa + Train to Gokarna', durationHours: 7, costPerPersonRoundTrip: 8900, description: 'Air + Train combo.', recommended: true },
        { mode: 'train', name: 'Amaravati Express to Hubli + Bus', durationHours: 40, costPerPersonRoundTrip: 4100, description: 'Train connection.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 46, costPerPersonRoundTrip: 6000, description: 'Not practical.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'train', name: 'Direct train to Gokarna Road', durationHours: 20, costPerPersonRoundTrip: 2700, description: 'Direct rail link.', recommended: true },
        { mode: 'flight', name: 'Flight to Goa + Train', durationHours: 5, costPerPersonRoundTrip: 7100, description: 'Air combo.', recommended: false },
        { mode: 'bus', name: 'Sleeper bus via Mumbai', durationHours: 24, costPerPersonRoundTrip: 3400, description: 'Bus route.', recommended: false }
      ],
      Jaipur: [
        { mode: 'train', name: 'Marusagar Express (3AC)', durationHours: 27, costPerPersonRoundTrip: 3200, description: 'Direct weekly train.', recommended: true },
        { mode: 'flight', name: 'Flight to Goa + Train', durationHours: 6, costPerPersonRoundTrip: 8200, description: 'Air option.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 32, costPerPersonRoundTrip: 4500, description: 'Not practical.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'flight', name: 'Flight to Goa + Train to Gokarna', durationHours: 6.5, costPerPersonRoundTrip: 8900, description: 'Flight combo.', recommended: true },
        { mode: 'train', name: 'Long haul train', durationHours: 32, costPerPersonRoundTrip: 4200, description: 'Train.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 40, costPerPersonRoundTrip: 5800, description: 'Not practical.', recommended: false }
      ],
      Kochi: [
        { mode: 'train', name: 'Netravati Express (3AC)', durationHours: 10, costPerPersonRoundTrip: 1500, description: 'Direct coastal train up the Karnataka coast.', recommended: true },
        { mode: 'bus', name: 'KSRTC Sleeper Bus', durationHours: 12, costPerPersonRoundTrip: 1600, description: 'Coastal highway bus.', recommended: false },
        { mode: 'cab', name: 'Drive via NH66', durationHours: 9, costPerPersonRoundTrip: 2400, description: 'Road trip.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'Kudle Beach Hostel / Bamboo Beach Hut (Zostel/Trippr)', costPerNightPerRoom: 750, description: 'Rustic cliff-side dorm or beach bamboo shack overlooking the waves.' },
      { tier: 'standard_homestay', name: 'Cozy Coastal Homestay or AC Cottage', costPerNightPerRoom: 1500, description: 'Private AC cottage among coconut palms within 3-min walk of the sea.' },
      { tier: 'comfort_hotel', name: 'Cliff-top Eco Resort with Ocean View', costPerNightPerRoom: 2800, description: 'Peaceful sea-facing property with swimming pool and curated organic meals.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 380,
      standard: 650,
      comfort: 1050
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 350,
      cabs: 1200
    },
    keyActivities: [
      { name: 'Famous 5-Beach Cliff Trek (Kudle to Paradise Beach)', costPerPerson: 0, tag: 'Trekking' },
      { name: 'Sunset and Nutella banana pancakes at Namaste Cafe (Om Beach)', costPerPerson: 250, tag: 'Food/Sunset' },
      { name: 'Mahabaleshwar Temple & Kotitirtha Sacred Tank Visit', costPerPerson: 50, tag: 'Heritage' },
      { name: 'Boating / Dolphin watching boat ride from Om Beach', costPerPerson: 350, tag: 'Experience' },
      { name: 'Bioluminescence night beach walk (during dark moon phases)', costPerPerson: 0, tag: 'Nature' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Gokarna, Kudle Beach Relax & Sunset Cafe',
        theme: 'Laid-back Sands & Gentle Tides',
        morning: {
          activity: 'Arrive via overnight bus/train, check into Kudle Beach hut/hostel',
          description: 'Sip fresh coconut water, dip your toes in the warm Arabian sea, and enjoy breakfast with an ocean view.',
          estimatedCost: 120,
          tip: 'Kudle beach has no road vehicle access directly on the sand; walk down the 5-minute cliff steps.'
        },
        afternoon: {
          activity: 'Swim in the calm waters of Kudle and savor fresh Israeli shakshuka / seafood thali',
          description: 'Relax on sunbeds under thatched palm roofs with chilled smoothies and fresh grilled fish.',
          estimatedCost: 320,
          foodRecommendation: 'La Pizza Cafe / Ganga Cafe, Kudle Beach'
        },
        evening: {
          activity: 'Golden hour sunset on Kudle cliff followed by acoustic drum circles',
          description: 'Watch the vibrant orange sun sink into the horizon while travelers gather for ambient sunset music.',
          estimatedCost: 150,
          sunsetSpotOrVibe: 'Kudle Viewpoint Cliff'
        }
      },
      {
        dayNumber: 2,
        title: 'Epic 5-Beach Trek: Om, Half Moon & Secluded Paradise Beach',
        theme: 'Coastal Cliff Treks & Turquoise Coves',
        morning: {
          activity: 'Hike from Om Beach across rocky cliff trails to secluded Half Moon and Paradise Beach',
          description: 'Spectacular coastal paths with panoramic views of crashing waves, hidden sea caves, and dolphin pods.',
          estimatedCost: 0,
          tip: 'Start the trek by 7:30 AM before the sun gets intense, and carry 2 liters of water.'
        },
        afternoon: {
          activity: 'Chilled coconut & lunch at Namaste Cafe on Om Beach rocks',
          description: 'Rest on the natural Om-shaped rock formations and enjoy prawn curry with butter garlic naan.',
          estimatedCost: 380,
          foodRecommendation: 'Namaste Cafe, Om Beach'
        },
        evening: {
          activity: 'Sunset boat ride back from Paradise Beach to Om Beach',
          description: 'Hop on a shared wooden fisherman boat with sea spray and evening dolphin sightings.',
          estimatedCost: 300,
          sunsetSpotOrVibe: 'Om Beach Rock Promenade'
        }
      },
      {
        dayNumber: 3,
        title: 'Ancient Mahabaleshwar Temple, Kotitirtha & Mirjan Fort',
        theme: 'Historic Temples & Medieval Fort Ruins',
        morning: {
          activity: 'Visit 4th-century Mahabaleshwar Temple (Atmalinga shrine) and Kotitirtha tank',
          description: 'Experience deep spiritual chanting and intricate Dravidian granite architecture.',
          estimatedCost: 50,
          tip: 'Men are required to remove shirts before entering the inner sanctum of Mahabaleshwar temple.'
        },
        afternoon: {
          activity: 'Drive 20 km to the moss-covered laterite walls of 16th-century Mirjan Fort',
          description: 'Explore overgrown ramparts, secret watchtowers, and lush green grass surrounding the fortress.',
          estimatedCost: 100,
          foodRecommendation: 'Pai Hotel Town (Crispy Dosa & Filter Coffee)'
        },
        evening: {
          activity: 'Main Gokarna beach sunset walk and boarding return overnight bus',
          description: 'Enjoy spicy local pineapple chaat on the shore before catching your return journey.',
          estimatedCost: 180,
          sunsetSpotOrVibe: 'Gokarna Main Beach Shoreline'
        }
      }
    ],
    travelTips: [
      'Gokarna Road (GOK) railway station is 9 km from town; shared autos charge ₹50-₹80 per person.',
      'Paradise Beach is accessible only by foot trek or small boat — keeping it pristine and crowd-free.',
      'Rent a scooter (₹350/day) in town to easily zip between Gokarna town, beaches, and Mirjan Fort.',
      'Always carry cash as beach shacks frequently experience temporary card machine network dropouts.'
    ],
    mustTryFood: ['Nutella Banana Pancakes', 'Fresh Squid & Prawn Butter Garlic', 'Pai Hotel Ghee Roast Dosa', 'Iced Lemon Mint Tea at Kudle', 'Traditional South Indian Banana Leaf Thali'],
    importantInfo: {
      safety: 'Very safe and peaceful; exercise normal caution while cliff trekking on loose gravel.',
      connectivity: 'Jio and Airtel have strong 4G; BSNL works well in town.',
      nearestStation: 'Gokarna Road (GOK) — 9 km / Kumta (KT) — 30 km.',
      nearestAirport: 'Goa Dabolim / Mopa (140 km) or Mangalore International Airport (230 km).',
      cashNote: 'Keep ₹1,500-₹2,000 cash for beach shacks, auto rides, and boat transfers.'
    }
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    region: 'North',
    tagline: 'Yoga capital of the world, emerald Ganga rapids & cliff-side cafes',
    shortDescription: 'White water river rafting, iconic Laxman Jhula bridges, soul-stirring Triveni Ghat Ganga Aarti, and Himalayan foothill cafes.',
    fullDescription: 'Where the emerald Ganges emerges from the Himalayan foothills, Rishikesh blends adrenaline-pumping adventure with profound spiritual calm. Young travelers love its scenic cliff-top cafes, affordable river rafting runs (16km Shivpuri to Rishikesh), bungee jumping, and evening Ganga Aarti ceremonies where hundreds of oil lamps float on sacred waters.',
    category: 'adventure',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['Rafting', 'Spiritual', 'Yoga', 'Riverside Cafes', 'Mountains'],
    bestSeason: 'Sep – Jun (Best for rafting & cafes; avoid Jul-Aug monsoon rafting closure)',
    bestMonths: ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
    weatherNotes: 'Pleasant and breezy; cool winter evenings (8°C) and refreshing river dips.',
    distanceKm: {
      Delhi: 240,
      Chandigarh: 210,
      Jaipur: 510,
      Mumbai: 1650,
      Bengaluru: 2350,
      Pune: 1750,
      Hyderabad: 1800,
      Chennai: 2450,
      Kolkata: 1550,
      Ahmedabad: 1180,
      Kochi: 2800,
    },
    transportOptions: {
      Delhi: [
        { mode: 'train', name: 'Vande Bharat / Jan Shatabdi Express (DEL to Haridwar/Rishikesh)', durationHours: 4.5, costPerPersonRoundTrip: 1300, description: 'Superfast comfortable morning express train directly to Yog Nagari Rishikesh (YNRK).', recommended: true },
        { mode: 'bus', name: 'UTC AC Volvo / Zingbus via Meerut Expressway', durationHours: 5.5, costPerPersonRoundTrip: 950, description: 'Frequent non-stop luxury bus departing ISBT Kashmiri Gate.', recommended: false },
        { mode: 'cab', name: 'Shared Cab / Carpool via Delhi-Dehradun Expressway', durationHours: 4.5, costPerPersonRoundTrip: 1500, description: 'Smooth expressway drive.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'bus', name: 'HRTC / UTC AC Bus', durationHours: 5, costPerPersonRoundTrip: 850, description: 'Direct highway bus via Ambala & Roorkee.', recommended: true },
        { mode: 'train', name: 'Direct Hemkunt Express (3AC)', durationHours: 6, costPerPersonRoundTrip: 1100, description: 'Direct overnight rail option.', recommended: false },
        { mode: 'cab', name: 'Self Drive', durationHours: 4.5, costPerPersonRoundTrip: 1400, description: 'Road trip.', recommended: false }
      ],
      Jaipur: [
        { mode: 'train', name: 'Yoga Express (3AC)', durationHours: 10, costPerPersonRoundTrip: 1600, description: 'Overnight train departing Jaipur Junction directly to Rishikesh.', recommended: true },
        { mode: 'bus', name: 'AC Volvo Sleeper via Delhi', durationHours: 11, costPerPersonRoundTrip: 1400, description: 'Overnight bus connection.', recommended: false },
        { mode: 'flight', name: 'Connecting Flight to Dehradun (DED)', durationHours: 3.5, costPerPersonRoundTrip: 6500, description: 'Flight option.', recommended: false }
      ],
      Mumbai: [
        { mode: 'flight', name: 'Flight to Dehradun (DED) + 35min Taxi/Bus', durationHours: 3, costPerPersonRoundTrip: 7400, description: 'Fly to Jolly Grant Airport (Dehradun) which is just 20 km from Rishikesh.', recommended: true },
        { mode: 'train', name: 'BDTS Haridwar Express (3AC) + Auto', durationHours: 26, costPerPersonRoundTrip: 2900, description: 'Direct train to Haridwar.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 34, costPerPersonRoundTrip: 4500, description: 'Not recommended.', recommended: false }
      ],
      Bengaluru: [
        { mode: 'flight', name: 'IndiGo Direct Flight (BLR - DED) + Taxi', durationHours: 3.2, costPerPersonRoundTrip: 7900, description: 'Direct non-stop flight to Dehradun/Rishikesh airport.', recommended: true },
        { mode: 'train', name: 'Train to Delhi + Vande Bharat', durationHours: 38, costPerPersonRoundTrip: 4200, description: 'Rail combo.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 46, costPerPersonRoundTrip: 6000, description: 'Not practical.', recommended: false }
      ],
      Pune: [
        { mode: 'flight', name: 'Flight to Dehradun / Delhi + Bus', durationHours: 4.5, costPerPersonRoundTrip: 7800, description: 'Air connection.', recommended: true },
        { mode: 'train', name: 'Goa Express to Delhi + train to Haridwar', durationHours: 32, costPerPersonRoundTrip: 3600, description: 'Rail combo.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 40, costPerPersonRoundTrip: 5500, description: 'Not practical.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'flight', name: 'Direct/1-stop Flight to Dehradun (DED)', durationHours: 3.5, costPerPersonRoundTrip: 8100, description: 'Fast flight to Dehradun airport.', recommended: true },
        { mode: 'train', name: 'Train to Delhi + Vande Bharat', durationHours: 32, costPerPersonRoundTrip: 3800, description: 'Rail combo.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 42, costPerPersonRoundTrip: 5800, description: 'Not recommended.', recommended: false }
      ],
      Chennai: [
        { mode: 'flight', name: 'Flight to Dehradun via Delhi', durationHours: 4.5, costPerPersonRoundTrip: 8600, description: 'Air option.', recommended: true },
        { mode: 'train', name: 'Train to Delhi + Bus', durationHours: 40, costPerPersonRoundTrip: 4100, description: 'Rail connection.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 48, costPerPersonRoundTrip: 6200, description: 'Not recommended.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Flight to Dehradun (DED) via Delhi', durationHours: 4, costPerPersonRoundTrip: 8200, description: 'Air link.', recommended: true },
        { mode: 'train', name: 'Doon Express (3AC) to Haridwar', durationHours: 30, costPerPersonRoundTrip: 3200, description: 'Direct long train.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 40, costPerPersonRoundTrip: 5400, description: 'Not practical.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'flight', name: 'Direct Flight to Dehradun (DED)', durationHours: 2, costPerPersonRoundTrip: 6900, description: 'Direct non-stop air route.', recommended: true },
        { mode: 'train', name: 'Yoga Express to Rishikesh (3AC)', durationHours: 22, costPerPersonRoundTrip: 2400, description: 'Direct rail link.', recommended: false },
        { mode: 'bus', name: 'Connecting bus', durationHours: 26, costPerPersonRoundTrip: 3200, description: 'Bus route.', recommended: false }
      ],
      Kochi: [
        { mode: 'flight', name: 'Flight to Dehradun via Bengaluru/Delhi', durationHours: 5, costPerPersonRoundTrip: 9200, description: 'Fastest air route.', recommended: true },
        { mode: 'train', name: 'Long train', durationHours: 48, costPerPersonRoundTrip: 4600, description: 'Rail.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 54, costPerPersonRoundTrip: 6800, description: 'Not practical.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'Tapovan / Laxman Jhula Riverside Hostel (Zostel/Skyard)', costPerNightPerRoom: 650, description: 'Clean dorm bed or private room with rooftop yoga deck and Ganges river view.' },
      { tier: 'standard_homestay', name: 'Serene Ganga View Homestay / Boutique Inn', costPerNightPerRoom: 1550, description: 'AC private room with balcony, home-cooked organic meals, and quiet garden.' },
      { tier: 'comfort_hotel', name: '3-Star Riverside Wellness Resort', costPerNightPerRoom: 2900, description: 'Private Ganga beach access, morning guided yoga classes, and buffet dining.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 350,
      standard: 620,
      comfort: 1050
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 350, // Activa rental or shared Vikram autos
      cabs: 1300
    },
    keyActivities: [
      { name: '16-km White Water River Rafting (Shivpuri to NIM Beach)', costPerPerson: 750, tag: 'Adventure' },
      { name: 'Triveni Ghat Evening Maha Ganga Aarti with Floating Diyas', costPerPerson: 50, tag: 'Spiritual' },
      { name: 'The Beatles Ashram (Chaurasi Kutia) Art & Meditation Walk', costPerPerson: 150, tag: 'Culture' },
      { name: 'Neer Garh Waterfall Trek & Natural Pool Dip', costPerPerson: 50, tag: 'Nature' },
      { name: 'Little Buddha Cafe / Freedom Cafe riverside organic dining', costPerPerson: 300, tag: 'Vibe' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Tapovan, Suspension Bridges & Ganga Aarti',
        theme: 'River Breezes & Sacred Chants',
        morning: {
          activity: 'Arrive at Tapovan, rent a scooter, cross Ram Jhula and explore ghats',
          description: 'Sip cold-pressed juices and try avocado sourdough toast at a river-facing treehouse cafe.',
          estimatedCost: 150,
          tip: 'Tapovan is the best hub for travelers with the greatest concentration of cafes and hostels.'
        },
        afternoon: {
          activity: 'Visit Beatles Ashram (Chaurasi Kutia) graffiti dome ruins in Rajaji forest',
          description: 'Walk through geodesic meditation domes covered in vibrant pop-art and transcendental quotes.',
          estimatedCost: 150,
          foodRecommendation: 'Little Buddha Cafe / Bistro Nirvana'
        },
        evening: {
          activity: 'Witness the soul-stirring Triveni Ghat Ganga Aarti with brass lamps',
          description: 'Sit on ancient stone steps as priests chant Vedic mantras and hundreds of flower lamps float downstream.',
          estimatedCost: 50,
          sunsetSpotOrVibe: 'Triveni Ghat Sacred Steps'
        }
      },
      {
        dayNumber: 2,
        title: 'Thrilling 16-km River Rafting & Cliff Jumping in Shivpuri',
        theme: 'Adrenaline on the Rapids',
        morning: {
          activity: '16-km White Water Rafting conquering Roller Coaster and Golf Course Grade-III rapids',
          description: 'Experience exhilarating splashes in ice-cold turquoise waters, body surfing, and 20-foot cliff jumping.',
          estimatedCost: 750,
          tip: 'Leave your phone and wallet in the guide’s waterproof dry bag or locker at the base.'
        },
        afternoon: {
          activity: 'Hot Maggi, ginger lemon honey tea, and Neer Garh Waterfall hike',
          description: 'Hike 2 km up into the green hills to cool natural limestone plunge pools.',
          estimatedCost: 150,
          foodRecommendation: 'Ganga View Cafe / Rajasthani Thali in Tapovan'
        },
        evening: {
          activity: 'Sunset meditation at Parmarth Niketan Ghat and live sitar music in cafe',
          description: 'Watch the dusk mist settle over the Himalayan valley with peaceful instrumental music.',
          estimatedCost: 200,
          sunsetSpotOrVibe: 'Parmarth Niketan River Steps'
        }
      },
      {
        dayNumber: 3,
        title: 'Morning Yoga, Secret Waterfall & Boarding Return Journey',
        theme: 'Rejuvenation & Mountain Peace',
        morning: {
          activity: 'Sunrise rooftop hatha yoga class overlooking the Ganges',
          description: 'Invigorating breathing and movement session with certified Himalayan yoga instructors.',
          estimatedCost: 200,
          tip: 'Many hostels offer complimentary morning yoga sessions for guests.'
        },
        afternoon: {
          activity: 'Garhwali local lunch at Chotiwala Restaurant & souvenir shopping',
          description: 'Try traditional Mandua ki Roti, Kafuli spinach curry, and buy brass singing bowls or Rudraksha beads.',
          estimatedCost: 280,
          foodRecommendation: 'Chotiwala Restaurant (Since 1958), Ram Jhula'
        },
        evening: {
          activity: 'Final evening chai by the river and boarding return train/bus',
          description: 'Dip your feet into the holy waters one last time before departing with unforgettable memories.',
          estimatedCost: 100,
          sunsetSpotOrVibe: 'Shatrughan Ghat Riverside'
        }
      }
    ],
    travelTips: [
      'Book river rafting directly with licensed Uttarakhand Tourism approved operators in Tapovan for the best price (₹600-₹800).',
      'Alcohol and non-vegetarian food are strictly prohibited in the municipal temple zones of Rishikesh.',
      'Shared Vikram autos charge just ₹20 per person between Ram Jhula, Laxman Jhula, and Rishikesh market.',
      'Dehradun Jolly Grant Airport is just 35 minutes away; share a cab for ₹400-₹500.'
    ],
    mustTryFood: ['Garhwali Thali (Kafuli & Jhangora Kheer)', 'Wood-fired thin crust pizza at Little Buddha', 'Cold pressed smoothies & vegan bowls', 'Crispy Kachori at Haridwar bypass', 'Masala Lemon Soda by the ghats'],
    importantInfo: {
      safety: 'Extremely safe and hospitable; always wear life jackets during river rafting.',
      connectivity: 'Superfast 5G throughout Tapovan and Laxman Jhula.',
      nearestStation: 'Yog Nagari Rishikesh (YNRK) / Haridwar Junction (HW) — 24 km.',
      nearestAirport: 'Dehradun Jolly Grant Airport (DED) — 20 km.',
      cashNote: 'UPI works everywhere from rafting agencies to riverside fruit vendors.'
    }
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry (Puducherry)',
    state: 'Puducherry',
    region: 'South',
    tagline: 'French colonial quarters, bougainvillea streets & peaceful beaches',
    shortDescription: 'Pastel-yellow French villas, seaside promenade sunsets, Auroville spiritual community, and French croissants.',
    fullDescription: 'Pondicherry offers a unique Franco-Tamil heritage unlike anywhere else in India. Walking or cycling through the tree-lined White Town grid with vibrant mustard-yellow heritage facades, sipping cafe au lait with warm croissants, meditating at the golden Matrimandir in Auroville, and feeling the spray on the Rock Beach Promenade make it a tranquil coastal getaway.',
    category: 'beach',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['French Culture', 'Beaches', 'Pastries', 'Auroville', 'Cycling'],
    bestSeason: 'Oct – Mar (Gentle sea breeze & balmy evenings)',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    weatherNotes: 'Pleasant tropical breeze during winter; summer is warm and humid.',
    distanceKm: {
      Chennai: 150,
      Bengaluru: 310,
      Hyderabad: 780,
      Kochi: 520,
      Pune: 1100,
      Mumbai: 1250,
      Delhi: 2350,
      Kolkata: 1800,
      Ahmedabad: 1750,
      Jaipur: 2200,
      Chandigarh: 2550,
    },
    transportOptions: {
      Chennai: [
        { mode: 'bus', name: 'PRTC / SETC AC Deluxe via East Coast Road (ECR)', durationHours: 3.2, costPerPersonRoundTrip: 600, description: 'Scenic coastal highway bus running right along the Bay of Bengal.', recommended: true },
        { mode: 'train', name: 'Chennai Egmore - Puducherry Express', durationHours: 3.8, costPerPersonRoundTrip: 500, description: 'Daily direct passenger / express train.', recommended: false },
        { mode: 'cab', name: 'Self Drive / Shared Cab via ECR', durationHours: 2.8, costPerPersonRoundTrip: 1400, description: 'Scenic drive past Mahabalipuram.', recommended: false }
      ],
      Bengaluru: [
        { mode: 'bus', name: 'KSRTC Airavat / Greenline AC Sleeper', durationHours: 6.5, costPerPersonRoundTrip: 1400, description: 'Overnight / daytime luxury bus via Krishnagiri and Tiruvannamalai.', recommended: true },
        { mode: 'train', name: 'Yesvantpur - Puducherry Express', durationHours: 8.5, costPerPersonRoundTrip: 1100, description: 'Direct weekly train.', recommended: false },
        { mode: 'cab', name: 'Self Drive Road Trip', durationHours: 6, costPerPersonRoundTrip: 2200, description: 'Smooth highway drive.', recommended: false }
      ],
      Hyderabad: [
        { mode: 'bus', name: 'Orange / TSRTC AC Sleeper', durationHours: 14, costPerPersonRoundTrip: 2400, description: 'Direct overnight sleeper bus.', recommended: true },
        { mode: 'train', name: 'Direct Train to Puducherry (PDY)', durationHours: 17, costPerPersonRoundTrip: 1800, description: 'Direct weekly train.', recommended: false },
        { mode: 'flight', name: 'Fly to Chennai + 3hr ECR Bus', durationHours: 5, costPerPersonRoundTrip: 5800, description: 'Air + bus connection.', recommended: false }
      ],
      Mumbai: [
        { mode: 'flight', name: 'Fly to Chennai (MAA) + 3hr ECR Bus', durationHours: 5, costPerPersonRoundTrip: 6200, description: 'Quick flight to Chennai followed by scenic ECR coastal bus.', recommended: true },
        { mode: 'train', name: 'Puducherry Express (3AC)', durationHours: 30, costPerPersonRoundTrip: 2800, description: 'Direct long-distance train from Dadar.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 32, costPerPersonRoundTrip: 4200, description: 'Not recommended.', recommended: false }
      ],
      Delhi: [
        { mode: 'flight', name: 'Fly to Chennai (MAA) + 3hr ECR Bus', durationHours: 5.5, costPerPersonRoundTrip: 7100, description: 'Non-stop flight to Chennai followed by ECR bus.', recommended: true },
        { mode: 'train', name: 'Puducherry Express from NDLS (3AC)', durationHours: 38, costPerPersonRoundTrip: 3600, description: 'Direct express rail.', recommended: false },
        { mode: 'bus', name: 'Not practical', durationHours: 42, costPerPersonRoundTrip: 5500, description: 'Not recommended.', recommended: false }
      ],
      Pune: [
        { mode: 'flight', name: 'Fly to Chennai + ECR Bus', durationHours: 5, costPerPersonRoundTrip: 6400, description: 'Air + Bus route.', recommended: true },
        { mode: 'train', name: 'Puducherry Express (3AC)', durationHours: 26, costPerPersonRoundTrip: 2500, description: 'Direct train.', recommended: false },
        { mode: 'bus', name: 'Connecting bus via Bengaluru', durationHours: 20, costPerPersonRoundTrip: 3000, description: 'Bus route.', recommended: false }
      ],
      Kolkata: [
        { mode: 'flight', name: 'Fly to Chennai + ECR Bus', durationHours: 5, costPerPersonRoundTrip: 6800, description: 'Direct flight to Chennai + quick ECR bus.', recommended: true },
        { mode: 'train', name: 'Puducherry Express (3AC)', durationHours: 32, costPerPersonRoundTrip: 3100, description: 'Direct rail.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 38, costPerPersonRoundTrip: 4800, description: 'Not practical.', recommended: false }
      ],
      Ahmedabad: [
        { mode: 'flight', name: 'Fly to Chennai + ECR Bus', durationHours: 5.5, costPerPersonRoundTrip: 7200, description: 'Flight + Bus combo.', recommended: true },
        { mode: 'train', name: 'Direct train (3AC)', durationHours: 36, costPerPersonRoundTrip: 3400, description: 'Direct train.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 40, costPerPersonRoundTrip: 5000, description: 'Not practical.', recommended: false }
      ],
      Jaipur: [
        { mode: 'flight', name: 'Fly to Chennai + ECR Bus', durationHours: 6, costPerPersonRoundTrip: 7600, description: 'Air + bus route.', recommended: true },
        { mode: 'train', name: 'Connecting train', durationHours: 38, costPerPersonRoundTrip: 3500, description: 'Rail.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 42, costPerPersonRoundTrip: 5200, description: 'Not recommended.', recommended: false }
      ],
      Chandigarh: [
        { mode: 'flight', name: 'Fly to Chennai + ECR Bus', durationHours: 6.5, costPerPersonRoundTrip: 8400, description: 'Air route.', recommended: true },
        { mode: 'train', name: 'Long train', durationHours: 42, costPerPersonRoundTrip: 4100, description: 'Train.', recommended: false },
        { mode: 'bus', name: 'Not recommended', durationHours: 48, costPerPersonRoundTrip: 5900, description: 'Not recommended.', recommended: false }
      ],
      Kochi: [
        { mode: 'train', name: 'Direct / Connecting train via Villupuram', durationHours: 12, costPerPersonRoundTrip: 1600, description: 'Comfortable overnight train.', recommended: true },
        { mode: 'bus', name: 'KSRTC Sleeper Bus', durationHours: 11, costPerPersonRoundTrip: 1500, description: 'Direct inter-state bus.', recommended: false },
        { mode: 'cab', name: 'Drive via Coimbatore', durationHours: 9, costPerPersonRoundTrip: 2400, description: 'Road trip.', recommended: false }
      ]
    },
    stayOptions: [
      { tier: 'budget_hostel', name: 'White Town French Villa Hostel (Moustache/Ostello)', costPerNightPerRoom: 750, description: 'Heritage building bunk bed or private room with vintage courtyard and cycles.' },
      { tier: 'standard_homestay', name: 'Charming Franco-Tamil Heritage Guesthouse', costPerNightPerRoom: 1650, description: 'High ceilings, teakwood furniture, bougainvillea balcony, 5-min walk to Rock Beach.' },
      { tier: 'comfort_hotel', name: '3-Star Colonial Boutique Hotel with Pool', costPerNightPerRoom: 3100, description: 'Restored 18th-century French mansion with pool and gourmet courtyard cafe.' }
    ],
    dailyFoodCostPerPerson: {
      budget: 400,
      standard: 700,
      comfort: 1200
    },
    dailyLocalTransportCost: {
      scooterOrAuto: 350, // Vintage bicycle (₹100) or automatic scooter (₹350)
      cabs: 1300
    },
    keyActivities: [
      { name: 'Rent a vintage bicycle & cycle through White Town', costPerPerson: 100, tag: 'Sightseeing' },
      { name: 'Visit Auroville Matrimandir viewing point & bakery', costPerPerson: 0, tag: 'Spiritual' },
      { name: 'Evening breeze & gelato walk on Promenade Beach (Rock Beach)', costPerPerson: 150, tag: 'Vibe' },
      { name: 'Eden Beach Blue Flag certified tranquil sands', costPerPerson: 50, tag: 'Beach' },
      { name: 'French Croissant & Cafe Au Lait at Baker’s Street / Coromandel Cafe', costPerPerson: 300, tag: 'Food' }
    ],
    sampleItinerary: [
      {
        dayNumber: 1,
        title: 'White Town Heritage Cycle, French Cafes & Rock Beach Sunset',
        theme: 'Colonial Elegance & Sea Breeze',
        morning: {
          activity: 'Pick up rented pastel bicycle, cycle past yellow mustard French villas and Notre Dame des Anges church',
          description: 'Admire French street names (Rue Dumas, Rue Romain Rolland) lined with flowering bougainvillea.',
          estimatedCost: 100,
          tip: 'Motor vehicles are banned on the Promenade Beach road every evening from 6 PM to 7:30 AM.'
        },
        afternoon: {
          activity: 'Gourmet French lunch and artisanal pastries at Baker’s Street or Cafe des Arts',
          description: 'Try fresh butter croissants, quiche lorraine, and passionfruit iced tea.',
          estimatedCost: 350,
          foodRecommendation: 'Baker’s Street / Cafe des Arts, White Town'
        },
        evening: {
          activity: 'Rock Beach Promenade golden hour sunset and authentic Italian gelato',
          description: 'Walk along the 1.5-km seaside stone promenade gazing out into the twilight Bay of Bengal.',
          estimatedCost: 180,
          sunsetSpotOrVibe: 'Rock Beach Promenade Gandhi Statue'
        }
      },
      {
        dayNumber: 2,
        title: 'Auroville Spiritual Community & Serenity Beach Surfing',
        theme: 'Universal Harmony & Atlantic Waves',
        morning: {
          activity: 'Visit the Golden Matrimandir globe viewing point and quiet shaded forest amphitheater',
          description: 'Walk through red-earth pine paths into the international experimental township of peace.',
          estimatedCost: 0,
          tip: 'Pre-book Matrimandir inner chamber meditation pass 3 days in advance online if you wish to enter the crystal room.'
        },
        afternoon: {
          activity: 'Wood-fired organic pizza at Tanto Pizzeria & surfing at Serenity Beach',
          description: 'Authentic Italian pizza made with fresh herbs grown in Auroville farms.',
          estimatedCost: 400,
          foodRecommendation: 'Tanto Pizzeria, Auroville Road'
        },
        evening: {
          activity: 'Auroville Bakery espresso and French cheese tasting',
          description: 'Fresh baguettes, sourdough breads, and homemade ice cream in a shaded garden.',
          estimatedCost: 150,
          sunsetSpotOrVibe: 'Serenity Beach Rock Pier'
        }
      },
      {
        dayNumber: 3,
        title: 'Sri Aurobindo Ashram, Paradise Beach & Tamil Quarter Delicacies',
        theme: 'Spiritual Peace & Pristine Sandbars',
        morning: {
          activity: 'Visit tranquil Sri Aurobindo Ashram flower samadhi and handmade paper factory',
          description: 'Experience deep quietude in the tree-shaded courtyard fragrant with fresh jasmine and marigold.',
          estimatedCost: 0,
          tip: 'Silence must be maintained inside the Ashram courtyard.'
        },
        afternoon: {
          activity: 'Boat ferry through Chunnambar backwaters to golden Paradise Beach',
          description: 'Cruise past mangrove islands to the isolated clean sandbar beach with calm waters.',
          estimatedCost: 300,
          foodRecommendation: 'Surguru Spot (Crispy Ghee Roast Dosa & Filter Coffee)'
        },
        evening: {
          activity: 'Farewell sunset coffee at Coromandel Cafe and boarding return bus/train',
          description: 'Dine in a restored heritage courtyard surrounded by fairy lights and lush monstera plants.',
          estimatedCost: 320,
          sunsetSpotOrVibe: 'Chunnambar Backwater Estuary'
        }
      }
    ],
    travelTips: [
      'Rent a vintage gearless bicycle (₹100/day) — White Town is flat, scenic, and best experienced at cycling pace.',
      'From Chennai Airport, direct shared cabs and ECR buses take just 2.5 to 3 hours.',
      'Pondicherry has lower union territory liquor taxes; beach cafes offer great beverage value.',
      'Auroville is 12 km from White Town; take an automatic scooter (₹350/day) for easy movement.'
    ],
    mustTryFood: ['Pain Au Chocolat & Warm Croissants', 'Wood-fired Pizza at Tanto', 'Coromandel Cafe Avocado Toast', 'Surguru Chettinad Masala Dosa', 'Fresh Sea Bass Steak with Lemon Butter'],
    importantInfo: {
      safety: 'Very safe and peaceful; highly popular with solo female travelers and backpackers.',
      connectivity: 'Airtel and Jio 5G work seamlessly across town and Auroville.',
      nearestStation: 'Puducherry Railway Station (PDY) — 1 km from White Town / Villupuram (VM) — 38 km.',
      nearestAirport: 'Puducherry Airport (PNY) / Chennai International (MAA) — 140 km.',
      cashNote: 'Digital payments and UPI accepted in 98% of cafes, boutique shops, and hotels.'
    }
  }
];

export const DESTINATIONS = DESTINATIONS_DATA;

export const DEFAULT_SEARCH_QUERY: SearchQuery = {
  fromCity: 'Mumbai',
  budget: 10000,
  travelers: 2,
  durationDays: 3,
  month: 'August 2026',
  stayTier: 'standard_homestay',
  transportPreference: 'all',
};

