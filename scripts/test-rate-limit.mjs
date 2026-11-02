/**
 * Verify API rate limiting (Upstash on Vercel production).
 *
 * Uses fixture payloads — no Meta billing on intent/exit handlers.
 * WARNING: --stress consumes your hourly quota for this IP (shared on Vercel).
 *
 *   npm run test:rate-limit
 *   RATE_TEST_BASE=https://meta-ai-hackathon-intent-loop.vercel.app npm run test:rate-limit
 *   npm run test:rate-limit -- --stress
 *
 * Local Redis test (limits ON in dev):
 *   RATE_LIMIT_DISABLED=0 UPSTASH_*=... npm run dev:clean
 *   RATE_TEST_BASE=http://127.0.0.1:3000 npm run test:rate-limit -- --stress
 */

const LIMITS = {
  intentPerHour: 40,
  exitPerHour: 25,
};

const base = (process.env.RATE_TEST_BASE ?? "https://meta-ai-hackathon-intent-loop.vercel.app").replace(
  /\/$/,
  "",
);

const stress = process.argv.includes("--stress");
const stressExit = process.argv.includes("--stress-exit");

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let json = {};
  try {
    json = await res.json();
  } catch {
    /* empty */
  }
  return { status: res.status, json, retryAfter: res.headers.get("Retry-After") };
}

function assert429Shape(label, { status, json, retryAfter }) {
  if (status !== 429) {
    console.error(`FAIL ${label}: expected 429, got ${status}`, json);
    return false;
  }
  if (json.code !== "RATE_LIMITED") {
    console.error(`FAIL ${label}: missing code RATE_LIMITED`, json);
    return false;
  }
  if (typeof json.message !== "string" || !json.message.length) {
    console.error(`FAIL ${label}: missing message`, json);
    return false;
  }
  if (typeof json.retryAfterSeconds !== "number" || json.retryAfterSeconds < 1) {
    console.error(`FAIL ${label}: missing retryAfterSeconds`, json);
    return false;
  }
  if (!retryAfter) {
    console.warn(`WARN ${label}: Retry-After header missing (body still has retryAfterSeconds)`);
  }
  console.log(`ok ${label}: 429 RATE_LIMITED, retry ~${json.retryAfterSeconds}s`);
  return true;
}

let failed = 0;

console.log(`Rate limit smoke → ${base}`);
console.log(stress ? "mode: --stress (will hammer API)" : "mode: probe (safe). Add --stress to force 429.");

const probe = await post("/api/intent", { surface: "dms", fixture: true });
if (probe.status === 429) {
  console.log(
    "ok probe: already rate-limited (429) — Redis/middleware is active; wait for window or use another network.",
  );
  assert429Shape("probe-429", probe) || failed++;
} else if (probe.status === 200 && probe.json.ok) {
  console.log("ok probe: POST /api/intent fixture → 200");
} else {
  console.error("FAIL probe:", probe.status, probe.json);
  failed++;
}

if (stress) {
  const n = LIMITS.intentPerHour + 5;
  console.log(`\nStress intent: ${n} requests (limit ${LIMITS.intentPerHour}/h per route)...`);
  let ok = 0;
  let limited = 0;
  let last429 = null;
  for (let i = 1; i <= n; i++) {
    const r = await post("/api/intent", { surface: "dms", fixture: true });
    if (r.status === 200 && r.json.ok) ok++;
    else if (r.status === 429) {
      limited++;
      last429 = r;
    } else {
      console.error(`FAIL unexpected status on intent #${i}:`, r.status, r.json);
      failed++;
    }
  }
  console.log(`intent stress: 200=${ok} 429=${limited}`);
  if (limited === 0) {
    console.error(
      "FAIL stress: expected at least one 429 (is UPSTASH_* set on Vercel? limits off in dev?)",
    );
    failed++;
  } else if (last429 && !assert429Shape("intent-stress", last429)) {
    failed++;
  }
}

if (stressExit) {
  const n = LIMITS.exitPerHour + 5;
  console.log(`\nStress exit: ${n} requests (limit ${LIMITS.exitPerHour}/h)...`);
  let e400 = 0;
  let limited = 0;
  let last429 = null;
  for (let i = 1; i <= n; i++) {
    const r = await post("/api/exit", { fixture: true });
    if (r.status === 400 || (r.status === 200 && r.json.ok)) {
      e400++;
    } else if (r.status === 429) {
      limited++;
      last429 = r;
    } else {
      console.error(`FAIL unexpected status on exit #${i}:`, r.status, r.json);
      failed++;
    }
  }
  console.log(`exit stress: passed middleware (non-429)=${e400} 429=${limited}`);
  if (limited === 0) {
    console.error("FAIL stress-exit: expected at least one 429");
    failed++;
  } else if (last429 && !assert429Shape("exit-stress", last429)) {
    failed++;
  }
}

if (!stress && !stressExit) {
  console.log("\nTip: npm run test:rate-limit -- --stress   (uses ~45 intent calls from your IP)");
}

process.exit(failed ? 1 : 0);
