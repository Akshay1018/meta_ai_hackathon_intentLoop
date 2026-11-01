/** Reels record page only — auto surroundings alerts (separate from Profile consent). */

const KEY = "intentloop:reels-auto-surroundings";

export function readReelsAutoSurroundings(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw === "0") return false;
    if (raw === "1") return true;
    return true;
  } catch {
    return true;
  }
}

export function writeReelsAutoSurroundings(enabled: boolean): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, enabled ? "1" : "0");
}
