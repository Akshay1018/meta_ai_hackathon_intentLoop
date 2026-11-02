import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  RATE_LIMIT_CODE,
  rateLimitSegmentMessage,
  rateLimitUserMessage,
} from "@/lib/rate-limit-messages";

export type RateLimitDecision = {
  allowed: boolean;
  retryAfterSeconds: number;
  scope: "bypass" | "disabled" | "global" | "route";
};

/** Per IP, rolling 1 h — tuned for ~6 full judge demos / hour. */
export const LIMITS = {
  globalPerHour: 150,
  intentPerHour: 40,
  exitPerHour: 25,
  segmentPerHour: 80,
  mediaPerHour: 20,
} as const;

function redis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function limiter(
  name: string,
  max: number,
  window: `${number} h` | `${number} m` = "1 h",
): Ratelimit | null {
  const r = redis();
  if (!r) return null;
  return new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix: `intentloop:${name}`,
    analytics: false,
  });
}

let globalLimiter: Ratelimit | null | undefined;
let intentLimiter: Ratelimit | null | undefined;
let exitLimiter: Ratelimit | null | undefined;
let segmentLimiter: Ratelimit | null | undefined;
let mediaLimiter: Ratelimit | null | undefined;

function getGlobalLimiter() {
  if (globalLimiter === undefined) {
    globalLimiter = limiter("global", LIMITS.globalPerHour);
  }
  return globalLimiter;
}

function routeLimiter(pathname: string): Ratelimit | null {
  if (pathname.startsWith("/api/intent")) {
    if (intentLimiter === undefined) intentLimiter = limiter("intent", LIMITS.intentPerHour);
    return intentLimiter;
  }
  if (pathname.startsWith("/api/exit")) {
    if (exitLimiter === undefined) exitLimiter = limiter("exit", LIMITS.exitPerHour);
    return exitLimiter;
  }
  if (pathname.startsWith("/api/segment")) {
    if (segmentLimiter === undefined) segmentLimiter = limiter("segment", LIMITS.segmentPerHour);
    return segmentLimiter;
  }
  if (
    pathname.startsWith("/api/vision") ||
    pathname.startsWith("/api/transcribe") ||
    pathname.startsWith("/api/card") ||
    pathname.startsWith("/api/voice-follow-up")
  ) {
    if (mediaLimiter === undefined) mediaLimiter = limiter("media", LIMITS.mediaPerHour);
    return mediaLimiter;
  }
  return null;
}

export function rateLimitBypass(request: Request): boolean {
  const secret = process.env.RATE_LIMIT_BYPASS_SECRET;
  if (!secret) return false;
  return request.headers.get("x-intentloop-bypass") === secret;
}

export function rateLimitDisabled(): boolean {
  if (process.env.RATE_LIMIT_DISABLED === "1") return true;
  if (process.env.NODE_ENV !== "production") return true;
  return false;
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

async function checkOne(
  l: Ratelimit | null,
  id: string,
  scope: RateLimitDecision["scope"],
): Promise<RateLimitDecision | null> {
  if (!l) return null;
  const { success, reset } = await l.limit(id);
  if (success) return null;
  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { allowed: false, retryAfterSeconds, scope };
}

export async function enforceRateLimit(
  request: Request,
  pathname: string,
): Promise<RateLimitDecision> {
  if (rateLimitBypass(request)) {
    return { allowed: true, retryAfterSeconds: 0, scope: "bypass" };
  }
  if (rateLimitDisabled()) {
    return { allowed: true, retryAfterSeconds: 0, scope: "disabled" };
  }

  const ip = clientIpFromRequest(request);
  const id = `ip:${ip}`;

  const global = getGlobalLimiter();
  if (global) {
    const blocked = await checkOne(global, id, "global");
    if (blocked) return blocked;
  }

  const route = routeLimiter(pathname);
  if (route) {
    const blocked = await checkOne(route, `${id}:${pathname.split("/")[2] ?? "api"}`, "route");
    if (blocked) return blocked;
  }

  if (!global && !route) {
    // Production without Upstash — do not block deploy; warn in logs once.
    console.warn(
      "[intentloop] UPSTASH_REDIS_REST_* not set — API rate limiting is off in production.",
    );
  }

  return { allowed: true, retryAfterSeconds: 0, scope: "disabled" };
}

export function rateLimitJsonBody(retryAfterSeconds: number, pathname?: string) {
  const message = pathname?.startsWith("/api/segment")
    ? rateLimitSegmentMessage(retryAfterSeconds)
    : rateLimitUserMessage(retryAfterSeconds);
  return {
    ok: false as const,
    code: RATE_LIMIT_CODE,
    message,
    retryAfterSeconds,
  };
}
