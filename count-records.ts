import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const destCount = await prisma.destination.count();
  const routeCount = await prisma.transportRoute.count();
  const accCount = await prisma.accommodation.count();
  const actCount = await prisma.activity.count();
  const itinCount = await prisma.curatedItineraryDay.count();
  
  console.log(`Destinations: ${destCount}`);
  console.log(`Transport Routes: ${routeCount}`);
  console.log(`Accommodations: ${accCount}`);
  console.log(`Activities: ${actCount}`);
  console.log(`Itinerary Days: ${itinCount}`);
}

main().catch(console.error).finally(() => {
  prisma.$disconnect();
  pool.end();
});
