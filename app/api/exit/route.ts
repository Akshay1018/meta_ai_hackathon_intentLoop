import { inferExitBrief } from "@/lib/exit-from-spark";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isIntentCard, isIntentSurface, type ExitBriefInput, type IntentSurface } from "@/lib/schemas";

export const runtime = "nodejs";

function wantFixture(body: { fixture?: unknown }): boolean {
  if (process.env.INTENTLOOP_FIXTURE === "1") return true;
  if (body.fixture === true) return true;
  if (!hasMetaApiKey()) return true;
  return false;
}

function parseSurfaces(raw: unknown): IntentSurface[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is IntentSurface => typeof s === "string" && isIntentSurface(s));
}

export async function POST(request: Request) {
  let body: {
    intent?: unknown;
    surfacesVisited?: unknown;
    surfaceOrder?: unknown;
    postedThisVisit?: unknown;
    intentsBySurface?: unknown;
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

  const surfacesVisited = parseSurfaces(body.surfacesVisited);
  const surfaceOrder = parseSurfaces(body.surfaceOrder);
  const order = surfaceOrder.length > 0 ? surfaceOrder : surfacesVisited;
  const elapsedSec =
    typeof body.elapsedSec === "number" && body.elapsedSec >= 0 ? body.elapsedSec : 0;
  const postedThisVisit = body.postedThisVisit === true;
  const recap = typeof body.recap === "string" ? body.recap : undefined;
  const fixture = wantFixture(body);

  const payload: ExitBriefInput & { recap?: string } = {
    intent: body.intent,
    surfacesVisited,
    surfaceOrder: order,
    elapsedSec,
    postedThisVisit,
    recap,
  };

  if (body.intentsBySurface && typeof body.intentsBySurface === "object") {
    const map = body.intentsBySurface as Record<string, unknown>;
    const intentsBySurface: ExitBriefInput["intentsBySurface"] = {};
    for (const [key, val] of Object.entries(map)) {
      if (isIntentSurface(key) && isIntentCard(val)) {
        intentsBySurface[key] = val;
      }
    }
    if (Object.keys(intentsBySurface).length > 0) payload.intentsBySurface = intentsBySurface;
  }

  try {
    const result = await inferExitBrief(payload, { fixture });
    return Response.json({
      ok: true,
      brief: result.brief,
      fixture: result.fixture,
      meta: metaCallMeta(result.model),
    });
  } catch {
    const fb = await inferExitBrief(payload, { fixture: true });
    return Response.json({
      ok: true,
      brief: fb.brief,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Live brief unavailable; showing honest fallback.",
    });
  }
}
