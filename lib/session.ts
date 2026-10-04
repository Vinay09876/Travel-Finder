import crypto from 'crypto';

/**
 * Server-issued, HttpOnly session identity — replaces trusting a raw
 * client-supplied `x-user-id` header as proof of who's making a request.
 *
 * The cookie value is `${userId}.${signature}`, where signature is an
 * HMAC-SHA256 over userId keyed by SESSION_SECRET. A client can still read
 * its own cookie's *value* (HttpOnly only blocks JS access, not the browser
 * sending it), but cannot forge a signature for an arbitrary userId without
 * the server secret — so copying/guessing another user's id is no longer
 * sufficient to act as them.
 */

export const SESSION_COOKIE_NAME = 'tf_session';

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set in production.');
    }
    // Local dev fallback only — never used if SESSION_SECRET is set.
    return 'dev-only-insecure-session-secret-do-not-use-in-production';
  }
  return secret;
}

function sign(userId: string): string {
  return crypto.createHmac('sha256', getSecret()).update(userId).digest('hex');
}

export function createSessionCookieValue(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

/**
 * Verifies a session cookie value and returns the userId if valid, or null
 * if missing, malformed, or the signature doesn't match (tampered/forged).
 */
export function verifySessionCookieValue(cookieValue: string | undefined | null): string | null {
  if (!cookieValue) return null;

  const separatorIndex = cookieValue.lastIndexOf('.');
  if (separatorIndex === -1) return null;

  const userId = cookieValue.slice(0, separatorIndex);
  const providedSignature = cookieValue.slice(separatorIndex + 1);
  if (!userId || !providedSignature) return null;

  const expectedSignature = sign(userId);

  const providedBuffer = Buffer.from(providedSignature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  if (providedBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  return userId;
}
