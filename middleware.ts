import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { enforceRateLimit, rateLimitJsonBody } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const decision = await enforceRateLimit(request, pathname);

  if (!decision.allowed) {
    const body = rateLimitJsonBody(decision.retryAfterSeconds, pathname);
    return NextResponse.json(body, {
      status: 429,
      headers: {
        "Retry-After": String(decision.retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
