import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import { DESTINATIONS_DATA } from '../lib/destinations';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.savedTrip.deleteMany();
  await prisma.aiItinerary.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  // Create a default user for testing
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  for (const dest of DESTINATIONS_DATA) {
    console.log(`Seeding destination: ${dest.name}`);
    
    // Create base destination
    await prisma.destination.create({
      data: {
        id: dest.id,
        name: dest.name,
        state: dest.state,
        region: dest.region,
        tagline: dest.tagline,
        shortDescription: dest.shortDescription,
        fullDescription: dest.fullDescription,
        category: dest.category,
        heroImage: dest.heroImage,
        galleryImages: dest.galleryImages,
        vibe: dest.vibe,
        bestSeason: dest.bestSeason,
        bestMonths: dest.bestMonths,
        weatherNotes: dest.weatherNotes,
        distanceKm: dest.distanceKm as any,
        infoSafety: dest.importantInfo.safety,
        infoConnectivity: dest.importantInfo.connectivity,
        infoNearestStation: dest.importantInfo.nearestStation,
        infoNearestAirport: dest.importantInfo.nearestAirport,
        infoCashNote: dest.importantInfo.cashNote,
        travelTips: dest.travelTips,
        mustTryFood: dest.mustTryFood,
        
        // Nested creations
        costMultiplier: {
          create: {
            foodBudget: dest.dailyFoodCostPerPerson.budget,
            foodStandard: dest.dailyFoodCostPerPerson.standard,
            foodComfort: dest.dailyFoodCostPerPerson.comfort,
            localScooterOrAuto: dest.dailyLocalTransportCost.scooterOrAuto,
            localCabs: dest.dailyLocalTransportCost.cabs,
          }
        },
        
        accommodations: {
          create: dest.stayOptions.map(opt => ({
            tier: opt.tier,
            name: opt.name,
            costPerNightPerRoom: opt.costPerNightPerRoom,
            description: opt.description
          }))
        },
        
        activities: {
          create: dest.keyActivities.map(act => ({
            name: act.name,
            costPerPerson: act.costPerPerson,
            tag: act.tag
          }))
        },
        
        itineraryDays: {
          create: dest.sampleItinerary.map(day => ({
            dayNumber: day.dayNumber,
            title: day.title,
            theme: day.theme,
            morningActivity: day.morning.activity,
            morningDescription: day.morning.description,
            morningCost: day.morning.estimatedCost,
            morningTip: day.morning.tip,
            afternoonActivity: day.afternoon.activity,
            afternoonDescription: day.afternoon.description,
            afternoonCost: day.afternoon.estimatedCost,
            afternoonFoodRec: day.afternoon.foodRecommendation,
            eveningActivity: day.evening.activity,
            eveningDescription: day.evening.description,
            eveningCost: day.evening.estimatedCost,
            eveningSunsetSpot: day.evening.sunsetSpotOrVibe,
          }))
        }
      }
    });

    // Transport routes (since it's a Record<string, array> we loop)
    for (const [originCity, routes] of Object.entries(dest.transportOptions)) {
      for (const route of routes) {
        await prisma.transportRoute.create({
          data: {
            destinationId: dest.id,
            originCity,
            mode: route.mode,
            name: route.name,
            durationHours: route.durationHours,
            costPerPersonRoundTrip: route.costPerPersonRoundTrip,
            description: route.description,
            recommended: route.recommended,
          }
        });
      }
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
