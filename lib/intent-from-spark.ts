import {
  fixtureIntentCard,
  INTENT_CARD_JSON_SCHEMA,
  isIntentCard,
  SURFACE_HINTS,
  type IntentCard,
  type IntentSurface,
} from "@/lib/schemas";
import { getMetaClient, sparkModelId } from "@/lib/meta";

export async function inferIntentCard(
  surface: IntentSurface,
  options: { fixture: boolean },
): Promise<{ card: IntentCard; model: string; fixture: boolean }> {
  if (options.fixture) {
    return { card: fixtureIntentCard(surface), model: "fixture", fixture: true };
  }

  const client = getMetaClient();
  const model = sparkModelId();
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You infer a short Instagram session intent from which tab the user opened. " +
          "Never diagnose health. Never shame. source must be inferred. app is instagram.",
      },
      {
        role: "user",
        content: `Tab: ${surface}. Meaning: ${SURFACE_HINTS[surface]}. Fill the JSON schema.`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "intent_card",
        schema: INTENT_CARD_JSON_SCHEMA,
        strict: true,
      },
    },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Spark returned empty content");
  }
  const parsed: unknown = JSON.parse(raw);
  if (!isIntentCard(parsed)) {
    throw new Error("Spark JSON failed IntentCard validation");
  }
  return {
    card: { ...parsed, surface, source: "inferred", app: "instagram" },
    model,
    fixture: false,
  };
}
