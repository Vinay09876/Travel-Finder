import prisma from './prisma';
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from './session';

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

/**
 * Resolves the authenticated user id from the request's signed session
 * cookie — NOT from any client-supplied header. Returns null if there is no
 * cookie, the signature doesn't verify, or the referenced user no longer
 * exists, so callers should treat null as "unauthenticated" (401).
 */
export async function getSessionUserId(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieValue = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
  const userId = verifySessionCookieValue(cookieValue);
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  return user ? user.id : null;
}
