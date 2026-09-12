/**
 * Batch-populates Supabase with destinations across every Indian state, using the
 * same OpenStreetMap + Gemini enrichment pipeline as the live "search anywhere"
 * feature (lib/generate-destination.ts). Run manually or on a schedule — not part
 * of the app runtime.
 *
 * Progress is self-tracked in scripts/.batch-progress.json, so running with no
 * arguments always continues from wherever the last run left off (e.g. after
 * hitting Gemini's daily free-tier quota). Delete that file to start over.
 *
 * Usage:
 *   npx tsx scripts/batch-generate-destinations.ts                 (continue from saved progress)
 *   npx tsx scripts/batch-generate-destinations.ts --start=10       (override start index)
 *   npx tsx scripts/batch-generate-destinations.ts --limit=5        (cap how many to process this run)
 *   npx tsx scripts/batch-generate-destinations.ts --state="Kerala" (only one state, ignores progress file)
 *
 * Runs sequentially with a delay between each place to stay within the Overpass
 * API's public usage policy (no concurrent/rapid-fire requests) and Gemini's
 * rate limits. Stops itself early if it detects consecutive quota/rate-limit
 * errors, since Gemini's free tier resets daily — retrying immediately won't help.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { INDIA_PLACES } from './india-places';
import { generateDestination } from '../lib/generate-destination';
import prisma from '../lib/prisma';

const DELAY_MS = 4000;
const MAX_CONSECUTIVE_QUOTA_ERRORS = 2;
const DB_WARMUP_RETRIES = 5;
const DB_WARMUP_DELAY_MS = 6000;
const PROGRESS_FILE = path.join(__dirname, '.batch-progress.json');

/**
 * Supabase's free-tier database pauses when idle and takes a few seconds to
 * wake on the next connection. A scheduled run can land right on that cold
 * start, so ping the DB with retries before starting the batch instead of
 * crashing on the very first destination.
 */
async function waitForDatabase(): Promise<boolean> {
  for (let attempt = 1; attempt <= DB_WARMUP_RETRIES; attempt++) {
    try {
      await prisma.destination.count();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`Database not ready yet (attempt ${attempt}/${DB_WARMUP_RETRIES}): ${message}`);
      if (attempt < DB_WARMUP_RETRIES) {
        await sleep(DB_WARMUP_DELAY_MS);
      }
    }
  }
  return false;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isQuotaOrRateLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('resource_exhausted') ||
    lower.includes('429') ||
    lower.includes('too many requests')
  );
}

function readProgress(): number {
  try {
    const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return typeof data.nextIndex === 'number' ? data.nextIndex : 0;
  } catch {
    return 0;
  }
}

function writeProgress(nextIndex: number) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ nextIndex, updatedAt: new Date().toISOString() }, null, 2));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: { start?: number; limit?: number; state?: string } = {};
  for (const arg of args) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (key === 'start') opts.start = parseInt(value, 10);
    if (key === 'limit') opts.limit = parseInt(value, 10);
    if (key === 'state') opts.state = value;
  }
  return opts;
}

async function main() {
  const dbReady = await waitForDatabase();
  if (!dbReady) {
    console.error(`\nDatabase unreachable after ${DB_WARMUP_RETRIES} attempts. Skipping this run — progress is unchanged, next scheduled run will retry.`);
    process.exit(1);
  }

  const { start, limit, state } = parseArgs();

  let places = INDIA_PLACES;
  const usingProgressFile = !state && start === undefined;
  const effectiveStart = start ?? (usingProgressFile ? readProgress() : 0);

  if (state) {
    places = places.filter((p) => p.state.toLowerCase() === state.toLowerCase());
    if (places.length === 0) {
      console.error(`No places found for state "${state}". Check scripts/india-places.ts for valid state names.`);
      process.exit(1);
    }
  }

  if (usingProgressFile && effectiveStart >= places.length) {
    console.log(`All ${places.length} destinations have already been processed (per ${PROGRESS_FILE}). Nothing to do.`);
    console.log('Delete the progress file to start over, or pass --start=0 to force a re-run.');
    process.exit(0);
  }

  const slice = places.slice(effectiveStart, limit ? effectiveStart + limit : undefined);

  console.log(`Starting batch generation for ${slice.length} destination(s), beginning at index ${effectiveStart}...\n`);

  const summary = { created: 0, cached: 0, failed: 0 };
  const failures: { name: string; error: string }[] = [];
  let consecutiveQuotaErrors = 0;
  let stoppedEarlyAt: number | null = null;
  let lastProcessedIndex = effectiveStart - 1;

  for (let i = 0; i < slice.length; i++) {
    const place = slice[i];
    const absoluteIndex = effectiveStart + i;
    const progress = `[${absoluteIndex + 1}/${places.length}]`;
    process.stdout.write(`${progress} ${place.name} (${place.state})... `);

    const result = await generateDestination({
      destinationName: place.name,
      lat: place.lat,
      lng: place.lng,
      country: 'India',
      state: place.state,
    });

    lastProcessedIndex = absoluteIndex;

    if (result.status === 'created') {
      console.log('created');
      summary.created++;
      consecutiveQuotaErrors = 0;
    } else if (result.status === 'cached') {
      console.log('already exists, skipped');
      summary.cached++;
      consecutiveQuotaErrors = 0;
    } else {
      console.log(`FAILED — ${result.error}`);
      summary.failed++;
      failures.push({ name: place.name, error: result.error });

      if (isQuotaOrRateLimitError(result.error)) {
        consecutiveQuotaErrors++;
        if (consecutiveQuotaErrors >= MAX_CONSECUTIVE_QUOTA_ERRORS) {
          console.log(
            `\nStopping early: ${consecutiveQuotaErrors} consecutive failures look like a Gemini quota/rate-limit error, not a one-off place issue.`
          );
          console.log('Gemini free-tier quota resets daily — retrying immediately will not help.');
          // Don't advance past the destinations that failed due to quota — retry them on the next run.
          lastProcessedIndex = absoluteIndex - 1;
          stoppedEarlyAt = absoluteIndex - consecutiveQuotaErrors + 1;
          break;
        }
      } else {
        consecutiveQuotaErrors = 0;
      }
    }

    if (usingProgressFile) {
      writeProgress(lastProcessedIndex + 1);
    }

    if (i < slice.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n--- Batch Generation Summary ---');
  console.log(`Created: ${summary.created}`);
  console.log(`Already existed: ${summary.cached}`);
  console.log(`Failed: ${summary.failed}`);

  if (failures.length > 0) {
    console.log('\nFailed destinations:');
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
  }

  if (stoppedEarlyAt !== null) {
    console.log(`\nBatch stopped early due to quota/rate-limit errors.`);
    if (usingProgressFile) {
      console.log(`Progress saved — next run will automatically resume from index ${stoppedEarlyAt}.`);
    } else {
      console.log(`Resume later with: npx tsx scripts/batch-generate-destinations.ts --start=${stoppedEarlyAt}`);
    }
  } else if (usingProgressFile && lastProcessedIndex + 1 >= places.length) {
    console.log('\nAll destinations in scripts/india-places.ts have now been processed.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Batch generation script crashed:', err);
  process.exit(1);
});
