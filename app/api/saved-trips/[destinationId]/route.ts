/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UuidSchema } from '@/lib/validations';

async function getOrCreateUser(anonId: string | null) {
  if (!anonId) throw new Error('Missing X-User-Id header');
  const validId = UuidSchema.parse(anonId);
  const email = `anon-${validId}@travelfinder.local`;
  
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, name: 'Anonymous Traveler' }
    });
  }
  return user;
}

export async function DELETE(request: Request, context: any) {
  const anonId = request.headers.get('x-user-id');
  // Need to correctly handle Next.js 15+ async params just in case, or safely fallback
  const params = await context.params;
  const { destinationId } = params;
  
  try {
    let user;
    try {
      user = await getOrCreateUser(anonId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid user identity' }, { status: 400 });
    }

    // Delete if exists, otherwise do nothing (graceful)
    await prisma.savedTrip.deleteMany({
      where: {
        userId: user.id,
        destinationId: destinationId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved trip:', error);
    return NextResponse.json({ error: 'Failed to delete saved trip' }, { status: 500 });
  }
}
