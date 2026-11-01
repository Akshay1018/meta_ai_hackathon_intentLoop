import { getMetaClient, metaCallMeta } from "@/lib/meta";
import { museSamModelId } from "@/lib/meta-env";

const WALK_PROMPT = "phone, person, crosswalk, car";
export const RECORDING_PROMPT =
  "person, phone, camera, filming, recording, behind, shoulder, pointing";

export type SegmentContext = "walk" | "recording";

export type SegmentSummary = {
  prompt: string;
  raw: string;
  nudge: string;
  alertLevel?: "none" | "caution" | "urgent";
};

function nudgeFromRecordingRaw(raw: string): string {
  const lower = raw.toLowerCase();
  const phoneCount = (lower.match(/phone/g) ?? []).length;
  const hasPerson = /person|people|someone|figure|human|face|crowd/.test(lower);
  const hasBehind = /behind|over shoulder|back|rear|second|background/.test(lower);
  const hasFilming = /film|record|camera|point|video|shoot/.test(lower);

  if ((hasPerson && hasFilming && hasBehind) || (phoneCount >= 2 && hasPerson && hasFilming)) {
    return "Someone may be recording from behind — glance around before you keep filming.";
  }
  if (phoneCount >= 2 && hasPerson) {
    return "Multiple phones in view — move somewhere private if you feel watched.";
  }
  if (hasPerson && hasFilming) {
    return "People with cameras nearby — stay aware of who is in your shot.";
  }
  if (/crosswalk|traffic|car|street|road/.test(lower)) {
    return "Busy spot — stay aware of people and traffic around you.";
  }
  if (phoneCount >= 2) {
    return "Another phone is in frame — someone may be recording you. Glance behind you.";
  }
  if (raw.length > 20) {
    return "Quick surroundings check — keep an eye on who is around you while recording.";
  }
  return "Could not confirm the scene from SAM alone — glance behind you before you keep filming.";
}

function nudgeFromWalkRaw(raw: string): string {
  const lower = raw.toLowerCase();
  const manyPhones = (lower.match(/phone/g) ?? []).length >= 2;
  if (manyPhones) {
    return "Several phones in frame — step somewhere quieter if you want more privacy while recording.";
  }
  if (raw.length > 20) {
    return "Looks like you're outside — eyes up for a block. Pocket the phone if you're crossing.";
  }
  return "Busy spot — stay aware of people and traffic around you.";
}

export async function segmentSurroundingsPhoto(input: {
  imageBase64: string;
  mime?: string;
  context?: SegmentContext;
}): Promise<{ summary: SegmentSummary; model: string }> {
  const context = input.context === "recording" ? "recording" : "walk";
  const prompt = context === "recording" ? RECORDING_PROMPT : WALK_PROMPT;
  const client = getMetaClient();
  const model = museSamModelId();
  const mime = input.mime?.startsWith("image/") ? input.mime : "image/jpeg";
  const dataUrl = `data:${mime};base64,${input.imageBase64.replace(/^data:[^;]+;base64,/, "")}`;

  // SAM 3.1 via Responses API (streams special tokens; we collect text).
  const response = await client.responses.create({
    model,
    input: [
      {
        type: "message",
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: dataUrl, detail: "auto" },
        ],
      },
    ],
  });

  const fallback = (response as { output?: unknown[] }).output?.[0];
  const fallbackText =
    fallback &&
    typeof fallback === "object" &&
    "content" in fallback &&
    Array.isArray((fallback as { content: unknown }).content)
      ? (fallback as { content: { text?: string }[] }).content[0]?.text
      : undefined;
  const raw = response.output_text ?? fallbackText ?? "";

  const nudge =
    context === "recording" ? nudgeFromRecordingRaw(raw) : nudgeFromWalkRaw(raw);

  return {
    summary: { prompt, raw: raw.slice(0, 500), nudge },
    model: metaCallMeta(model).model,
  };
}

/** @deprecated use segmentSurroundingsPhoto */
export async function segmentWalkPhoto(input: {
  imageBase64: string;
  mime?: string;
}): Promise<{ summary: SegmentSummary; model: string }> {
  return segmentSurroundingsPhoto({ ...input, context: "walk" });
}

export function fixtureSegment(context: SegmentContext = "walk"): SegmentSummary {
  if (context === "recording") {
    return {
      prompt: RECORDING_PROMPT,
      raw: "[fixture] recording surroundings",
      nudge: "Someone may be recording from behind — glance around before you keep filming.",
    };
  }
  return {
    prompt: WALK_PROMPT,
    raw: "[fixture] sam masks not requested",
    nudge: "Fixture: if you're walking, pocket the phone for a block.",
  };
}
