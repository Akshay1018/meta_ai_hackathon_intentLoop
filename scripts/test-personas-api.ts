/**
 * API-level persona checks (dev server on :3000). Uses fixture: true.
 *   npx tsx scripts/test-personas-api.ts
 */
import { PERSONA_SCENARIOS } from "../lib/personas";

const base = process.env.SMOKE_BASE ?? "http://127.0.0.1:3000";

async function post(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, fixture: true }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  return { res, json };
}

async function main(): Promise<number> {
  let failed = 0;

  for (const scenario of PERSONA_SCENARIOS) {
  const surfacesVisited = [...new Set(scenario.surfaceOrder)];
  const intentRes = await post("/api/intent", {
    surface: scenario.leadSurface,
    personaId: scenario.personaId,
  });
  const intentJson = intentRes.json as { card?: unknown };
  if (!intentRes.res.ok || !intentJson.card) {
    console.log(`FAIL ${scenario.personaId} intent`, intentRes.json);
    failed++;
    continue;
  }
  const exitRes = await post("/api/exit", {
    intent: intentJson.card,
    surfacesVisited,
    surfaceOrder: scenario.surfaceOrder,
    postedThisVisit: scenario.postedThisVisit,
    elapsedSec: 45,
    personaId: scenario.personaId,
  });
  const exitJson = exitRes.json as { brief?: { happened: string; next_action: string } };
  const brief = exitJson.brief;
  if (!exitRes.res.ok || !brief) {
    console.log(`FAIL ${scenario.personaId} exit`, exitRes.json);
    failed++;
    continue;
  }
  const okHappened = scenario.expectHappened.test(brief.happened);
  const okNext = scenario.expectNext.test(brief.next_action);
  if (!okHappened || !okNext) {
    console.log(`FAIL ${scenario.personaId}: ${scenario.name}`);
    console.log("  happened:", brief.happened);
    console.log("  next:", brief.next_action);
    failed++;
  } else {
    console.log(`OK ${scenario.personaId}: ${scenario.name}`);
  }
  }

  console.log(
    `\ntest-personas-api: ${PERSONA_SCENARIOS.length - failed}/${PERSONA_SCENARIOS.length} passed`,
  );
  return failed ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
