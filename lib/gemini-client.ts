import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import type { z } from 'zod';

/**
 * Supports multiple Gemini API keys for automatic fallback when one hits its
 * quota / rate limit. Configure additional keys as GOOGLE_GENERATIVE_AI_API_KEY_2,
 * GOOGLE_GENERATIVE_AI_API_KEY_3, etc. in .env — each from a separate Google
 * account, since the quota is per-account.
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

function errorText(err: unknown): string {
  if (err instanceof Error) {
    // AI SDK wraps provider errors (RetryError -> lastError / cause); include
    // nested messages so quota detection works regardless of wrapping.
    const nested = (err as { lastError?: unknown; cause?: unknown }).lastError ?? (err as { cause?: unknown }).cause;
    return `${err.name} ${err.message} ${nested ? errorText(nested) : ''}`;
  }
  return String(err);
}

function isQuotaOrRateLimitError(err: unknown): boolean {
  const lower = errorText(err).toLowerCase();
  return (
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('resource_exhausted') ||
    lower.includes('429') ||
    lower.includes('too many requests')
  );
}

function isDailyQuotaError(err: unknown): boolean {
  const lower = errorText(err).toLowerCase();
  return lower.includes('per day') || lower.includes('perday') || lower.includes('daily');
}

export function isTimeoutError(err: unknown): boolean {
  const lower = errorText(err).toLowerCase();
  return lower.includes('aborterror') || lower.includes('timeouterror') || lower.includes('timed out') || lower.includes('aborted');
}

const API_KEYS = loadApiKeys();

if (API_KEYS.length === 0) {
  throw new Error('No Gemini API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.');
}

/**
 * Per-key cooldown (epoch ms until which the key is skipped). Previously a
 * single rate-limit hit marked a key as exhausted for the whole lifetime of
 * the server process, so one transient per-minute 429 broke every AI feature
 * until a restart. Now a per-minute limit cools down briefly and a daily
 * quota cools down for an hour, after which the key is retried.
 */
const keyCooldownUntil: number[] = API_KEYS.map(() => 0);
const SHORT_COOLDOWN_MS = 60_000;
const DAILY_QUOTA_COOLDOWN_MS = 60 * 60_000;

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

export class GeminiQuotaError extends Error {
  constructor() {
    super('QUOTA_EXCEEDED: All configured Gemini API keys are currently rate-limited or out of quota.');
    this.name = 'GeminiQuotaError';
  }
}

type GeminiModel = ReturnType<ReturnType<typeof createGoogleGenerativeAI>>;

/**
 * Runs `task` with the given model, automatically rotating to the next
 * available Gemini API key if the current one reports a quota/rate-limit
 * error. Throws GeminiQuotaError once every key is cooling down.
 */
export async function withGeminiFallback<T>(
  task: (model: GeminiModel) => Promise<T>,
  modelName: string = DEFAULT_GEMINI_MODEL
): Promise<T> {
  let attempted = false;

  for (let keyIndex = 0; keyIndex < API_KEYS.length; keyIndex++) {
    if (keyCooldownUntil[keyIndex] > Date.now()) continue;
    attempted = true;

    const provider = createGoogleGenerativeAI({ apiKey: API_KEYS[keyIndex] });
    try {
      return await task(provider(modelName));
    } catch (err) {
      if (isQuotaOrRateLimitError(err)) {
        const cooldown = isDailyQuotaError(err) ? DAILY_QUOTA_COOLDOWN_MS : SHORT_COOLDOWN_MS;
        keyCooldownUntil[keyIndex] = Date.now() + cooldown;
        console.warn(`[gemini-client] API key #${keyIndex + 1} rate-limited; cooling down ${cooldown / 1000}s.`);
        continue;
      }
      // Non-quota error (validation, network, timeout) — don't burn through remaining keys for this.
      throw err;
    }
  }

  if (!attempted) console.warn('[gemini-client] All Gemini keys are cooling down.');
  throw new GeminiQuotaError();
}

/**
 * Generates a schema-validated object with a hard timeout per attempt.
 * Uses generateText + Output.object (generateObject is deprecated in AI SDK v7).
 * maxRetries is kept low so a slow/overloaded model can't stack several
 * long internal retries behind one user click.
 */
export async function generateStructured<S extends z.ZodType>(
  schema: S,
  prompt: string,
  { timeoutMs = 45_000 }: { timeoutMs?: number } = {}
): Promise<z.infer<S>> {
  return withGeminiFallback(async (model) => {
    const result = await generateText({
      model,
      prompt,
      output: Output.object({ schema }),
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(timeoutMs),
    });
    return result.output as z.infer<S>;
  });
}

export function getConfiguredKeyCount(): number {
  return API_KEYS.length;
}

/** True while every configured key is cooling down after a quota/rate-limit error. */
export function allKeysExhausted(): boolean {
  const now = Date.now();
  return keyCooldownUntil.every((until) => until > now);
}
