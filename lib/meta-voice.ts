import { META_API_BASE_URL } from "@/lib/meta";
import { metaCallMeta } from "@/lib/meta";
import { museVoiceModelId } from "@/lib/meta-env";

export async function transcribeAudio(input: {
  audioBytes: Buffer;
  filename: string;
}): Promise<{ text: string; model: string }> {
  const apiKey = process.env.MODEL_API_KEY?.trim();
  if (!apiKey) throw new Error("MODEL_API_KEY is not set");

  const model = museVoiceModelId();
  const requestJson = JSON.stringify({
    model,
    audioEncoding: "WAV",
    mode: "PUSH_TO_TALK",
  });

  const form = new FormData();
  form.append(
    "request",
    new Blob([requestJson], { type: "application/json" }),
  );
  form.append(
    "audio",
    new Blob([new Uint8Array(input.audioBytes)], { type: "audio/wav" }),
    input.filename.endsWith(".wav") ? input.filename : "note.wav",
  );

  const res = await fetch(`${META_API_BASE_URL}/asr/transcribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Transcribe failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const json = (await res.json()) as { transcript?: string; text?: string };
  const text = (json.transcript ?? json.text ?? "").trim();
  if (!text) throw new Error("Transcribe returned empty text");
  return { text, model: metaCallMeta(model).model };
}

export function fixtureTranscript(): string {
  return "I meant to reply in DMs but got pulled into Reels.";
}
