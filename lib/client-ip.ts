// Helper to extract client IP safely.
//
// On Vercel, `x-real-ip` is set exclusively by Vercel's edge network and
// cannot be overridden by the client — this matches Vercel's own
// @vercel/functions `ipAddress()` helper, which trusts only this header.
// `x-forwarded-for`, by contrast, is NOT a reliable trust boundary on
// Vercel: a client can prepend arbitrary fake IPs to it before the request
// reaches Vercel's edge, defeating any rate limiting keyed on its first
// entry. It is kept here only as a fallback for non-Vercel deployments
// that are known to set it correctly (e.g. a trusted reverse proxy that
// strips/overwrites any client-supplied value) — if this app is deployed
// behind an untrusted proxy that merely passes x-forwarded-for through
// unmodified, that fallback should be removed.
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  // Fallback if no proxy headers are present (e.g. local dev)
  return '127.0.0.1';
}
