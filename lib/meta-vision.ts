import { getMetaClient, metaCallMeta, sparkModelId } from "@/lib/meta";
import type { IntentCard } from "@/lib/schemas";

export type VisionResult = {
  happened: string;
  vs_intent: string;
  next_step: string;
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
          "User missed something while scrolling (e.g. a Reel they wanted to like/share). They uploaded ONE photo they chose. " +
          "Describe what the image shows (happened), how it relates to their intent (vs_intent), and one helpful next_step " +
          "(like, save, search, or let go). Short plain language. Never shame.",
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
          required: ["happened", "vs_intent", "next_step"],
          properties: {
            happened: { type: "string" },
            vs_intent: { type: "string" },
            next_step: { type: "string" },
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
    happened: "A whole pepperoni pizza on a board with a hand lifting one slice showing stretchy cheese.",
    vs_intent: `You opened for “${intent.goal}” — this looks like a Feed post you scrolled past.`,
    next_step: "Search for the pizza post to like or save it, or let it go if you're caught up.",
  };
}
