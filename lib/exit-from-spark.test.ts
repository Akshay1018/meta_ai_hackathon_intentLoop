import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fixtureExitBrief, fixtureIntentCard, isExitBrief } from "./schemas";

describe("ExitBrief fixtures (no Meta API)", () => {
  it("valid fixture brief", () => {
    const intent = fixtureIntentCard("dms");
    const brief = fixtureExitBrief(intent, ["home", "dms", "reels"]);
    assert.equal(isExitBrief(brief), true);
    assert.ok(brief.drift >= 0 && brief.drift <= 100);
    assert.match(brief.next_action.toLowerCase(), /dm|reply/);
  });

  it("low drift when only one surface", () => {
    const intent = fixtureIntentCard("home");
    const brief = fixtureExitBrief(intent, ["home"]);
    assert.ok(brief.drift < 30);
  });
});
