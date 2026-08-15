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
  console.log('Testing specific scenarios for calculation parity...\n');

  const testCases: { destId: string; query: SearchQuery }[] = [
    {
      destId: 'goa',
      query: { fromCity: 'Mumbai', budget: 15000, travelers: 2, durationDays: 3, month: 'August', category: 'all' }
    },
    {
      destId: 'udaipur',
      query: { fromCity: 'Mumbai', budget: 20000, travelers: 4, durationDays: 5, month: 'October', category: 'all' }
    },
    {
      destId: 'jaipur',
      query: { fromCity: 'Mumbai', budget: 10000, travelers: 1, durationDays: 2, month: 'December', category: 'all', stayTier: 'budget_hostel' }
    },
    {
      destId: 'manali',
      query: { fromCity: 'Mumbai', budget: 35000, travelers: 3, durationDays: 7, month: 'January', category: 'all', transportPreference: 'flight' }
    }
  ];

  for (const tc of testCases) {
    const staticDest = DESTINATIONS_DATA.find(d => d.id === tc.destId)!;
    
    const dbDest = await prisma.destination.findUnique({
      where: { id: tc.destId },
      include: {
        transportRoutes: true,
        accommodations: true,
        costMultiplier: true,
        activities: true,
        itineraryDays: true
      }
    });

    if (!dbDest) {
      console.error(`Missing DB destination: ${tc.destId}`);
      continue;
    }

    const mappedDbDest = mapPrismaToDestination(dbDest);
    
    const staticCost = calculateTripCost(staticDest, tc.query);
    const dbCost = calculateTripCost(mappedDbDest, tc.query);
    
    console.log(`Scenario: Mumbai -> ${staticDest.name} | ${tc.query.travelers} travelers | ${tc.query.durationDays} days`);
    console.log(`Static Result : Total = ${staticCost.totalEstimatedCost}, Budget Status = ${staticCost.budgetStatus}`);
    console.log(`DB Result     : Total = ${dbCost.totalEstimatedCost}, Budget Status = ${dbCost.budgetStatus}`);
    
    if (JSON.stringify(staticCost) === JSON.stringify(dbCost)) {
      console.log('✅ MATCH');
    } else {
      console.log('❌ MISMATCH');
      console.log('Diff:', JSON.stringify(staticCost), JSON.stringify(dbCost));
    }
    console.log('---');
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
