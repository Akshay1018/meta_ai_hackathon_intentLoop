import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { rateLimitUserMessage } from "@/lib/rate-limit-messages";

describe("rateLimitUserMessage", () => {
  it("uses minute wording for short retry", () => {
    assert.match(rateLimitUserMessage(45), /about a minute/i);
  });

  it("rounds up minutes for longer retry", () => {
    assert.match(rateLimitUserMessage(130), /about 3 minutes/i);
  });
});
