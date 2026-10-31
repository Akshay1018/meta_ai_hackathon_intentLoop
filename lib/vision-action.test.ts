import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildSearchHref, inferVisionAction } from "@/lib/vision-action";

describe("vision action (Option A)", () => {
  it("routes pizza photo copy to search with query", () => {
    const action = inferVisionAction({
      happened: "A whole pepperoni pizza on a board with stretchy cheese.",
      next_step: "Search for the pizza post to like or save it.",
      intentSurface: "home",
    });
    assert.equal(action.navigate_to, "/search");
    assert.equal(action.search_query, "pizza");
    assert.match(action.action_label, /pizza/i);
    assert.equal(buildSearchHref(action.search_query), "/search?q=pizza");
  });

  it("routes reel language to /reels", () => {
    const action = inferVisionAction({
      happened: "A vertical video clip of a run.",
      next_step: "Open the reel and like it.",
      intentSurface: "dms",
    });
    assert.equal(action.navigate_to, "/reels");
  });
});
