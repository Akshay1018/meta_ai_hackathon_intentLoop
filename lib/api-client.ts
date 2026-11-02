import { RATE_LIMIT_CODE } from "@/lib/rate-limit-messages";

export type ApiJson = {
  ok?: boolean;
  message?: string;
  code?: string;
  retryAfterSeconds?: number;
};

export function parseRetryAfterSeconds(res: Response, json: ApiJson): number {
  if (typeof json.retryAfterSeconds === "number" && json.retryAfterSeconds > 0) {
    return json.retryAfterSeconds;
  }
  const header = res.headers.get("Retry-After");
  if (header) {
    const n = parseInt(header, 10);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return 60;
}

export function isRateLimited(res: Response, json: ApiJson): boolean {
  return res.status === 429 || json.code === RATE_LIMIT_CODE;
}
