import { getMetaClient, sparkModelId } from "@/lib/meta";
import {
  EXIT_BRIEF_JSON_SCHEMA,
  fixtureExitBrief,
  isExitBrief,
  type ExitBrief,
  type ExitBriefInput,
} from "@/lib/schemas";

export async function inferExitBrief(
  input: ExitBriefInput & { recap?: string },
  options: { fixture: boolean },
): Promise<{ brief: ExitBrief; model: string; fixture: boolean }> {
  if (options.fixture) {
    return {
      brief: fixtureExitBrief(input),
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
          "You write a short Instagram session ExitBrief. Use surfaceOrder and postedThisVisit — each visit must get a distinct accurate happened line. If postedThisVisit is true, lead with posting. Never shame. drift 0=on intent, 100=fully off.",
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
