import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fixtureIntentCard, isIntentCard } from "./schemas";

describe("IntentCard fixtures (no Meta API)", () => {
  for (const surface of ["home", "reels", "dms", "create", "profile"] as const) {
    it(`valid card for ${surface}`, () => {
      const card = fixtureIntentCard(surface);
      assert.equal(isIntentCard(card), true);
      assert.equal(card.surface, surface);
      assert.equal(card.source, "inferred");
    });
  }

  it("dms goal mentions inbox/reply", () => {
    const card = fixtureIntentCard("dms");
    assert.match(card.goal.toLowerCase(), /dm|reply|inbox|message/);
  });
});
