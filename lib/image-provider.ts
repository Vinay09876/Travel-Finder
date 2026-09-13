/**
 * Image Provider — Unsplash API integration.
 *
 * Searches Unsplash for a photo matching the destination name/state, falling
 * back to a small curated list (for well-known cities where a specific,
 * hand-picked photo reads better than a search result) and finally to a
 * generic placeholder if the API is unavailable.
 *
 * A rate-limit response (403/429, free tier: 50 requests/hour) is NOT treated
 * as "no photo found" — it's thrown as UnsplashRateLimitError so callers (e.g.
 * the batch backfill script) can distinguish "this place has no good photo"
 * from "we've been cut off and every subsequent call will fail the same way."
 */

const FALLBACK_DESTINATION_IMAGES: Record<string, string> = {
  // India
  bengaluru: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80',
  hyderabad: 'https://images.unsplash.com/photo-1629853921200-5c62d0426f8d?auto=format&fit=crop&w=1600&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6858f?auto=format&fit=crop&w=1600&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1600&q=80',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
  gokarna: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
  pondicherry: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
  pune: 'https://images.unsplash.com/photo-1600021625907-79b8d23d8c11?auto=format&fit=crop&w=1600&q=80',
  amritsar: 'https://images.unsplash.com/photo-1563204909-6bc2e30372f7?auto=format&fit=crop&w=1600&q=80',

  // International
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59693e0cd8ce?auto=format&fit=crop&w=1600&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
};

const GENERIC_FALLBACK = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80';

export class UnsplashRateLimitError extends Error {
  constructor(status: number) {
    super(`Unsplash API rate limit hit (HTTP ${status})`);
    this.name = 'UnsplashRateLimitError';
  }
}

interface UnsplashSearchResult {
  results: { urls: { regular: string } }[];
}

async function searchUnsplash(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || accessKey.includes('YOUR_UNSPLASH_KEY_HERE')) {
    return null;
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('orientation', 'landscape');

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (response.status === 403 || response.status === 429) {
    throw new UnsplashRateLimitError(response.status);
  }

  if (!response.ok) {
    console.warn(`[image-provider] Unsplash API error: ${response.status} ${response.statusText}`);
    return null;
  }

  const data = (await response.json()) as UnsplashSearchResult;
  const photo = data.results?.[0];
  if (!photo) return null;

  return `${photo.urls.regular}&w=1600&q=80`;
}

/**
 * Throws UnsplashRateLimitError if the API is rate-limited — callers doing
 * bulk work should catch this specifically and stop, rather than treating
 * it as "no photo exists for this place" (see backfill script usage).
 */
export async function getDestinationImage(destinationName: string, state?: string): Promise<string> {
  const normalizedName = destinationName.toLowerCase().trim();

  if (FALLBACK_DESTINATION_IMAGES[normalizedName]) {
    return FALLBACK_DESTINATION_IMAGES[normalizedName];
  }

  // Unsplash search works best with short, simple queries — a long compound
  // query (e.g. "X Y travel landscape") often returns zero results for
  // lesser-known places. Try progressively broader queries until one hits.
  const candidateQueries = [
    state ? `${destinationName} ${state}` : null,
    `${destinationName} India`,
    destinationName,
  ].filter((q): q is string => Boolean(q));

  for (const query of candidateQueries) {
    const result = await searchUnsplash(query);
    if (result) return result;
  }

  return GENERIC_FALLBACK;
}
