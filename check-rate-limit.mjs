import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const windowStart = new Date(Date.now() - 3600000); // 1 hour ago
  
  const allRecords = await prisma.rateLimit.findMany({
    where: {
      endpoint: '/api/ai-itinerary',
      createdAt: { gte: windowStart }
    }
  });

  const ipCounts = {};
  const userCounts = {};

  for (const record of allRecords) {
    if (record.ip) ipCounts[record.ip] = (ipCounts[record.ip] || 0) + 1;
    if (record.userId) userCounts[record.userId] = (userCounts[record.userId] || 0) + 1;
  }

  console.log('--- RATE LIMIT INVESTIGATION ---');
  console.log('Total valid records in last hour:', allRecords.length);
  
  console.log('\nIP COUNTS:');
  for (const [ip, count] of Object.entries(ipCounts)) {
    console.log(`- IP: ${ip} | Count: ${count} / 20`);
  }

  console.log('\nUSER COUNTS:');
  for (const [user, count] of Object.entries(userCounts)) {
    console.log(`- User: ${user} | Count: ${count} / 5`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
