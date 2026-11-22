export interface FetchJsonResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Server-provided `error` message, if any. */
  error: string | null;
  timedOut: boolean;
}

/**
 * fetch() wrapper for client components that guarantees the promise settles:
 * - aborts after `timeoutMs` (a hung request otherwise leaves spinners forever)
 * - tolerates non-JSON bodies (e.g. a proxy's HTML 502/504 page)
 * - still honours an external AbortSignal (component unmount / superseded request)
 * Network errors and timeouts resolve with ok=false instead of throwing;
 * an external abort rethrows the AbortError so callers can ignore it.
 *
 * Uses a manual AbortController + setTimeout rather than AbortSignal.any /
 * AbortSignal.timeout so it works in older browsers (e.g. Safari < 17.4).
 */
export async function fetchJson<T = unknown>(
  input: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<FetchJsonResult<T>> {
  const { timeoutMs = 30_000, signal: externalSignal, ...rest } = init;

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    let res: Response;
    try {
      res = await fetch(input, { ...rest, signal: controller.signal });
    } catch (err) {
      if (externalSignal?.aborted) throw err;
      return { ok: false, status: 0, data: null, error: null, timedOut };
    }

    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      if (externalSignal?.aborted) throw new DOMException('Aborted', 'AbortError');
      if (timedOut) return { ok: false, status: res.status, data: null, error: null, timedOut: true };
      // Non-JSON body — leave data null.
    }

    const error =
      data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : null;

    return { ok: res.ok, status: res.status, data, error, timedOut: false };
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}
