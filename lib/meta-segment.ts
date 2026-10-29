import { getMetaClient, metaCallMeta } from "@/lib/meta";
import { museSamModelId } from "@/lib/meta-env";

const WALK_PROMPT = "phone, person, crosswalk, car";

export type SegmentSummary = {
  prompt: string;
  raw: string;
  nudge: string;
};

export async function segmentWalkPhoto(input: {
  imageBase64: string;
  mime?: string;
}): Promise<{ summary: SegmentSummary; model: string }> {
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
          { type: "input_text", text: WALK_PROMPT },
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
    raw.length > 20
      ? "Scene check: phone or traffic nearby — one glance, then pocket the phone if you're walking."
      : "Could not read masks; stay aware if you're moving.";

  return {
    summary: { prompt: WALK_PROMPT, raw: raw.slice(0, 500), nudge },
    model: metaCallMeta(model).model,
  };
}

export function fixtureSegment(): SegmentSummary {
  return {
    prompt: WALK_PROMPT,
    raw: "[fixture] sam masks not requested",
    nudge: "Fixture: if you're walking, pocket the phone for a block.",
  };
}
