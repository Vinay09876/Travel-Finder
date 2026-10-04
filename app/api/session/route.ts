import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { SESSION_COOKIE_NAME, createSessionCookieValue, verifySessionCookieValue } from '@/lib/session';

/**
 * Ensures the caller has a valid, server-issued session cookie, creating one
 * (and the backing anonymous User row) on first visit. Safe to call
 * repeatedly — an existing valid cookie is left as-is.
 */
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const existingCookie = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
    const existingUserId = verifySessionCookieValue(existingCookie);

    if (existingUserId) {
      const user = await prisma.user.findUnique({ where: { id: existingUserId } });
      if (user) {
        return NextResponse.json({ ok: true });
      }
      // Cookie signature is valid but the user row is gone — fall through to recreate.
    }

    const newUserId = crypto.randomUUID();
    const email = `anon-${newUserId}@travelfinder.local`;
    const user = await prisma.user.create({
      data: { email, name: 'Anonymous Traveler' },
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  } catch (error) {
    console.error('Error establishing session:', error);
    return NextResponse.json({ error: 'Failed to establish session' }, { status: 500 });
  }
}

function parseCookie(cookieHeader: string, name: string): string | undefined {
  const parts = cookieHeader.split(';').map((p) => p.trim());
  for (const part of parts) {
    const eqIndex = part.indexOf('=');
    if (eqIndex === -1) continue;
    if (part.slice(0, eqIndex) === name) {
      return decodeURIComponent(part.slice(eqIndex + 1));
    }
  }
  return undefined;
}
