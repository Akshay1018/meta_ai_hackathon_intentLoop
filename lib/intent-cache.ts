import { isIntentCard, type IntentCard } from "@/lib/schemas";

const PREFIX = "intentloop:card:";

export function readCachedIntent(surface: string): IntentCard | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PREFIX + surface);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isIntentCard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCachedIntent(surface: string, card: IntentCard): void {
  try {
    sessionStorage.setItem(PREFIX + surface, JSON.stringify(card));
  } catch {
    /* ignore quota */
  }
}
