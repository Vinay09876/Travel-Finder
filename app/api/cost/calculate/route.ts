import { NextResponse } from 'next/server';
import { calculateTripCost } from '@/lib/cost-calculator';
import { Destination, SearchQuery } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, query } = body as { destination: Destination, query: SearchQuery };

    if (!destination || !query) {
      return NextResponse.json({ error: 'Missing destination or query' }, { status: 400 });
    }

    // Since the frontend already has the mapped Destination object,
    // we can just run the cost calculator directly on it.
    // Long term, this could fetch from DB by ID, but taking it from body is faster for stateless calc.
    const costInfo = calculateTripCost(destination, query);
    
    return NextResponse.json({ costInfo });
  } catch (error) {
    console.error('Error in cost calculation API:', error);
    return NextResponse.json({ error: 'Failed to calculate cost' }, { status: 500 });
  }
}
