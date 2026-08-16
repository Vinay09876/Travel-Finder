import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import { DESTINATIONS_DATA } from './lib/destinations';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Testing Database Parity Structure...\n');

  const dbDestinations = await prisma.destination.findMany({
    include: {
      transportRoutes: true,
      accommodations: true,
      costMultiplier: true,
      activities: true,
      itineraryDays: true
    }
  });

  console.log(`Static Data Count: ${DESTINATIONS_DATA.length}`);
  console.log(`Database Count: ${dbDestinations.length}`);

  let hasMismatches = false;

  for (const staticDest of DESTINATIONS_DATA) {
    const dbDest = dbDestinations.find(d => d.id === staticDest.id);
    if (!dbDest) {
      console.error(`Missing DB destination: ${staticDest.id}`);
      hasMismatches = true;
      continue;
    }

    // Check transport options
    const staticTransportCount = Object.values(staticDest.transportOptions || {}).flat().length;
    if (staticTransportCount !== dbDest.transportRoutes.length) {
      console.error(`Mismatch transport: ${staticDest.id} (Static: ${staticTransportCount}, DB: ${dbDest.transportRoutes.length})`);
      hasMismatches = true;
    }

    // Check accommodations
    if (staticDest.stayOptions.length !== dbDest.accommodations.length) {
      console.error(`Mismatch accommodations: ${staticDest.id}`);
      hasMismatches = true;
    }

    // Check activities
    if (staticDest.keyActivities.length !== dbDest.activities.length) {
      console.error(`Mismatch activities: ${staticDest.id}`);
      hasMismatches = true;
    }

    // Check itinerary days
    if (staticDest.sampleItinerary.length !== dbDest.itineraryDays.length) {
      console.error(`Mismatch itinerary days: ${staticDest.id}`);
      hasMismatches = true;
    }
  }

  if (!hasMismatches) {
    console.log('✅ Structure Parity Check Passed: All nested records match in length.');
  } else {
    console.log('❌ Structure Parity Check Failed.');
  }
}

main().catch(console.error).finally(() => {
  prisma.$disconnect();
  pool.end();
});
