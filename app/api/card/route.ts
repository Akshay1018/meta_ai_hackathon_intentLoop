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

  try {
    if (fixture) {
      return Response.json({
        ok: true,
        imageBase64: fixtureSessionCard(),
        fixture: true,
        meta: metaCallMeta("fixture"),
      });
    }
    const { imageBase64, model } = await generateSessionCard(body.brief, intentGoal);
    return Response.json({
      ok: true,
      imageBase64,
      fixture: false,
      meta: metaCallMeta(model),
    });
  } catch {
    return Response.json({
      ok: true,
      imageBase64: fixtureSessionCard(),
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Muse Image unavailable; placeholder returned.",
    });
  }
}
