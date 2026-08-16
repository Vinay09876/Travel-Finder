import prisma from './lib/prisma';

async function main() {
  const result = await prisma.rateLimit.deleteMany({
    where: {
      OR: [
        { ip: '::1' },
        { ip: '127.0.0.1' },
        { ip: '127.0.0.2' },
        { ip: '127.0.0.3' },
        { userId: 'anon' },
        { userId: 'user-test' },
        { userId: 'user-test2' },
        { userId: 'user-test3' },
        { userId: { startsWith: 'travelFinder_anon_userId' } }
      ]
    }
  });
  
  console.log(`Deleted ${result.count} rate limit records for local testing IPs/UserIDs.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
