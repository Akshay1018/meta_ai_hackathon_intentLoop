import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildDwellRows,
  dwellDeltasSinceBaseline,
  formatDwellSeconds,
  snapshotDwellAt,
  unattributedDwellSec,
} from "./visit-dwell";

describe("visit dwell", () => {
  it("formats seconds and minutes", () => {
    assert.equal(formatDwellSeconds(45), "45s");
    assert.equal(formatDwellSeconds(90), "1m 30s");
    assert.equal(formatDwellSeconds(120), "2m");
  });

  it("snapshots active segment into totals", () => {
    const snap = snapshotDwellAt(10_000, {
      totalsSec: { home: 5 },
      activeSurface: "reels",
      activeSinceMs: 4_000,
    });
    assert.equal(snap.totalsSec.home, 5);
    assert.ok((snap.totalsSec.reels ?? 0) >= 5.9 && (snap.totalsSec.reels ?? 0) <= 6.1);
  });

  it("builds rows sorted by time with percents against elapsed cap", () => {
    const rows = buildDwellRows({
      totalsSec: { home: 20, reels: 25 },
      elapsedCapSec: 45,
    });
    assert.equal(rows.length, 2);
    assert.equal(rows[0]!.surface, "reels");
    assert.equal(rows[0]!.percent, Math.round((25 / 45) * 100));
    assert.equal(unattributedDwellSec(45, rows), 0);
  });

  it("computes deltas since last baseline view", () => {
    const rows = buildDwellRows({ totalsSec: { home: 25, reels: 10 }, elapsedCapSec: 35 });
    const deltas = dwellDeltasSinceBaseline(rows, { totalsSec: { home: 10, reels: 10 }, elapsedSec: 20 });
    assert.equal(deltas.home, 15);
    assert.equal(deltas.reels, undefined);
  });

  it("shows unattributed time when elapsed exceeds tab totals", () => {
    const rows = buildDwellRows({
      totalsSec: { home: 10 },
      elapsedCapSec: 30,
    });
    assert.equal(unattributedDwellSec(30, rows), 20);
  });
});
