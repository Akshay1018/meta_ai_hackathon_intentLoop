import { surfaceDisplayLabel } from "@/lib/brief-summary-ui";
import type { IntentSurface } from "@/lib/schemas";

const DWELL_KEY = "intentloop:dwell-v1";
const DWELL_BASELINE_KEY = "intentloop:dwell-view-baseline";

export type DwellViewBaseline = {
  totalsSec: Partial<Record<IntentSurface, number>>;
  elapsedSec: number;
};

export type DwellSnapshot = {
  totalsSec: Partial<Record<IntentSurface, number>>;
  activeSurface: IntentSurface | null;
  activeSinceMs: number;
};

export type DwellRow = {
  surface: IntentSurface;
  label: string;
  seconds: number;
  percent: number;
};

type StoredDwell = {
  totalsSec: Partial<Record<IntentSurface, number>>;
  activeSurface: IntentSurface | null;
  activeSinceMs: number;
};

function emptyStored(): StoredDwell {
  return { totalsSec: {}, activeSurface: null, activeSinceMs: 0 };
}

function readStored(): StoredDwell {
  if (typeof window === "undefined") return emptyStored();
  try {
    const raw = sessionStorage.getItem(DWELL_KEY);
    if (!raw) return emptyStored();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyStored();
    const v = parsed as Record<string, unknown>;
    const totalsSec =
      v.totalsSec && typeof v.totalsSec === "object"
        ? (v.totalsSec as Partial<Record<IntentSurface, number>>)
        : {};
    const activeSurface =
      typeof v.activeSurface === "string" ? (v.activeSurface as IntentSurface) : null;
    const activeSinceMs =
      typeof v.activeSinceMs === "number" && Number.isFinite(v.activeSinceMs)
        ? v.activeSinceMs
        : 0;
    return { totalsSec, activeSurface, activeSinceMs };
  } catch {
    return emptyStored();
  }
}

function writeStored(state: StoredDwell): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DWELL_KEY, JSON.stringify(state));
}

function addSeconds(
  totals: Partial<Record<IntentSurface, number>>,
  surface: IntentSurface,
  deltaSec: number,
): Partial<Record<IntentSurface, number>> {
  if (deltaSec <= 0) return totals;
  const prev = totals[surface] ?? 0;
  return { ...totals, [surface]: prev + deltaSec };
}

/** Call on each IG tab navigation (from SurfaceTracker). */
export function recordDwellSurfaceEnter(surface: IntentSurface, nowMs: number = Date.now()): void {
  const state = readStored();
  if (state.activeSurface === surface) return;

  let totals = state.totalsSec;
  if (state.activeSurface && state.activeSinceMs > 0) {
    const deltaSec = (nowMs - state.activeSinceMs) / 1000;
    totals = addSeconds(totals, state.activeSurface, deltaSec);
  }

  writeStored({
    totalsSec: totals,
    activeSurface: surface,
    activeSinceMs: nowMs,
  });
}

export function clearDwellTracking(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DWELL_KEY);
  sessionStorage.removeItem(DWELL_BASELINE_KEY);
}

export function readDwellViewBaseline(): DwellViewBaseline | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DWELL_BASELINE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const v = parsed as Record<string, unknown>;
    return {
      totalsSec:
        v.totalsSec && typeof v.totalsSec === "object"
          ? (v.totalsSec as Partial<Record<IntentSurface, number>>)
          : {},
      elapsedSec: typeof v.elapsedSec === "number" ? v.elapsedSec : 0,
    };
  } catch {
    return null;
  }
}

export function writeDwellViewBaseline(baseline: DwellViewBaseline): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DWELL_BASELINE_KEY, JSON.stringify(baseline));
}

/** Seconds gained per surface since the last Time + where check this visit. */
export function dwellDeltasSinceBaseline(
  rows: DwellRow[],
  baseline: DwellViewBaseline | null,
): Partial<Record<IntentSurface, number>> {
  if (!baseline) return {};
  const out: Partial<Record<IntentSurface, number>> = {};
  for (const row of rows) {
    const prev = baseline.totalsSec[row.surface] ?? 0;
    const delta = Math.round(row.seconds - prev);
    if (delta !== 0) out[row.surface] = delta;
  }
  return out;
}

export function totalsFromRows(rows: DwellRow[]): Partial<Record<IntentSurface, number>> {
  const out: Partial<Record<IntentSurface, number>> = {};
  for (const row of rows) out[row.surface] = row.seconds;
  return out;
}

/** Pure: merge stored totals + active segment up to nowMs. */
export function snapshotDwellAt(nowMs: number, stored: StoredDwell = readStored()): DwellSnapshot {
  const totalsSec = { ...stored.totalsSec };
  if (stored.activeSurface && stored.activeSinceMs > 0) {
    const deltaSec = (nowMs - stored.activeSinceMs) / 1000;
    const surface = stored.activeSurface;
    totalsSec[surface] = (totalsSec[surface] ?? 0) + Math.max(0, deltaSec);
  }
  return {
    totalsSec,
    activeSurface: stored.activeSurface,
    activeSinceMs: stored.activeSinceMs,
  };
}

export function buildDwellRows(input: {
  totalsSec: Partial<Record<IntentSurface, number>>;
  elapsedCapSec?: number;
}): DwellRow[] {
  const surfaces = Object.keys(input.totalsSec) as IntentSurface[];
  const rawTotal = surfaces.reduce((sum, s) => sum + (input.totalsSec[s] ?? 0), 0);
  const denominator =
    input.elapsedCapSec != null && input.elapsedCapSec > 0 ? input.elapsedCapSec : rawTotal;

  if (denominator <= 0 || rawTotal <= 0) return [];

  const rows = surfaces
    .map((surface) => {
      const seconds = Math.max(0, input.totalsSec[surface] ?? 0);
      return {
        surface,
        label: surfaceDisplayLabel(surface),
        seconds,
        percent: denominator > 0 ? (seconds / denominator) * 100 : 0,
      };
    })
    .filter((r) => r.seconds >= 0.5)
    .sort((a, b) => b.seconds - a.seconds);

  return rows.map((r) => ({
    ...r,
    seconds: Math.round(r.seconds),
    percent: Math.min(100, Math.round(r.percent)),
  }));
}

/** Seconds on Search/Shop etc. when session elapsed exceeds attributed IG tabs. */
export function unattributedDwellSec(elapsedSec: number, rows: DwellRow[]): number {
  const attributed = rows.reduce((s, r) => s + r.seconds, 0);
  return Math.max(0, Math.round(elapsedSec - attributed));
}

export function formatDwellSeconds(seconds: number): string {
  const sec = Math.max(0, Math.round(seconds));
  if (sec < 60) return `${sec}s`;
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
}

export function readDwellRowsForVisit(elapsedSec: number, nowMs: number = Date.now()): DwellRow[] {
  const snap = snapshotDwellAt(nowMs);
  return buildDwellRows({
    totalsSec: snap.totalsSec,
    elapsedCapSec: elapsedSec > 0 ? elapsedSec : undefined,
  });
}
