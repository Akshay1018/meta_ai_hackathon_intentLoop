import { isIntentSurface, type IntentSurface } from "@/lib/schemas";

const ORDER_KEY = "intentloop:surface-order";

export function recordSurfaceVisit(surface: IntentSurface): void {
  if (typeof window === "undefined") return;
  try {
    const order = readSurfaceVisitOrder();
    order.push(surface);
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order.slice(-40)));
  } catch {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify([surface]));
  }
}

/** Tab order for this visit ( repeats when user switches back ). */
export function readSurfaceVisitOrder(): IntentSurface[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is IntentSurface => typeof s === "string" && isIntentSurface(s));
  } catch {
    return [];
  }
}

/** Unique tabs touched this visit. */
export function readSurfaceVisits(): IntentSurface[] {
  const seen = new Set<IntentSurface>();
  const unique: IntentSurface[] = [];
  for (const s of readSurfaceVisitOrder()) {
    if (!seen.has(s)) {
      seen.add(s);
      unique.push(s);
    }
  }
  return unique;
}

export function clearSurfaceVisits(): void {
  sessionStorage.removeItem(ORDER_KEY);
}

export function pathnameToSurface(pathname: string): IntentSurface | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/reels")) return "reels";
  if (pathname.startsWith("/dms")) return "dms";
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/profile")) return "profile";
  return null;
}
