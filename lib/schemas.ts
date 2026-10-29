export const INTENT_SURFACES = [
  "home",
  "reels",
  "dms",
  "create",
  "profile",
] as const;

export type IntentSurface = (typeof INTENT_SURFACES)[number];

export type IntentCard = {
  goal: string;
  app: "instagram" | "facebook" | "other";
  surface: IntentSurface;
  source: "inferred";
  success: string;
  max_minutes: number;
  avoid: string;
  check_in_prompt: string;
};

export const INTENT_CARD_JSON_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: [
    "goal",
    "app",
    "surface",
    "source",
    "success",
    "max_minutes",
    "avoid",
    "check_in_prompt",
  ],
  properties: {
    goal: { type: "string" },
    app: { type: "string", enum: ["instagram", "facebook", "other"] },
    surface: { type: "string", enum: [...INTENT_SURFACES] },
    source: { type: "string", enum: ["inferred"] },
    success: { type: "string" },
    max_minutes: { type: "number" },
    avoid: { type: "string" },
    check_in_prompt: { type: "string" },
  },
};

export const SURFACE_HINTS: Record<IntentSurface, string> = {
  home: "Browsing feed and stories.",
  reels: "Watching Reels (high drift).",
  dms: "Opened the inbox to read or reply to messages.",
  create: "Opened the composer to post.",
  profile: "Opened their own profile / activity.",
};

export function isIntentSurface(value: string): value is IntentSurface {
  return (INTENT_SURFACES as readonly string[]).includes(value);
}

export function isIntentCard(value: unknown): value is IntentCard {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.goal === "string" &&
    v.goal.length > 0 &&
    (v.app === "instagram" || v.app === "facebook" || v.app === "other") &&
    typeof v.surface === "string" &&
    isIntentSurface(v.surface) &&
    v.source === "inferred" &&
    typeof v.success === "string" &&
    typeof v.max_minutes === "number" &&
    typeof v.avoid === "string" &&
    typeof v.check_in_prompt === "string"
  );
}

export function fixtureIntentCard(surface: IntentSurface): IntentCard {
  const hints: Record<IntentSurface, Omit<IntentCard, "surface" | "source" | "app">> =
    {
      home: {
        goal: "Browse feed and stories",
        success: "Caught up on a few posts",
        max_minutes: 15,
        avoid: "",
        check_in_prompt: "Still browsing, or done?",
      },
      reels: {
        goal: "Watch Reels",
        success: "Saw a few clips",
        max_minutes: 15,
        avoid: "",
        check_in_prompt: "Still watching Reels?",
      },
      dms: {
        goal: "Reply in DMs",
        success: "Message sent or drafted",
        max_minutes: 15,
        avoid: "Reels",
        check_in_prompt: "Still on replies, or did Reels take over?",
      },
      create: {
        goal: "Post",
        success: "Post shared or saved as draft",
        max_minutes: 15,
        avoid: "Reels after posting",
        check_in_prompt: "Did you finish the post?",
      },
      profile: {
        goal: "Check profile",
        success: "Looked at profile or activity",
        max_minutes: 15,
        avoid: "",
        check_in_prompt: "Still on your profile?",
      },
    };
  return { app: "instagram", surface, source: "inferred", ...hints[surface] };
}

export type ExitBrief = {
  drift: number;
  happened: string;
  next_action: string;
  tone: "neutral" | "encouraging";
};

export const EXIT_BRIEF_JSON_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: ["drift", "happened", "next_action", "tone"],
  properties: {
    drift: { type: "number" },
    happened: { type: "string" },
    next_action: { type: "string" },
    tone: { type: "string", enum: ["neutral", "encouraging"] },
  },
};

export function isExitBrief(value: unknown): value is ExitBrief {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.drift === "number" &&
    v.drift >= 0 &&
    v.drift <= 100 &&
    typeof v.happened === "string" &&
    v.happened.length > 0 &&
    typeof v.next_action === "string" &&
    v.next_action.length > 0 &&
    (v.tone === "neutral" || v.tone === "encouraging")
  );
}

export type ExitBriefInput = {
  intent: IntentCard;
  surfacesVisited: IntentSurface[];
  surfaceOrder: IntentSurface[];
  elapsedSec: number;
  postedThisVisit: boolean;
  intentsBySurface?: Partial<Record<IntentSurface, IntentCard>>;
};

export function fixtureExitBrief(input: ExitBriefInput): ExitBrief {
  const { intent, surfacesVisited, postedThisVisit } = input;
  const touchedReels = surfacesVisited.includes("reels");
  const touchedDms = surfacesVisited.includes("dms");
  const touchedCreate = surfacesVisited.includes("create");

  if (postedThisVisit && intent.surface === "create") {
    const drift = touchedReels && touchedDms ? 55 : touchedReels ? 40 : 18;
    return {
      drift,
      happened: touchedReels
        ? "You shared a post, then Reels (and other tabs) pulled you away from a single job."
        : "You shared a post this visit — that was the main win.",
      next_action: touchedDms ? "Check DMs if anything still needs a reply, then close." : "Close the app — posting is done.",
      tone: "encouraging",
    };
  }

  const drifted = touchedReels && intent.surface === "dms";
  const drift = drifted ? 68 : surfacesVisited.length <= 1 ? 12 : 42;
  return {
    drift,
    happened: drifted
      ? `You opened for ${intent.goal.toLowerCase()}, but Reels showed up in this visit.`
      : `Most of this visit stayed on ${intent.goal.toLowerCase()}.`,
    next_action:
      intent.surface === "dms"
        ? "Open DMs and send the one reply."
        : `Finish: ${intent.success}`,
    tone: "neutral",
  };
}

