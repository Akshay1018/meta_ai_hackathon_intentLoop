import { isIntentSurface, type IntentSurface } from "@/lib/schemas";

const KEY = "intentloop:surfaces";

export function recordSurfaceVisit(surface: IntentSurface): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(KEY);
    const list: IntentSurface[] = raw ? (JSON.parse(raw) as IntentSurface[]) : [];
    const next = list.includes(surface) ? list : [...list, surface];
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    sessionStorage.setItem(KEY, JSON.stringify([surface]));
  }
}

export function readSurfaceVisits(): IntentSurface[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is IntentSurface => typeof s === "string" && isIntentSurface(s));
  } catch {
    return [];
  }
}

export function pathnameToSurface(pathname: string): IntentSurface | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/reels")) return "reels";
  if (pathname.startsWith("/dms")) return "dms";
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/profile")) return "profile";
  return null;
}
