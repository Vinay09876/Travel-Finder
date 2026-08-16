import prisma from '../lib/prisma';

async function main() {
  const dest = await prisma.destination.findUnique({
    where: { id: 'hyderabad' },
    include: { itineraryDays: true }
  });

  if (!dest) {
    console.log("Hyderabad not found in DB");
    return;
  }

  const activities = new Set<string>();
  for (const day of dest.itineraryDays) {
    activities.add(day.morningActivity);
    activities.add(day.afternoonActivity);
    activities.add(day.eveningActivity);
  }

  console.log("POI names used in itinerary:");
  activities.forEach(a => console.log(`- ${a}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
