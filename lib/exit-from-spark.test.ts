import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fixtureExitBrief, fixtureIntentCard, isExitBrief } from "./schemas";

describe("ExitBrief fixtures (no Meta API)", () => {
  it("valid fixture brief for dms + reels drift", () => {
    const intent = fixtureIntentCard("dms");
    const brief = fixtureExitBrief({
      intent,
      surfacesVisited: ["home", "dms", "reels"],
      surfaceOrder: ["home", "dms", "reels"],
      elapsedSec: 50,
      postedThisVisit: false,
    });
    assert.equal(isExitBrief(brief), true);
    assert.match(brief.happened.toLowerCase(), /reels/);
  });

  it("post-first visit differs from dms-only", () => {
    const post = fixtureExitBrief({
      intent: fixtureIntentCard("create"),
      surfacesVisited: ["home", "create", "reels", "dms"],
      surfaceOrder: ["home", "create", "reels", "home", "dms"],
      elapsedSec: 45,
      postedThisVisit: true,
    });
    assert.match(post.happened.toLowerCase(), /post|shared/);
    const dms = fixtureExitBrief({
      intent: fixtureIntentCard("dms"),
      surfacesVisited: ["home", "dms"],
      surfaceOrder: ["home", "dms"],
      elapsedSec: 40,
      postedThisVisit: false,
    });
    assert.notEqual(post.happened, dms.happened);
  });
});
