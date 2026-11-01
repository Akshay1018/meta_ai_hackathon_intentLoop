import type { IntentSurface } from "@/lib/schemas";

/** Auto-expand “Summary incomplete?” when drift is at or above this (0–100). */
export const DRIFT_AUTO_EXPAND_THRESHOLD = 40;

export function shouldAutoExpandIncompleteSection(drift: number): boolean {
  return Math.min(100, Math.max(0, drift)) >= DRIFT_AUTO_EXPAND_THRESHOLD;
}

export function driftBarTone(drift: number): "ok" | "mid" | "warn" {
  const pct = Math.min(100, Math.max(0, drift));
  if (pct >= 60) return "warn";
  if (pct >= 35) return "mid";
  return "ok";
}

const SURFACE_LABELS: Record<IntentSurface, string> = {
  home: "Feed",
  reels: "Reels",
  dms: "Messages",
  create: "Create",
  profile: "Profile",
};

export function surfaceDisplayLabel(surface: IntentSurface): string {
  return SURFACE_LABELS[surface];
}

export function collapseSurfacePath(order: IntentSurface[]): IntentSurface[] {
  const out: IntentSurface[] = [];
  for (const s of order) {
    if (out[out.length - 1] !== s) out.push(s);
  }
  return out;
}

export function formatVisitPathLine(order: IntentSurface[], elapsedSec: number): string {
  const path = collapseSurfacePath(order)
    .map((s) => SURFACE_LABELS[s])
    .join(" → ");
  const sec = Math.max(0, Math.round(elapsedSec));
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  const time = mins > 0 ? `${mins}m ${rem}s` : `${sec}s`;
  return path ? `${path} · ${time}` : time;
}

export function incompleteSectionVisible(
  drift: number,
  userOpened: boolean,
): boolean {
  return userOpened || shouldAutoExpandIncompleteSection(drift);
}
