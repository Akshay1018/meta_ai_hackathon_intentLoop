import {
  fixtureSegment,
  segmentSurroundingsPhoto,
  type SegmentContext,
} from "@/lib/meta-segment";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    imageBase64?: unknown;
    mime?: unknown;
    fixture?: unknown;
    context?: unknown;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
  const context: SegmentContext = body.context === "recording" ? "recording" : "walk";
  const fixture =
    process.env.INTENTLOOP_FIXTURE === "1" || body.fixture === true || !hasMetaApiKey();

  if (!imageBase64 && !fixture) {
    return Response.json({ ok: false, message: "Missing imageBase64" }, { status: 400 });
  }

  try {
    if (fixture) {
      const summary = fixtureSegment(context);
      return Response.json({
        ok: true,
        summary,
        fixture: true,
        meta: metaCallMeta("fixture"),
      });
    }
    const { summary, model } = await segmentSurroundingsPhoto({
      imageBase64,
      mime: typeof body.mime === "string" ? body.mime : undefined,
      context,
    });
    return Response.json({
      ok: true,
      summary,
      fixture: false,
      meta: metaCallMeta(model),
    });
  } catch {
    const summary = fixtureSegment(context);
    return Response.json({
      ok: true,
      summary,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "SAM unavailable; fixture fallback.",
    });
  }
}
