import prisma from './lib/prisma';

async function main() {
  const ip = '127.0.0.1'; // Standard local IP used during testing
  const deleted = await prisma.rateLimit.deleteMany({
    where: {
      OR: [
        { ip: ip },
        { ip: '::1' }
      ]
    }
  });

  console.log(`Successfully cleared ${deleted.count} rate limit records for local IP (${ip} and ::1).`);
  console.log('You can now test the AI itinerary generation normally.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
