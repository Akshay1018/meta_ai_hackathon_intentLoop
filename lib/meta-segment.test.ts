import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fixtureSegment } from "./meta-segment";

describe("SAM segment fixtures", () => {
  it("returns a short nudge for walk/recording", () => {
    const summary = fixtureSegment();
    assert.ok(summary.nudge.length > 10);
    assert.match(summary.nudge.toLowerCase(), /walk|phone|aware|traffic|pocket|fixture/i);
    assert.match(summary.prompt, /phone/);
  });

  it("returns a behind-recording nudge for reels context", () => {
    const summary = fixtureSegment("recording");
    assert.match(summary.nudge.toLowerCase(), /behind|recording/);
    assert.match(summary.prompt, /behind/);
  });
});
