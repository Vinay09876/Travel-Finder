import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ features: [] });
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
