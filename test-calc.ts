import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import { DESTINATIONS_DATA } from './lib/destinations';
import { mapPrismaToDestination } from './lib/db-mapper';
import { calculateTripCost } from './lib/cost-calculator';
import { SearchQuery } from './types';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Testing Database Parity...');
  
  const dbDestinations = await prisma.destination.findMany({
    include: {
      transportRoutes: true,
      accommodations: true,
      costMultiplier: true,
      activities: true,
      itineraryDays: true
    }
  });

  const query: SearchQuery = {
    fromCity: 'Mumbai',
    budget: 10000,
    travelers: 2,
    durationDays: 3,
    month: 'August',
    category: 'all',
  };

  let allMatch = true;

  for (const staticDest of DESTINATIONS_DATA) {
    const dbDest = dbDestinations.find(d => d.id === staticDest.id);
    if (!dbDest) {
      console.error(`Missing DB destination: ${staticDest.id}`);
      allMatch = false;
      continue;
    }

    const mappedDbDest = mapPrismaToDestination(dbDest);
    
    // Compare costs
    const staticCost = calculateTripCost(staticDest, query);
    const dbCost = calculateTripCost(mappedDbDest, query);
    
    if (JSON.stringify(staticCost) !== JSON.stringify(dbCost)) {
      console.error(`Cost mismatch for ${staticDest.id}`);
      console.error('Static:', staticCost);
      console.error('DB:', dbCost);
      allMatch = false;
    } else {
      console.log(`✅ ${staticDest.name} - Exact Match! Total: ₹${dbCost.totalEstimatedCost} Status: ${dbCost.budgetStatus}`);
    }
  }

  if (allMatch) {
    console.log('🎉 All destinations and cost calculations match perfectly!');
  } else {
    console.error('❌ Parity verification failed!');
  }
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
