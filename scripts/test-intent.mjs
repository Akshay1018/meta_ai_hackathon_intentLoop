/**
 * Fixture-only — zero Meta API credits.
 *   npx tsx scripts/test-intent.mjs
 */
import assert from "node:assert/strict";
import {
  fixtureIntentCard,
  isIntentCard,
} from "../lib/schemas.ts";

const surfaces = ["home", "reels", "dms", "create", "profile"];
for (const surface of surfaces) {
  const card = fixtureIntentCard(surface);
  assert.equal(isIntentCard(card), true, surface);
  assert.equal(card.surface, surface);
  assert.equal(card.source, "inferred");
  assert.equal(card.app, "instagram");
}
const dms = fixtureIntentCard("dms");
assert.match(dms.goal.toLowerCase(), /dm|reply|inbox|message/);
console.log("test-intent: 5 fixtures OK (no Meta API calls)");
