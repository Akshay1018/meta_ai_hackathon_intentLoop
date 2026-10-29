import { getMetaClient, metaCallMeta, sparkModelId } from "@/lib/meta";
import type { IntentCard } from "@/lib/schemas";

export type VisionResult = {
  happened: string;
  vs_intent: string;
};

export async function analyzeScreenshot(input: {
  intent: IntentCard;
  imageBase64: string;
  mime?: string;
}): Promise<{ result: VisionResult; model: string }> {
  const client = getMetaClient();
  const model = sparkModelId();
  const mime = input.mime?.startsWith("image/") ? input.mime : "image/jpeg";
  const dataUrl = `data:${mime};base64,${input.imageBase64.replace(/^data:[^;]+;base64,/, "")}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You compare a user-chosen screenshot to their session intent. Two short strings only in plain JSON: happened, vs_intent. Never shame.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Intent: ${JSON.stringify(input.intent)}. What does this screenshot show vs that intent?`,
          },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "screenshot_vs_intent",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["happened", "vs_intent"],
          properties: {
            happened: { type: "string" },
            vs_intent: { type: "string" },
          },
        },
      },
    },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Vision returned empty content");
  const parsed = JSON.parse(raw) as VisionResult;
  return { result: parsed, model: metaCallMeta(model).model };
}

export function fixtureVision(intent: IntentCard): VisionResult {
  return {
    happened: "Screenshot shows a social feed or Reels-style screen.",
    vs_intent: `Compared to “${intent.goal}”: may match or drift — fixture mode, no image sent.`,
  };
}
