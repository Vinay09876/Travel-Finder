import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qRaw = searchParams.get('q');
  
  if (!qRaw) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  const q = qRaw.trim();
  if (q.length < 2 || q.length > 50) {
    return NextResponse.json({ error: 'Query must be between 2 and 50 characters' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const userId = request.headers.get('x-user-id') || 'anon';
  
  try {
    // 30 requests per IP, 15 per user, per 1 minute for geocoding autocomplete
    await checkRateLimit(ip, userId, 'geocode', 30, 15, 60000);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === 'IP_RATE_LIMIT_EXCEEDED' || err.message === 'USER_RATE_LIMIT_EXCEEDED') {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    throw error;
  }

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_MAPTILER_API_KEY is missing');
    return NextResponse.json({ error: 'Missing MapTiler key' }, { status: 500 });
  }

  // Use MapTiler geocoding endpoint for autocomplete
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${apiKey}&fuzzyMatch=true&limit=5`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`MapTiler API failed with status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Geocoding error:', err.message);
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}
