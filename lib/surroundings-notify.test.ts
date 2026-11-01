import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { shouldAutoSurfaceNudge } from "./surroundings-notify";

describe("shouldAutoSurfaceNudge", () => {
  it("surfaces urgent alerts", () => {
    assert.equal(
      shouldAutoSurfaceNudge({ alertLevel: "urgent", nudge: "Pause filming." }),
      true,
    );
  });

  it("hides all-clear copy", () => {
    assert.equal(
      shouldAutoSurfaceNudge({
        nudge: "All clear for now — tap Check surroundings again if the scene changes.",
      }),
      false,
    );
  });

  it("surfaces phone warnings without alert level", () => {
    assert.equal(
      shouldAutoSurfaceNudge({
        nudge: "Another phone is visible above your head — pause before continuing.",
      }),
      true,
    );
  });
});
