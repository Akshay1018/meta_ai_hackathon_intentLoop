import { getMetaClient, sparkModelId } from "@/lib/meta";
import type { IntentCard } from "@/lib/schemas";

export type VoiceFollowUpRoute =
  | "/reels"
  | "/search"
  | "/dms"
  | "/create"
  | "/"
  | "/profile"
  | null;

export type VoiceFollowUp = {
  summary: string;
  navigate_to: VoiceFollowUpRoute;
  action_label: string;
  search_query: string | null;
};

const ROUTES = ["/reels", "/search", "/dms", "/create", "/", "/profile", "none"] as const;

export const VOICE_FOLLOWUP_JSON_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: ["summary", "navigate_to", "action_label", "search_query"],
  properties: {
    summary: { type: "string" },
    navigate_to: { type: "string", enum: [...ROUTES] },
    action_label: { type: "string" },
    search_query: { type: ["string", "null"] },
  },
};

function routeFromApi(value: string): VoiceFollowUpRoute {
  if (value === "none") return null;
  if (
    value === "/reels" ||
    value === "/search" ||
    value === "/dms" ||
    value === "/create" ||
    value === "/" ||
    value === "/profile"
  ) {
    return value;
  }
  return null;
}

function isVoiceFollowUpRaw(value: unknown): value is {
  summary: string;
  navigate_to: string;
  action_label: string;
  search_query: string | null;
} {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.summary === "string" &&
    typeof v.action_label === "string" &&
    typeof v.navigate_to === "string" &&
    (ROUTES as readonly string[]).includes(v.navigate_to) &&
    (v.search_query === null || typeof v.search_query === "string")
  );
}

export function fixtureVoiceFollowUp(text: string): VoiceFollowUp {
  const lower = text.toLowerCase();
  if (lower.includes("reel") || lower.includes("mountain")) {
    return {
      summary: "You wanted Reels — try the Reels tab for a quick scroll.",
      navigate_to: "/reels",
      action_label: "Open Reels",
      search_query: null,
    };
  }
  if (lower.includes("message") || lower.includes("dm") || lower.includes("inbox")) {
    return {
      summary: "Sounds like messages were on your mind.",
      navigate_to: "/dms",
      action_label: "Open messages",
      search_query: null,
    };
  }
  if (lower.includes("search") || lower.includes("find") || lower.includes("ria")) {
    const q = lower.includes("ria") ? "ria" : "posts";
    return {
      summary: "Got it — let's pull up what you asked for in Search.",
      navigate_to: "/search",
      action_label: q === "ria" ? "Search Ria" : "Open Search",
      search_query: q,
    };
  }
  return {
    summary: "Got it — we'll keep that in mind for next time.",
    navigate_to: null,
    action_label: "Back to feed",
    search_query: null,
  };
}

export async function interpretVoiceFollowUp(input: {
  transcript: string;
  intent: IntentCard;
  fixture: boolean;
}): Promise<{ followUp: VoiceFollowUp; model: string; fixture: boolean }> {
  if (input.fixture) {
    return {
      followUp: fixtureVoiceFollowUp(input.transcript),
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
          "User spoke one sentence at the end of an Instagram visit. Infer what they want next inside a mock Instagram app. " +
          "Return summary (one friendly line), navigate_to (path or null if no navigation), action_label (short button, e.g. Open Reels). " +
          "Use /reels for reels/video, /dms for messages, /search for search, /create for posting, / for home feed, /profile for profile, or none if no navigation. Never shame.",
      },
      {
        role: "user",
        content: `Visit intent: ${JSON.stringify(input.intent)}. They said: "${input.transcript}"`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "voice_follow_up",
        schema: VOICE_FOLLOWUP_JSON_SCHEMA,
        strict: true,
      },
    },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Spark returned empty content");
  const parsed: unknown = JSON.parse(raw);
  if (!isVoiceFollowUpRaw(parsed)) throw new Error("Invalid voice follow-up JSON");
  return {
    followUp: {
      summary: parsed.summary,
      navigate_to: routeFromApi(parsed.navigate_to),
      action_label: parsed.action_label,
      search_query:
        typeof parsed.search_query === "string" ? parsed.search_query.slice(0, 40) : null,
    },
    model,
    fixture: false,
  };
}
