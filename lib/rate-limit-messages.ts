/** User-facing copy when the public demo throttles Meta API usage (not Instagram production). */

export const RATE_LIMIT_CODE = "RATE_LIMITED" as const;

export function rateLimitUserMessage(retryAfterSeconds: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  if (minutes <= 1) {
    return (
      "This public demo has a short fair-use limit on AI requests. " +
      "Please try again in about a minute — your visit data on this device is fine."
    );
  }
  return (
    `This public demo has a fair-use limit on AI requests (hackathon server). ` +
    `Please try again in about ${minutes} minutes — nothing is wrong with your visit.`
  );
}

export function rateLimitSegmentMessage(retryAfterSeconds: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return (
    `Surroundings checks are paused for now (demo rate limit). ` +
    `Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}, or turn alerts off.`
  );
}

export function rateLimitIntentHint(retryAfterSeconds: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return `Intent line unavailable — demo limit. Retry in ~${minutes} min.`;
}
