import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPrismaToDestination } from '@/lib/db-mapper';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dbDest = await prisma.destination.findUnique({
      where: { id },
      include: {
        transportRoutes: true,
        accommodations: true,
        costMultiplier: true,
        activities: true,
        itineraryDays: true
      }
    });

    if (!dbDest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const destination = mapPrismaToDestination(dbDest);
    return NextResponse.json({ destination });
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
