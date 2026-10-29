import { readCachedIntent } from "@/lib/intent-cache";
import { readPostedThisVisit } from "@/lib/visit-outcome";
import type { IntentCard, IntentSurface } from "@/lib/schemas";

const TASK_SURFACES: IntentSurface[] = ["dms", "create", "reels", "profile"];

/** Best IntentCard headline for this visit — not “always DMs because cache exists”. */
export function readPrimaryIntentCard(visitOrder: IntentSurface[]): IntentCard | null {
  if (readPostedThisVisit()) {
    const create = readCachedIntent("create");
    if (create) return create;
  }

  for (let i = visitOrder.length - 1; i >= 0; i--) {
    const surface = visitOrder[i];
    if (!TASK_SURFACES.includes(surface)) continue;
    const card = readCachedIntent(surface);
    if (card) return card;
  }

  for (const surface of TASK_SURFACES) {
    if (!visitOrder.includes(surface)) continue;
    const card = readCachedIntent(surface);
    if (card) return card;
  }

  if (visitOrder.includes("home")) return readCachedIntent("home");
  return null;
}

export function readIntentCardsForVisit(visitOrder: IntentSurface[]): Partial<Record<IntentSurface, IntentCard>> {
  const unique = [...new Set(visitOrder)];
  const out: Partial<Record<IntentSurface, IntentCard>> = {};
  for (const surface of unique) {
    const card = readCachedIntent(surface);
    if (card) out[surface] = card;
  }
  return out;
}
