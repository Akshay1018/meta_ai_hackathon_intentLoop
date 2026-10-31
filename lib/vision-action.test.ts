import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSearchHref,
  enrichVisionAction,
  inferVisionAction,
  resolveVisionHref,
} from "@/lib/vision-action";

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

  it("enriches single pizza match to View post deep link", () => {
    const base = inferVisionAction({
      happened: "A whole pepperoni pizza on a board with stretchy cheese.",
      next_step: "Search for the pizza post.",
      intentSurface: "home",
    });
    const action = enrichVisionAction(base, base.search_query ? "pizza" : "");
    assert.equal(action.action_label, "View post");
    assert.equal(action.direct_href, "/?post=p1");
    assert.equal(resolveVisionHref(action), "/?post=p1");
  });

  it("iphone-like copy stays back to feed without direct_href", () => {
    const base = inferVisionAction({
      happened: "A hand holding a light green iPhone against a blue wall.",
      next_step: "Keep scrolling the feed.",
      intentSurface: "home",
    });
    const action = enrichVisionAction(base, base.happened);
    assert.equal(action.direct_href, null);
    assert.equal(resolveVisionHref(action), "/");
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
