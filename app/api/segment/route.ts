import {
  analyzeRecordingSurroundings,
  fixtureRecordingSurroundings,
  mergeSamAndVisionNudge,
} from "@/lib/meta-recording-surroundings";
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
  const mime = typeof body.mime === "string" ? body.mime : undefined;
  const fixture =
    process.env.INTENTLOOP_FIXTURE === "1" || body.fixture === true || !hasMetaApiKey();

  if (!imageBase64 && !fixture) {
    return Response.json({ ok: false, message: "Missing imageBase64" }, { status: 400 });
  }

  try {
    if (fixture) {
      if (context === "recording") {
        const fx = fixtureRecordingSurroundings();
        const summary = {
          ...fixtureSegment("recording"),
          nudge: fx.nudge,
          raw: `[fixture] ${fx.nudge}`,
          alertLevel: fx.alert_level,
        };
        return Response.json({
          ok: true,
          summary,
          fixture: true,
          meta: metaCallMeta("fixture"),
        });
      }
      const summary = fixtureSegment(context);
      return Response.json({
        ok: true,
        summary,
        fixture: true,
        meta: metaCallMeta("fixture"),
      });
    }

    const { summary: samSummary, model: samModel } = await segmentSurroundingsPhoto({
      imageBase64,
      mime,
      context,
    });

    if (context === "recording" && imageBase64) {
      try {
        const { analysis, model: sparkModel } = await analyzeRecordingSurroundings({
          imageBase64,
          mime,
          samRaw: samSummary.raw,
        });
        const nudge = mergeSamAndVisionNudge({ samRaw: samSummary.raw, analysis });
        return Response.json({
          ok: true,
          summary: {
            ...samSummary,
            nudge,
            alertLevel: analysis.alert_level,
            raw: `[sam:${samModel}] ${samSummary.raw} | [spark:${sparkModel}] ${JSON.stringify(analysis)}`,
          },
          fixture: false,
          meta: metaCallMeta(sparkModel, { sam: samModel }),
        });
      } catch {
        return Response.json({
          ok: true,
          summary: samSummary,
          fixture: false,
          meta: metaCallMeta(samModel),
          message: "Spark surroundings vision unavailable; SAM-only nudge.",
        });
      }
    }

    return Response.json({
      ok: true,
      summary: samSummary,
      fixture: false,
      meta: metaCallMeta(samModel),
    });
  } catch {
    const summary =
      context === "recording"
        ? { ...fixtureSegment("recording"), nudge: fixtureRecordingSurroundings().nudge }
        : fixtureSegment(context);
    return Response.json({
      ok: true,
      summary,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message: "Surroundings check unavailable; fixture fallback.",
    });
  }
}
