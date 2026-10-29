import { fixtureTranscript, transcribeAudio } from "@/lib/meta-voice";
import { hasMetaApiKey, metaCallMeta } from "@/lib/meta";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const fixtureQuery = process.env.INTENTLOOP_FIXTURE === "1";

  try {
    const form = await request.formData();
    const fixtureField = form.get("fixture") === "true";
    const fixture = fixtureQuery || fixtureField || !hasMetaApiKey();

    if (fixture) {
      return Response.json({
        ok: true,
        text: fixtureTranscript(),
        fixture: true,
        meta: metaCallMeta("fixture"),
      });
    }

    const file = form.get("audio");
    if (!file || !(file instanceof Blob)) {
      return Response.json({ ok: false, message: "Missing audio file (WAV)" }, { status: 400 });
    }

    const name = file instanceof File ? file.name : "note.wav";
    const buf = Buffer.from(await file.arrayBuffer());
    if (name.toLowerCase().endsWith(".webm") || file.type.includes("webm")) {
      return Response.json(
        {
          ok: false,
          message:
            "Meta Voice Transcribe needs WAV (16 kHz mono). Use “Upload WAV” or iOS Voice Memo exported as WAV.",
        },
        { status: 400 },
      );
    }

    const { text, model } = await transcribeAudio({ audioBytes: buf, filename: name });
    return Response.json({
      ok: true,
      text,
      fixture: false,
      meta: metaCallMeta(model),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcribe failed";
    return Response.json({
      ok: true,
      text: fixtureTranscript(),
      fixture: true,
      meta: metaCallMeta("fixture-fallback"),
      message,
    });
  }
}
