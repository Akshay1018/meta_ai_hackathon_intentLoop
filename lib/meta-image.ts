import { getMetaClient, metaCallMeta } from "@/lib/meta";
import { museImageModelId } from "@/lib/meta-env";
import type { ExitBrief } from "@/lib/schemas";

export async function generateSessionCard(brief: ExitBrief, intentGoal: string): Promise<{
  imageBase64: string;
  model: string;
}> {
  const client = getMetaClient();
  const model = museImageModelId();
  const prompt =
    `Minimal Instagram-style session card, soft gradient, no logos, no text in image. ` +
    `Mood: calm closure after a social app visit. Theme: ${intentGoal}. ` +
    `Drift level ${Math.round(brief.drift)} percent. Abstract, not a screenshot.`;

  const result = await client.images.generate({
    model,
    prompt,
    size: "1024x1024",
    n: 1,
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("Muse Image returned no image");
  return { imageBase64: b64, model: metaCallMeta(model).model };
}

export function fixtureSessionCard(): string {
  // 1×1 PNG placeholder (dark gray)
  return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
}
