import { fixtureVision, analyzeScreenshot } from "@/lib/meta-vision";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isIntentCard } from "@/lib/schemas";
import { inferVisionAction } from "@/lib/vision-action";

export const runtime = "nodejs";

function withAction(
  intent: { surface: string },
  happened: string,
  vs_intent: string,
  next_step: string,
) {
  const action = inferVisionAction({
    happened,
    next_step,
    intentSurface: intent.surface,
  });
  return { happened, vs_intent, next_step, action };
}

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
        ...withAction(body.intent, fx.happened, fx.vs_intent, fx.next_step),
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
      ...withAction(body.intent, result.happened, result.vs_intent, result.next_step),
      fixture: false,
      meta: metaCallMeta(model),
    });
  } catch {
    const fb = fixtureVision(body.intent);
    return Response.json({
      ok: true,
      ...withAction(body.intent, fb.happened, fb.vs_intent, fb.next_step),
      next_step: fb.next_step,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Vision unavailable; fixture fallback.",
    });
  }
}
