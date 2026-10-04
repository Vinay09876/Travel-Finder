/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUserId } from '@/lib/session-server';

export async function DELETE(request: Request, context: any) {
  // Need to correctly handle Next.js 15+ async params just in case, or safely fallback
  const params = await context.params;
  const { destinationId } = params;

  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    // Delete if exists, otherwise do nothing (graceful)
    await prisma.savedTrip.deleteMany({
      where: {
        userId,
        destinationId: destinationId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved trip:', error);
    return NextResponse.json({ error: 'Failed to delete saved trip' }, { status: 500 });
  }
}
