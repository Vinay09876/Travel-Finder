import prisma from './lib/prisma';

async function main() {
  const latestItinerary = await prisma.aiItinerary.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (latestItinerary) {
    console.log('Successfully found the latest generated itinerary in DB!');
    console.log('ID:', latestItinerary.id);
    console.log('Created At:', latestItinerary.createdAt);
  } else {
    console.log('No itineraries found!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
