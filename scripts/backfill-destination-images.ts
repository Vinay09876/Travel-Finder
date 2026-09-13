/**
 * Backfills real Unsplash images for destinations still on the generic
 * fallback photo (from before lib/image-provider.ts was wired up to the
 * Unsplash API). Safe to re-run — only touches destinations whose heroImage
 * still matches the generic fallback marker.
 *
 * Respects Unsplash's free-tier rate limit (50 requests/hour): stops
 * immediately the moment a rate-limit response is hit (rather than treating
 * it as "no photo found" for every remaining destination), so re-running
 * later picks up cleanly on whatever destinations are still generic.
 *
 * Usage:
 *   npx tsx scripts/backfill-destination-images.ts
 *   npx tsx scripts/backfill-destination-images.ts --limit=5   (process only the first 5, for testing)
 */
import 'dotenv/config';
import prisma from '../lib/prisma';
import { getDestinationImage, UnsplashRateLimitError } from '../lib/image-provider';

const GENERIC_MARKER = '1506744038136';
const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: { limit?: number } = {};
  for (const arg of args) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (key === 'limit') opts.limit = parseInt(value, 10);
  }
  return opts;
}

async function main() {
  const { limit } = parseArgs();

  const allDestinations = await prisma.destination.findMany({
    where: {
      source: 'dynamic',
      heroImage: { contains: GENERIC_MARKER },
    },
    select: { id: true, name: true, state: true },
    orderBy: { id: 'asc' },
  });

  const destinations = limit ? allDestinations.slice(0, limit) : allDestinations;

  if (destinations.length === 0) {
    console.log('No destinations need a hero image backfill. Nothing to do.');
    process.exit(0);
  }

  console.log(`Found ${destinations.length} destination(s) still on the generic fallback image.\n`);

  let updated = 0;
  let stillGeneric = 0;
  let failed = 0;
  let stoppedForRateLimit = false;

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    process.stdout.write(`[${i + 1}/${destinations.length}] ${dest.name} (${dest.state})... `);

    try {
      const newImage = await getDestinationImage(dest.name, dest.state);

      if (newImage.includes(GENERIC_MARKER)) {
        console.log('no better image found, left as-is');
        stillGeneric++;
      } else {
        await prisma.destination.update({
          where: { id: dest.id },
          data: { heroImage: newImage },
        });
        console.log('updated');
        updated++;
      }
    } catch (err) {
      if (err instanceof UnsplashRateLimitError) {
        console.log(`RATE LIMITED — ${err.message}`);
        console.log('\nStopping immediately: Unsplash rate limit hit, every remaining request would fail the same way.');
        console.log('Re-run this script in about an hour once the free-tier limit resets.');
        stoppedForRateLimit = true;
        break;
      }

      const message = err instanceof Error ? err.message : String(err);
      console.log(`FAILED — ${message}`);
      failed++;
    }

    if (i < destinations.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n--- Backfill Summary ---');
  console.log(`Updated: ${updated}`);
  console.log(`No better image found: ${stillGeneric}`);
  console.log(`Failed: ${failed}`);
  if (stoppedForRateLimit) {
    console.log('Stopped early due to rate limiting — re-run later to continue.');
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Backfill script crashed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
