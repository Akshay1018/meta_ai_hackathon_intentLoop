import { visitCardHook, sanitizeHappened } from "@/lib/brief-display";
import { fixtureSessionCard, generateSessionCard } from "@/lib/meta-image";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isExitBrief } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { brief?: unknown; intentGoal?: unknown; fixture?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!isExitBrief(body.brief)) {
    return Response.json({ ok: false, message: "Invalid brief" }, { status: 400 });
  }
  const intentGoal = typeof body.intentGoal === "string" ? body.intentGoal : "Instagram visit";
  const fixture =
    process.env.INTENTLOOP_FIXTURE === "1" || body.fixture === true || !hasMetaApiKey();

  const lines = {
    goal: intentGoal.slice(0, 80),
    outcome: sanitizeHappened(body.brief.happened).slice(0, 140),
    hook: visitCardHook(body.brief).slice(0, 80),
  };

  try {
    if (fixture) {
      return Response.json({
        ok: true,
        backgroundBase64: fixtureSessionCard(),
        lines,
        fixture: true,
        meta: metaCallMeta("fixture"),
      });
    }
    const { imageBase64, model } = await generateSessionCard(body.brief, intentGoal);
    return Response.json({
      ok: true,
      backgroundBase64: imageBase64,
      lines,
      fixture: false,
      meta: metaCallMeta(model),
    });
  } catch {
    return Response.json({
      ok: true,
      backgroundBase64: fixtureSessionCard(),
      lines,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Muse Image unavailable; placeholder returned.",
    });
  }
}
