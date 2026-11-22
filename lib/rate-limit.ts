import crypto from 'crypto';
import prisma from '@/lib/prisma';

/**
 * Checks and records a rate-limit hit atomically. The count-then-insert is
 * done as a single SQL statement (a CTE that counts existing rows in the
 * window and only inserts if under the limit) so Postgres enforces
 * atomicity itself — no held transaction/connection, so this stays cheap
 * under concurrent bursts instead of risking connection-pool exhaustion.
 */
export async function checkRateLimit(...args: Parameters<typeof checkRateLimitStrict>) {
  try {
    await checkRateLimitStrict(...args);
  } catch (err) {
    if (err instanceof Error && err.message.endsWith('RATE_LIMIT_EXCEEDED')) throw err;
    // Fail open on infrastructure errors (DB unreachable/slow): rate limiting
    // is abuse protection, not a reason to take down endpoints like geocode
    // that don't otherwise need the database. Endpoints that do need the DB
    // will still fail on their own queries.
    console.error(`[rate-limit] Check failed for ${args[2]}, allowing request:`, err instanceof Error ? err.message : err);
  }
}

async function checkRateLimitStrict(
  ip: string,
  userId: string,
  endpoint: string,
  maxPerIp: number,
  maxPerUser: number,
  windowMs: number
) {
  const windowStart = new Date(Date.now() - windowMs);

  // Cleanup of old records is not part of the correctness-critical path —
  // run it in the background so it never adds latency to the request.
  void prisma.rateLimit.deleteMany({
    where: {
      endpoint,
      createdAt: { lt: windowStart }
    }
  }).catch((e: unknown) => console.error('RateLimit cleanup error:', e));

  // Atomically: count existing rows for this IP+endpoint in the window, and
  // only insert a new row if under maxPerIp. Returns the inserted row's id
  // if it inserted, or zero rows if the limit was already reached — a
  // single statement, so no other concurrent request can observe a stale
  // "under limit" count between the check and the insert.
  const newId = crypto.randomUUID();
  const ipInsert = await prisma.$queryRaw<{ id: string }[]>`
    WITH ip_count AS (
      SELECT COUNT(*)::int AS cnt FROM "RateLimit"
      WHERE ip = ${ip} AND endpoint = ${endpoint} AND "createdAt" >= ${windowStart}
    )
    INSERT INTO "RateLimit" (id, ip, "userId", endpoint, "createdAt")
    SELECT ${newId}, ${ip}, ${userId}, ${endpoint}, now()
    FROM ip_count WHERE cnt < ${maxPerIp}
    RETURNING id
  `;

  if (ipInsert.length === 0) {
    throw new Error('IP_RATE_LIMIT_EXCEEDED');
  }

  // The IP-limit insert above already recorded this hit. Now verify the
  // per-user limit wasn't exceeded; if it was, roll back the row we just
  // inserted so it doesn't count towards future windows for either limit.
  const userCount = await prisma.rateLimit.count({
    where: { userId, endpoint, createdAt: { gte: windowStart } }
  });

  if (userCount > maxPerUser) {
    await prisma.rateLimit.delete({ where: { id: ipInsert[0].id } }).catch(() => {});
    throw new Error('USER_RATE_LIMIT_EXCEEDED');
  }
}
