/**
 * Summary sheet API smoke (fixture mode — no Meta spend).
 * Run with dev server OR node-only where routes are hit via fetch to localhost.
 */
const BASE = process.env.SUMMARY_TEST_BASE ?? "http://127.0.0.1:3000";

const intentDms = {
  goal: "Reply in DMs",
  app: "instagram",
  surface: "dms",
  source: "inferred",
  success: "Message sent",
  max_minutes: 15,
  avoid: "Reels",
  check_in_prompt: "Still on replies?",
};

const briefHighDrift = {
  drift: 68,
  happened: "Opened messages; spent time on Reels.",
  next_action: "Open messages",
  tone: "neutral",
};

const briefLowDrift = {
  drift: 18,
  happened: "You shared your post.",
  next_action: "Close the app",
  tone: "encouraging",
};

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log("OK", name);
    passed++;
  } catch (e) {
    console.error("FAIL", name, e instanceof Error ? e.message : e);
    failed++;
  }
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, fixture: true }),
  });
  const json = await res.json();
  return { res, json };
}

await check("exit brief fixture", async () => {
  const { res, json } = await post("/api/exit", {
    intent: intentDms,
    surfacesVisited: ["dms", "reels"],
    surfaceOrder: ["dms", "reels"],
    elapsedSec: 90,
    postedThisVisit: false,
  });
  if (!res.ok || !json.ok || typeof json.brief?.drift !== "number") {
    throw new Error(JSON.stringify(json));
  }
});

await check("voice follow-up mountains → reels", async () => {
  const { res, json } = await post("/api/voice-follow-up", {
    transcript: "I want to see the reels of mountains",
    intent: intentDms,
  });
  if (!res.ok || json.followUp?.navigate_to !== "/reels") {
    throw new Error(JSON.stringify(json));
  }
});

await check("voice follow-up Ria → search", async () => {
  const { res, json } = await post("/api/voice-follow-up", {
    transcript: "I want to see the feed from Ria",
    intent: intentDms,
  });
  if (!res.ok || !json.followUp?.action_label) {
    throw new Error(JSON.stringify(json));
  }
});

await check("visit card lines", async () => {
  const { res, json } = await post("/api/card", {
    brief: briefHighDrift,
    intentGoal: intentDms.goal,
  });
  if (!res.ok || !json.lines?.goal || !json.backgroundBase64) {
    throw new Error(JSON.stringify(json));
  }
  if (json.lines.hook.includes("Open messages")) {
    throw new Error("hook should not duplicate next_action");
  }
});

await check("vision returns action for pizza fixture", async () => {
  const { res, json } = await post("/api/vision", {
    intent: intentDms,
    imageBase64: "x",
    fixture: true,
  });
  if (!res.ok || !json.action?.navigate_to || json.action.navigate_to !== "/search") {
    throw new Error(JSON.stringify(json));
  }
  if (!json.action.search_query) throw new Error("missing search_query");
});

await check("vision fixture accepts png", async () => {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const dir = dirname(fileURLToPath(import.meta.url));
  const png = readFileSync(join(dir, "../public/demo-screenshot.png"));
  const b64 = png.toString("base64");
  const { res, json } = await post("/api/vision", {
    intent: intentDms,
    imageBase64: b64,
    mime: "image/png",
  });
  if (!res.ok || !json.happened) {
    throw new Error(JSON.stringify(json));
  }
});

await check("low vs high drift brief fixtures", async () => {
  if (briefLowDrift.drift >= 40) throw new Error("low fixture");
  if (briefHighDrift.drift < 40) throw new Error("high fixture");
});

console.log(`\ntest-summary-flow: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
