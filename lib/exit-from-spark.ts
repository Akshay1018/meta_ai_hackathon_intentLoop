import { getMetaClient, sparkModelId } from "@/lib/meta";
import {
  isPersonaId,
  personaExitBrief,
  personaSparkExitHint,
  type PersonaId,
} from "@/lib/personas";
import {
  EXIT_BRIEF_JSON_SCHEMA,
  fixtureExitBrief,
  isExitBrief,
  type ExitBrief,
  type ExitBriefInput,
} from "@/lib/schemas";

function resolvePersonaId(raw: string | null | undefined): PersonaId | null {
  if (raw && isPersonaId(raw)) return raw;
  return null;
}

export async function inferExitBrief(
  input: ExitBriefInput & { recap?: string },
  options: { fixture: boolean },
): Promise<{ brief: ExitBrief; model: string; fixture: boolean }> {
  const personaId = resolvePersonaId(input.personaId ?? null);
  if (options.fixture) {
    const brief = personaId ? personaExitBrief({ ...input, personaId }) : fixtureExitBrief(input);
    return {
      brief,
      model: "fixture",
      fixture: true,
    };
  }

  const client = getMetaClient();
  const model = sparkModelId();
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You write a short Instagram session ExitBrief for a normal user (not an analytics dashboard). " +
          "happened: ONE or TWO plain sentences, max 220 characters. No numbered lists, no step-by-step timeline, no '1. home 2. reels'. " +
          "Say what mattered vs what drifted in human language. postedThisVisit true → lead with posting. Never shame or medical language. " +
          "next_action: one short button label (max 56 chars), imperative. drift 0=on intent, 100=fully off. " +
          personaSparkExitHint(personaId),
      },
      {
        role: "user",
        content: JSON.stringify({
          leadIntent: input.intent,
          surfacesVisited: input.surfacesVisited,
          surfaceOrder: input.surfaceOrder,
          postedThisVisit: input.postedThisVisit,
          intentsBySurface: input.intentsBySurface,
          elapsedSec: input.elapsedSec,
          recap: input.recap ?? "",
          personaId,
        }),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "exit_brief",
        schema: EXIT_BRIEF_JSON_SCHEMA,
        strict: true,
      },
    },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Spark returned empty content");
  const parsed: unknown = JSON.parse(raw);
  if (!isExitBrief(parsed)) throw new Error("Spark JSON failed ExitBrief validation");
  return { brief: parsed, model, fixture: false };
}
