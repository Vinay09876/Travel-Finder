import prisma from '@/lib/prisma';

export async function checkRateLimit(
  ip: string,
  userId: string,
  endpoint: string,
  maxPerIp: number,
  maxPerUser: number,
  windowMs: number
) {
  const windowStart = new Date(Date.now() - windowMs);

  // Run cleanup of old records for this endpoint in the background (fire and forget)
  prisma.rateLimit.deleteMany({
    where: {
      endpoint,
      createdAt: { lt: windowStart }
    }
  }).catch((e: unknown) => console.error('RateLimit cleanup error:', e));

  // Check IP limit
  const ipCount = await prisma.rateLimit.count({
    where: {
      ip,
      endpoint,
      createdAt: { gte: windowStart }
    }
  });

  if (ipCount >= maxPerIp) {
    throw new Error('IP_RATE_LIMIT_EXCEEDED');
  }

  // Check User limit
  const userCount = await prisma.rateLimit.count({
    where: {
      userId,
      endpoint,
      createdAt: { gte: windowStart }
    }
  });

  if (userCount >= maxPerUser) {
    throw new Error('USER_RATE_LIMIT_EXCEEDED');
  }

  // Insert new record
  await prisma.rateLimit.create({
    data: {
      ip,
      userId,
      endpoint
    }
  });
}
