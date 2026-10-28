import { inferExitBrief } from "@/lib/exit-from-spark";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isIntentCard, isIntentSurface, type IntentSurface } from "@/lib/schemas";

export const runtime = "nodejs";

function wantFixture(body: { fixture?: unknown }): boolean {
  if (process.env.INTENTLOOP_FIXTURE === "1") return true;
  if (body.fixture === true) return true;
  if (!hasMetaApiKey()) return true;
  return false;
}

export async function POST(request: Request) {
  let body: {
    intent?: unknown;
    surfacesVisited?: unknown;
    elapsedSec?: unknown;
    recap?: unknown;
    fixture?: unknown;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!isIntentCard(body.intent)) {
    return Response.json({ ok: false, message: "Invalid intent" }, { status: 400 });
  }

  const surfacesRaw = Array.isArray(body.surfacesVisited) ? body.surfacesVisited : [];
  const surfacesVisited = surfacesRaw.filter(
    (s): s is IntentSurface => typeof s === "string" && isIntentSurface(s),
  );

  const elapsedSec =
    typeof body.elapsedSec === "number" && body.elapsedSec >= 0 ? body.elapsedSec : 0;
  const recap = typeof body.recap === "string" ? body.recap : undefined;
  const fixture = wantFixture(body);

  try {
    const result = await inferExitBrief(
      { intent: body.intent, surfacesVisited, elapsedSec, recap },
      { fixture },
    );
    return Response.json({
      ok: true,
      brief: result.brief,
      fixture: result.fixture,
      meta: metaCallMeta(result.model),
    });
  } catch {
    const fallback = inferExitBrief(
      { intent: body.intent, surfacesVisited, elapsedSec, recap },
      { fixture: true },
    );
    const fb = await fallback;
    return Response.json({
      ok: true,
      brief: fb.brief,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Live brief unavailable; showing honest fallback.",
    });
  }
}
