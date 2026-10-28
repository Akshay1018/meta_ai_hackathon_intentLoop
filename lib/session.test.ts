import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  defaultSessionSettings,
  isSessionSettings,
  limitPhase,
  limitSeconds,
  remainingSeconds,
} from "./session";

describe("session settings (no Meta API)", () => {
  it("defaults: on, 15 min, demo compact", () => {
    const s = defaultSessionSettings();
    assert.equal(s.enabled, true);
    assert.equal(s.maxMinutes, 15);
    assert.equal(s.demoCompact, true);
    assert.equal(limitSeconds(s), 45);
  });

  it("rejects invalid settings", () => {
    assert.equal(isSessionSettings({ enabled: true }), false);
    assert.equal(isSessionSettings({ enabled: true, maxMinutes: 0, demoCompact: true }), false);
  });

  it("live limit uses minutes", () => {
    assert.equal(
      limitSeconds({ enabled: true, maxMinutes: 15, demoCompact: false }),
      900,
    );
  });

  it("sheet stays closed until limit, then opens", () => {
    const startedAt = 1_000_000;
    assert.equal(
      limitPhase({
        enabled: true,
        now: startedAt + 44_000,
        startedAt,
        limitSec: 45,
        skipped: false,
        snoozeUntil: 0,
      }),
      "running",
    );
    assert.equal(
      limitPhase({
        enabled: true,
        now: startedAt + 45_000,
        startedAt,
        limitSec: 45,
        skipped: false,
        snoozeUntil: 0,
      }),
      "open",
    );
  });

  it("Skip and snooze hide the sheet", () => {
    const startedAt = 1_000_000;
    const now = startedAt + 60_000;
    assert.equal(
      limitPhase({
        enabled: true,
        now,
        startedAt,
        limitSec: 45,
        skipped: true,
        snoozeUntil: 0,
      }),
      "hidden",
    );
    assert.equal(
      limitPhase({
        enabled: true,
        now,
        startedAt,
        limitSec: 45,
        skipped: false,
        snoozeUntil: now + 1,
      }),
      "hidden",
    );
    assert.equal(
      limitPhase({
        enabled: false,
        now,
        startedAt,
        limitSec: 45,
        skipped: false,
        snoozeUntil: 0,
      }),
      "hidden",
    );
  });

  it("remaining seconds floors at 0", () => {
    assert.equal(
      remainingSeconds({ now: 50_000, startedAt: 0, limitSec: 45 }),
      0,
    );
    assert.equal(
      remainingSeconds({ now: 10_000, startedAt: 0, limitSec: 45 }),
      35,
    );
  });
});
