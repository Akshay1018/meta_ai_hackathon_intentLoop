import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  collapseSurfacePath,
  DRIFT_AUTO_EXPAND_THRESHOLD,
  formatVisitPathLine,
  incompleteSectionVisible,
  shouldAutoExpandIncompleteSection,
  driftBarTone,
} from "@/lib/brief-summary-ui";

describe("brief summary UI logic", () => {
  it("auto-expands incomplete section at threshold", () => {
    assert.equal(shouldAutoExpandIncompleteSection(DRIFT_AUTO_EXPAND_THRESHOLD - 1), false);
    assert.equal(shouldAutoExpandIncompleteSection(DRIFT_AUTO_EXPAND_THRESHOLD), true);
    assert.equal(shouldAutoExpandIncompleteSection(72), true);
  });

  it("user can open incomplete section when drift is low", () => {
    assert.equal(incompleteSectionVisible(10, false), false);
    assert.equal(incompleteSectionVisible(10, true), true);
    assert.equal(incompleteSectionVisible(50, false), true);
  });

  it("collapses consecutive duplicate surfaces in path", () => {
    assert.deepEqual(collapseSurfacePath(["dms", "dms", "reels", "reels", "create"]), [
      "dms",
      "reels",
      "create",
    ]);
  });

  it("formats visit path with elapsed time", () => {
    const line = formatVisitPathLine(["dms", "reels", "profile"], 125);
    assert.match(line, /Messages → Reels → Profile/);
    assert.match(line, /2m 5s/);
  });

  it("drift bar tone buckets", () => {
    assert.equal(driftBarTone(20), "ok");
    assert.equal(driftBarTone(40), "mid");
    assert.equal(driftBarTone(70), "warn");
  });
});
