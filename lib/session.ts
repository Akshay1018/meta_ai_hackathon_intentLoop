import { clearAllCachedIntents } from "@/lib/intent-cache";
import { clearDwellTracking } from "@/lib/visit-dwell";
import { clearPostedThisVisit } from "@/lib/visit-outcome";
import { clearSurfaceVisits } from "@/lib/visit-tracker";

export type SessionSettings = {
  enabled: boolean;
  maxMinutes: number;
  demoCompact: boolean;
};

const STORAGE_KEY = "intentloop:settings";
const SKIPPED_KEY = "intentloop:limit-skipped";
const SNOOZE_KEY = "intentloop:limit-snooze";
const STARTED_KEY = "intentloop:session-started";

const DEFAULT_MINUTES = Number(process.env.NEXT_PUBLIC_DEFAULT_LIMIT_MINUTES ?? 15);
export const DEMO_LIMIT_SECONDS = Number(
  process.env.NEXT_PUBLIC_DEMO_LIMIT_SECONDS ?? 45,
);

export function defaultSessionSettings(): SessionSettings {
  return {
    enabled: true,
    maxMinutes: Number.isFinite(DEFAULT_MINUTES) && DEFAULT_MINUTES > 0 ? DEFAULT_MINUTES : 15,
    demoCompact: true,
  };
}

export function isSessionSettings(value: unknown): value is SessionSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.enabled === "boolean" &&
    typeof v.maxMinutes === "number" &&
    v.maxMinutes >= 1 &&
    v.maxMinutes <= 180 &&
    typeof v.demoCompact === "boolean"
  );
}

export function readSessionSettings(): SessionSettings {
  if (typeof window === "undefined") return defaultSessionSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSessionSettings();
    const parsed: unknown = JSON.parse(raw);
    return isSessionSettings(parsed) ? parsed : defaultSessionSettings();
  } catch {
    return defaultSessionSettings();
  }
}

export function writeSessionSettings(settings: SessionSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function limitSeconds(settings: SessionSettings): number {
  if (settings.demoCompact) {
    return Number.isFinite(DEMO_LIMIT_SECONDS) && DEMO_LIMIT_SECONDS > 0
      ? DEMO_LIMIT_SECONDS
      : 45;
  }
  return settings.maxMinutes * 60;
}

export function readSessionStartedAt(now: number): number {
  if (typeof window === "undefined") return now;
  const raw = sessionStorage.getItem(STARTED_KEY);
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  sessionStorage.setItem(STARTED_KEY, String(now));
  return now;
}

export function readLimitSkipped(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SKIPPED_KEY) === "1";
}

export function writeLimitSkipped(): void {
  sessionStorage.setItem(SKIPPED_KEY, "1");
}

export function readSnoozeUntil(): number {
  if (typeof window === "undefined") return 0;
  const n = Number(sessionStorage.getItem(SNOOZE_KEY) ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function writeSnoozeUntil(epochMs: number): void {
  sessionStorage.setItem(SNOOZE_KEY, String(epochMs));
}

export function clearLimitSkipped(): void {
  sessionStorage.removeItem(SKIPPED_KEY);
}

export function clearSnooze(): void {
  sessionStorage.removeItem(SNOOZE_KEY);
}

/** New visit for demo / retest — restarts timer and shows the limit sheet again. */
export function resetDemoVisit(now: number = Date.now()): void {
  if (typeof window === "undefined") return;
  clearLimitSkipped();
  clearSnooze();
  sessionStorage.setItem(STARTED_KEY, String(now));
  clearAllCachedIntents();
  clearSurfaceVisits();
  clearDwellTracking();
  clearPostedThisVisit();
}

export type LimitBlockReason = "none" | "disabled" | "skipped" | "snoozed";

export function limitBlockReason(input: {
  enabled: boolean;
  skipped: boolean;
  snoozeUntil: number;
  now: number;
}): LimitBlockReason {
  if (!input.enabled) return "disabled";
  if (input.skipped) return "skipped";
  if (input.now < input.snoozeUntil) return "snoozed";
  return "none";
}

export type LimitPhase = "running" | "open" | "hidden";

export function limitPhase(input: {
  enabled: boolean;
  now: number;
  startedAt: number;
  limitSec: number;
  skipped: boolean;
  snoozeUntil: number;
}): LimitPhase {
  if (!input.enabled || input.skipped) return "hidden";
  if (input.now < input.snoozeUntil) return "hidden";
  const elapsed = (input.now - input.startedAt) / 1000;
  return elapsed >= input.limitSec ? "open" : "running";
}

export function remainingSeconds(input: {
  now: number;
  startedAt: number;
  limitSec: number;
}): number {
  const left = input.limitSec - (input.now - input.startedAt) / 1000;
  return Math.max(0, Math.ceil(left));
}
