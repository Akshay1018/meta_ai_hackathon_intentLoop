import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { postDeepLink, searchHitHref, searchMockContent } from "@/lib/mock-search";

describe("mock search deep links", () => {
  it("finds pizza post", () => {
    const hits = searchMockContent("pizza");
    assert.ok(hits.some((h) => h.kind === "post" && h.id === "p1"));
  });

  it("post hit links to feed focus", () => {
    const hits = searchMockContent("pizza");
    const post = hits.find((h) => h.kind === "post");
    assert.ok(post);
    assert.equal(searchHitHref(post!), "/?post=p1");
    assert.equal(postDeepLink("p1"), "/?post=p1");
  });
});
