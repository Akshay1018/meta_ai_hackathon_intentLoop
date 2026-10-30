import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fixtureVoiceFollowUp } from "@/lib/voice-follow-up";

describe("fixtureVoiceFollowUp", () => {
  it("routes mountain reels utterance to /reels", () => {
    const fu = fixtureVoiceFollowUp("I want to see the reels of mountains");
    assert.equal(fu.navigate_to, "/reels");
    assert.match(fu.action_label, /reels/i);
  });
});
