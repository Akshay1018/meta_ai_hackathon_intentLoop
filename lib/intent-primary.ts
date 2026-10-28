import { readCachedIntent } from "@/lib/intent-cache";
import type { IntentCard, IntentSurface } from "@/lib/schemas";

const PRIORITY: IntentSurface[] = ["dms", "create", "profile", "reels", "home"];

export function readPrimaryIntentCard(): IntentCard | null {
  for (const surface of PRIORITY) {
    const card = readCachedIntent(surface);
    if (card) return card;
  }
  return null;
}
