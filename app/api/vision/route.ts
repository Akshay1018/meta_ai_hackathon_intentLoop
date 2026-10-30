import { fixtureVision, analyzeScreenshot } from "@/lib/meta-vision";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isIntentCard } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { intent?: unknown; imageBase64?: unknown; mime?: unknown; fixture?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!isIntentCard(body.intent)) {
    return Response.json({ ok: false, message: "Invalid intent" }, { status: 400 });
  }
  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
  if (!imageBase64 && body.fixture !== true && process.env.INTENTLOOP_FIXTURE !== "1") {
    return Response.json({ ok: false, message: "Missing imageBase64" }, { status: 400 });
  }

  const fixture =
    process.env.INTENTLOOP_FIXTURE === "1" || body.fixture === true || !hasMetaApiKey();

  try {
    if (fixture) {
      const fx = fixtureVision(body.intent);
      return Response.json({
        ok: true,
        ...fx,
        fixture: true,
        meta: metaCallMeta("fixture"),
      });
    }
    const { result, model } = await analyzeScreenshot({
      intent: body.intent,
      imageBase64,
      mime: typeof body.mime === "string" ? body.mime : undefined,
    });
    return Response.json({
      ok: true,
      happened: result.happened,
      vs_intent: result.vs_intent,
      next_step: result.next_step,
      fixture: false,
      meta: metaCallMeta(model),
    });
  } catch {
    const fb = fixtureVision(body.intent);
    return Response.json({
      ok: true,
      happened: fb.happened,
      vs_intent: fb.vs_intent,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Vision unavailable; fixture fallback.",
    });
  }
}
