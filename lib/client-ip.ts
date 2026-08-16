// Helper to extract client IP safely
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Vercel and AWS ELB use x-forwarded-for, potentially containing a comma-separated list
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  // Fallback if no proxy headers are present (e.g. local dev)
  return '127.0.0.1';
}
