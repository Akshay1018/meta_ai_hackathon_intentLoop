import { getMetaClient, metaCallMeta, sparkModelId } from "@/lib/meta";

export type RecordingSurroundingsAnalysis = {
  alert_level: "none" | "caution" | "urgent";
  second_device_filming: boolean;
  person_filming_from_behind: boolean;
  nudge: string;
};

const SURROUNDINGS_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: [
    "alert_level",
    "second_device_filming",
    "person_filming_from_behind",
    "nudge",
  ],
  properties: {
    alert_level: { type: "string", enum: ["none", "caution", "urgent"] },
    second_device_filming: { type: "boolean" },
    person_filming_from_behind: { type: "boolean" },
    nudge: { type: "string" },
  },
};

export function isRecordingSurroundingsAnalysis(
  value: unknown,
): value is RecordingSurroundingsAnalysis {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.alert_level === "none" || v.alert_level === "caution" || v.alert_level === "urgent") &&
    typeof v.second_device_filming === "boolean" &&
    typeof v.person_filming_from_behind === "boolean" &&
    typeof v.nudge === "string" &&
    v.nudge.length > 0
  );
}

export function fixtureRecordingSurroundings(): RecordingSurroundingsAnalysis {
  return {
    alert_level: "urgent",
    second_device_filming: true,
    person_filming_from_behind: true,
    nudge: "Someone may be recording from behind — turn around or move before you keep filming.",
  };
}

/** Muse Spark image understanding — primary nudge for selfie record / Live preview. */
export async function analyzeRecordingSurroundings(input: {
  imageBase64: string;
  mime?: string;
  samRaw?: string;
}): Promise<{ analysis: RecordingSurroundingsAnalysis; model: string }> {
  const client = getMetaClient();
  const model = sparkModelId();
  const mime = input.mime?.startsWith("image/") ? input.mime : "image/jpeg";
  const dataUrl = `data:${mime};base64,${input.imageBase64.replace(/^data:[^;]+;base64,/, "")}`;
  const samNote =
    input.samRaw && input.samRaw.trim().length > 0
      ? `SAM 3.1 segmentation notes (objects/masks): ${input.samRaw.slice(0, 400)}`
      : "SAM 3.1 returned no text tokens for this frame.";

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You help someone who is recording a selfie-style reel on a phone. They uploaded ONE frame from their live front camera. " +
          "Look for privacy/safety issues: a second phone or camera pointed at them (especially near head/shoulders/behind them), " +
          "another person filming from behind, crowds, traffic, or distractions. " +
          "If you see a second handset, mirror reflection of a recorder, or arms holding a phone behind the subject, set second_device_filming true. " +
          "If someone appears to be filming from behind the subject, set person_filming_from_behind true. " +
          "alert_level urgent = clear second device or person filming them; caution = possible concern; none = no meaningful threat in frame. " +
          "nudge: ONE short sentence (max 140 chars), direct and calm — tell them what to do (glance behind, move, pause filming). " +
          "Never say 'all clear' if a second phone is visible. Never shame.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Front-camera recording frame. ${samNote}. Return JSON only.`,
          },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "recording_surroundings",
        strict: true,
        schema: SURROUNDINGS_SCHEMA,
      },
    },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Recording surroundings vision returned empty content");
  const parsed: unknown = JSON.parse(raw);
  if (!isRecordingSurroundingsAnalysis(parsed)) {
    throw new Error("Recording surroundings JSON failed validation");
  }
  return { analysis: parsed, model: metaCallMeta(model).model };
}

export function mergeSamAndVisionNudge(input: {
  samRaw: string;
  analysis: RecordingSurroundingsAnalysis;
}): string {
  const { analysis, samRaw } = input;
  const lower = samRaw.toLowerCase();
  const phoneHits = (lower.match(/phone|mobile|cell|smartphone/g) ?? []).length;

  if (analysis.alert_level === "urgent" || analysis.second_device_filming) {
    return analysis.nudge;
  }
  if (analysis.person_filming_from_behind) {
    return analysis.nudge;
  }
  if (phoneHits >= 2 && analysis.alert_level !== "none") {
    return analysis.nudge;
  }
  if (analysis.alert_level === "caution") {
    return analysis.nudge;
  }
  if (phoneHits >= 2) {
    return "Multiple phones in view — someone may be recording you. Glance behind before you continue.";
  }
  return analysis.nudge;
}
