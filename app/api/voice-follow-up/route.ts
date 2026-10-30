import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";
import { isIntentCard } from "@/lib/schemas";
import { fixtureVoiceFollowUp, interpretVoiceFollowUp } from "@/lib/voice-follow-up";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { transcript?: unknown; intent?: unknown; fixture?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const transcript = typeof body.transcript === "string" ? body.transcript.trim() : "";
  if (!transcript) {
    return Response.json({ ok: false, message: "Missing transcript" }, { status: 400 });
  }
  if (!isIntentCard(body.intent)) {
    return Response.json({ ok: false, message: "Invalid intent" }, { status: 400 });
  }

  const fixture =
    process.env.INTENTLOOP_FIXTURE === "1" || body.fixture === true || !hasMetaApiKey();

  try {
    const { followUp, model, fixture: usedFixture } = await interpretVoiceFollowUp({
      transcript,
      intent: body.intent,
      fixture,
    });
    return Response.json({
      ok: true,
      followUp,
      fixture: usedFixture,
      meta: metaCallMeta(model),
    });
  } catch {
    const followUp = fixtureVoiceFollowUp(transcript);
    return Response.json({
      ok: true,
      followUp,
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
    });
  }
}
