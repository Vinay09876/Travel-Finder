/**
 * Centralized startup validation for required production environment
 * variables. Imported once from the root layout so a misconfigured
 * deployment fails fast and loudly on the very first request, with one
 * clear message listing everything missing — instead of surfacing as a
 * confusing downstream error (an opaque Postgres connection failure, or a
 * 500 the first time a Gemini-dependent route is hit) at an unpredictable
 * later point.
 *
 * Does not duplicate or replace the existing per-module checks (e.g.
 * lib/gemini-client.ts's own throw-on-import, lib/session.ts's
 * throw-on-use-in-production) — those remain as defense in depth. This is
 * purely an earlier, consolidated check.
 */

interface RequiredVar {
  name: string;
  description: string;
}

const REQUIRED_IN_PRODUCTION: RequiredVar[] = [
  { name: 'DATABASE_URL', description: 'PostgreSQL connection string (pooled) — the app cannot read or write any data without it' },
  { name: 'DIRECT_URL', description: 'PostgreSQL direct connection string — used for migrations' },
  { name: 'SESSION_SECRET', description: 'Signs the session cookie that identifies anonymous users for saved trips' },
  { name: 'GOOGLE_GENERATIVE_AI_API_KEY', description: 'Powers destination enrichment and the AI itinerary feature' },
];

let hasValidated = false;

/**
 * Throws a single error listing every missing required variable if run in
 * production with any of them absent. No-op outside production, and a
 * no-op after the first successful call within a process's lifetime.
 */
export function validateProductionEnv(): void {
  if (hasValidated) return;

  // NEXT_PHASE is 'phase-production-build' during `next build`'s static
  // analysis/page-data-collection step, where the real deployment's env vars
  // (supplied by the hosting platform at runtime) are not necessarily present
  // yet. Only validate once the app is actually serving requests.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  if (process.env.NODE_ENV !== 'production' || isBuildPhase) {
    hasValidated = true;
    return;
  }

  const missing = REQUIRED_IN_PRODUCTION.filter(({ name }) => !process.env[name]);

  if (missing.length > 0) {
    const details = missing.map(({ name, description }) => `  - ${name}: ${description}`).join('\n');
    throw new Error(
      `Missing required environment variable(s) in production:\n${details}\n\nSet these in your hosting provider's environment configuration before deploying.`
    );
  }

  hasValidated = true;
}
