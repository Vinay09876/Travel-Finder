import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Supports multiple Gemini API keys for automatic fallback when one hits its
 * daily free-tier quota (20 requests/day per key/account). Configure additional
 * keys as GOOGLE_GENERATIVE_AI_API_KEY_2, GOOGLE_GENERATIVE_AI_API_KEY_3, etc.
 * in .env — each from a separate Google account, since the quota is per-account.
 */
function loadApiKeys(): string[] {
  const keys: string[] = [];

  const primary = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (primary && !primary.includes('YOUR_GEMINI_KEY_HERE')) {
    keys.push(primary);
  }

  for (let i = 2; ; i++) {
    const key = process.env[`GOOGLE_GENERATIVE_AI_API_KEY_${i}`];
    if (!key) break;
    if (!key.includes('YOUR_GEMINI_KEY_HERE')) keys.push(key);
  }

  return keys;
}

function isQuotaOrRateLimitError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('resource_exhausted') ||
    lower.includes('429') ||
    lower.includes('too many requests')
  );
}

const API_KEYS = loadApiKeys();
// Index of the key considered exhausted for the rest of this process's lifetime.
// Reset only by restarting the process (a new script run, or app server restart).
let exhaustedUpTo = -1;

if (API_KEYS.length === 0) {
  throw new Error('No Gemini API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.');
}

/**
 * Runs `task` with the given model, automatically rotating to the next
 * available Gemini API key if the current one reports a quota/rate-limit
 * error. Throws the underlying error once all configured keys are exhausted.
 */
export async function withGeminiFallback<T>(
  task: (model: ReturnType<ReturnType<typeof createGoogleGenerativeAI>>) => Promise<T>,
  modelName: string = 'gemini-3.6-flash'
): Promise<T> {
  if (allKeysExhausted()) {
    throw new Error('QUOTA_EXCEEDED: All configured Gemini API keys have exhausted their daily quota.');
  }

  let lastError: unknown = null;

  for (let keyIndex = exhaustedUpTo + 1; keyIndex < API_KEYS.length; keyIndex++) {
    const provider = createGoogleGenerativeAI({ apiKey: API_KEYS[keyIndex] });
    try {
      const result = await task(provider(modelName));
      return result;
    } catch (err) {
      lastError = err;
      if (isQuotaOrRateLimitError(err)) {
        console.log(`[gemini-client] API key #${keyIndex + 1} exhausted, trying next key if available.`);
        exhaustedUpTo = keyIndex;
        continue;
      }
      // Non-quota error (validation, network, etc.) — don't burn through remaining keys for this.
      throw err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('QUOTA_EXCEEDED: All configured Gemini API keys have exhausted their daily quota.');
}

export function getConfiguredKeyCount(): number {
  return API_KEYS.length;
}

/** True once every configured key has reported a quota/rate-limit error this process. */
export function allKeysExhausted(): boolean {
  return exhaustedUpTo >= API_KEYS.length - 1;
}
