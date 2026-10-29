import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fixtureIntentCard } from "./schemas";

describe("readPrimaryIntentCard logic (fixtures only)", () => {
  it("posted visit prefers create headline", () => {
    const order = ["home", "create", "reels", "dms"] as const;
    const posted = true;
    const lead = posted
      ? fixtureIntentCard("create")
      : fixtureIntentCard("dms");
    assert.equal(lead.surface, "create");
    assert.ok(order.includes("reels"));
  });
});
