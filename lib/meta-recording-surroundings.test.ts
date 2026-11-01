import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  fixtureRecordingSurroundings,
  mergeSamAndVisionNudge,
} from "./meta-recording-surroundings";

describe("recording surroundings merge", () => {
  it("fixture flags filming from behind", () => {
    const fx = fixtureRecordingSurroundings();
    assert.equal(fx.second_device_filming, true);
    assert.match(fx.nudge.toLowerCase(), /behind|recording/);
  });

  it("prefers urgent spark nudge when second device flagged", () => {
    const analysis = fixtureRecordingSurroundings();
    const nudge = mergeSamAndVisionNudge({ samRaw: "phone phone person", analysis });
    assert.match(nudge.toLowerCase(), /behind|recording/);
  });

  it("boosts nudge when SAM sees multiple phones", () => {
    const nudge = mergeSamAndVisionNudge({
      samRaw: "phone, phone, person",
      analysis: {
        alert_level: "none",
        second_device_filming: false,
        person_filming_from_behind: false,
        nudge: "No issues spotted.",
      },
    });
    assert.match(nudge.toLowerCase(), /phone|recording/);
  });
});
