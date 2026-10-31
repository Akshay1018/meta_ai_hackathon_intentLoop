import type { ExitBrief, ExitBriefInput, IntentCard, IntentSurface } from "@/lib/schemas";
import { fixtureExitBrief, fixtureIntentCard } from "@/lib/schemas";

import { PERSONAS, type PersonaId } from "@/lib/persona-catalog";

export type { PersonaId };

const SHAME_RE = /addict|lazy|waste|pathetic|shouldn't|should not/i;

function clampDrift(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function noShameCopy(text: string): string {
  if (SHAME_RE.test(text)) {
    return "You moved across a few tabs — pick one small next step if you want.";
  }
  return text;
}

export function personaIntentCard(surface: IntentSurface, personaId: PersonaId | null): IntentCard {
  const base = fixtureIntentCard(surface);
  if (!personaId) return base;

  const overrides: Partial<Record<PersonaId, Partial<Record<IntentSurface, Partial<IntentCard>>>>> =
    {
      "everyday-scroller": {
        home: {
          goal: "Quick scroll the feed",
          success: "Caught up briefly",
          check_in_prompt: "Still scrolling, or ready to close?",
        },
      },
      "companion-scroll": {
        home: {
          goal: "Keep scrolling while on a call",
          success: "Stayed present — no pressure to “finish a task”",
          avoid: "Inventing a DM or post goal",
          check_in_prompt: "Still keeping company with the feed?",
        },
      },
      "dms-first": {
        dms: {
          goal: "Open DMs and send the one reply",
          success: "One thread answered",
          avoid: "Reels rabbit hole",
        },
      },
      "creator-poster": {
        create: {
          goal: "Finish and share today's post",
          success: "Post shared to feed",
          avoid: "Endless Reels after posting",
        },
      },
      "reels-binger": {
        reels: {
          goal: "Watch a few Reels clips",
          success: "Saw a handful of clips",
          avoid: "Promising “just one more” past your limit",
        },
      },
      "profile-checker": {
        profile: {
          goal: "Check profile and today's activity",
          success: "Saw time and recent summaries",
        },
      },
      marketer: {
        dms: {
          goal: "Reply to customer leads in DMs",
          success: "Lead threads touched",
          avoid: "Only scrolling feed promos",
        },
        create: {
          goal: "Post today's promo or update",
          success: "Promo post shared",
        },
      },
      "influencer-pro": {
        dms: {
          goal: "Batch replies in inbox",
          success: "Collab DMs cleared or drafted",
        },
        create: {
          goal: "Ship content for this session",
          success: "Draft or post ready",
        },
      },
      "busy-parent": {
        home: {
          goal: "Quick check while kids are busy",
          success: "In and out within your limit",
          max_minutes: 15,
          check_in_prompt: "Done with this check?",
        },
      },
      "teen-agency": {
        home: {
          goal: "Browse on your terms",
          success: "You chose when to stop",
          check_in_prompt: "Want one more tab or close?",
        },
      },
    };

  const patch = overrides[personaId]?.[surface];
  return patch ? { ...base, ...patch, surface, source: "inferred", app: "instagram" } : base;
}

export function personaSparkIntentHint(personaId: PersonaId | null): string {
  if (!personaId) return "";
  const p = PERSONAS[personaId];
  return (
    `Active user persona: ${p.title}. ${p.subtitle}. Tone: neutral, never shame, not medical. ` +
    `For companion-scroll, do NOT invent DM or post goals unless the tab is dms/create. ` +
    `For teen-agency, encouraging only — never "addicted" language.`
  );
}

export function personaSparkExitHint(personaId: PersonaId | null): string {
  if (!personaId) return "";
  const p = PERSONAS[personaId];
  return `Persona: ${p.title}. One-sentence impact: ${p.impactLine} Match summary copy to this life context.`;
}

export function personaExitBrief(input: ExitBriefInput & { personaId?: PersonaId | null }): ExitBrief {
  const personaId = input.personaId ?? null;
  const order = input.surfaceOrder.length ? input.surfaceOrder : input.surfacesVisited;
  const touchedReels = order.includes("reels");
  const touchedDms = order.includes("dms");
  const touchedCreate = order.includes("create");
  const touchedProfile = order.includes("profile");
  const tabCount = new Set(order).size;

  if (!personaId) {
    return fixtureExitBrief(input);
  }

  const intent = personaIntentCard(input.intent.surface, personaId);
  const baseInput = { ...input, intent };

  if (personaId === "creator-poster" && input.postedThisVisit) {
    const brief = fixtureExitBrief({ ...baseInput, intent: personaIntentCard("create", personaId) });
    return {
      ...brief,
      happened: touchedReels
        ? "You shared a post — main win done — then Reels pulled you after posting."
        : "You shared a post this visit — that was the main win.",
      next_action: touchedDms ? "Check DMs if a lead still needs you." : "Close — posting is done.",
      tone: "encouraging",
    };
  }

  if (personaId === "everyday-scroller") {
    const drift = tabCount >= 3 ? 48 : tabCount === 2 ? 35 : 22;
    return {
      drift: clampDrift(drift),
      happened:
        tabCount >= 3
          ? "Mostly browsing — feed, messages, and Reels — no single job stood out."
          : "A short scroll visit — mostly feed and stories.",
      next_action: touchedDms ? "Send one reply if something's open, then close." : "Close when you're caught up.",
      tone: "neutral",
    };
  }

  if (personaId === "companion-scroll") {
    const drift = touchedReels && !touchedDms && !touchedCreate ? 38 : tabCount <= 1 ? 15 : 28;
    return {
      drift: clampDrift(drift),
      happened:
        tabCount <= 1 && !touchedDms
          ? "No one task — mostly feed while you had something else going on."
          : "Tabs drifted a bit — still no pressure to finish a fake “job.”",
      next_action: "Close the app or stay on feed — your call.",
      tone: "neutral",
    };
  }

  if (personaId === "dms-first") {
    const brief = fixtureExitBrief(baseInput);
    if (touchedReels && intent.surface === "dms") {
      return {
        ...brief,
        drift: clampDrift(72),
        happened: "You opened for DMs and the one reply, but Reels showed up in this visit.",
        next_action: "Open DMs and send the one reply.",
      };
    }
    return {
      ...brief,
      drift: clampDrift(touchedDms && !touchedReels ? 14 : 40),
      happened: touchedReels ? brief.happened : "Most of this visit stayed on inbox and replies.",
      next_action: "Open DMs and send the one reply.",
      tone: "neutral",
    };
  }

  if (personaId === "reels-binger") {
    const drift = touchedDms || touchedCreate ? 55 : 78;
    return {
      drift: clampDrift(drift),
      happened:
        touchedReels && tabCount <= 2
          ? "Reels dominated this visit — clips took most of the time."
          : "Reels led, with a few other tabs mixed in.",
      next_action: touchedDms ? "Check DMs if you still owe a reply." : "Close Reels when you're done.",
      tone: "neutral",
    };
  }

  if (personaId === "profile-checker") {
    return {
      drift: clampDrift(touchedProfile ? 18 : 32),
      happened: touchedProfile
        ? "You checked profile and activity — summaries build up under Today and the last 7 days."
        : "Profile and feed mixed — open Your activity to see today's pattern.",
      next_action: "Open Your activity to review today's summaries.",
      tone: "neutral",
    };
  }

  if (personaId === "marketer") {
    if (input.postedThisVisit && touchedDms) {
      return {
        drift: clampDrift(42),
        happened: "Posting done; DMs still open — leads may need one more reply.",
        next_action: "Open DMs and answer the hottest lead thread.",
        tone: "neutral",
      };
    }
    if (input.postedThisVisit) {
      return {
        drift: clampDrift(25),
        happened: "Promo post is up — inbox work might still be waiting.",
        next_action: "Check DMs for customer questions.",
        tone: "encouraging",
      };
    }
    if (touchedDms && !input.postedThisVisit) {
      return {
        drift: clampDrift(58),
        happened: "You worked DMs but didn't ship the promo post yet.",
        next_action: "Open Create and share today's promo.",
        tone: "neutral",
      };
    }
  }

  if (personaId === "influencer-pro") {
    const drift = input.postedThisVisit ? 30 : touchedCreate ? 45 : 52;
    return {
      drift: clampDrift(drift),
      happened: input.postedThisVisit
        ? "Content shipped this session — inbox may still have batch replies waiting."
        : touchedDms
          ? "Reply window happened; content window still open for next time."
          : "Mixed inbox and browse — pick reply batch or content next session.",
      next_action: touchedDms ? "Finish batch replies in DMs." : "Open Create to ship the next post.",
      tone: "encouraging",
    };
  }

  if (personaId === "busy-parent") {
    return {
      drift: clampDrift(tabCount >= 3 ? 44 : 20),
      happened: "Quick check while kids were busy — you stayed within the limit you set.",
      next_action: "Close Instagram — you're done for this check.",
      tone: "encouraging",
    };
  }

  if (personaId === "teen-agency") {
    const touchedHome = order.includes("home");
    const brief = fixtureExitBrief(baseInput);
    const happened =
      touchedReels && touchedHome
        ? "You mixed feed and Reels — pick one small next step if you want, or close."
        : touchedReels
          ? "Reels took this visit — close whenever you want."
          : "You browsed on your terms this visit.";
    return {
      ...brief,
      drift: clampDrift(brief.drift),
      happened: noShameCopy(happened),
      next_action: "Do one thing you meant to do, or close — your choice.",
      tone: "encouraging",
    };
  }

  return fixtureExitBrief(baseInput);
}

export type PersonaScenario = {
  personaId: PersonaId;
  name: string;
  surfaceOrder: IntentSurface[];
  postedThisVisit: boolean;
  leadSurface: IntentSurface;
  expectHappened: RegExp;
  expectNext: RegExp;
  driftMin?: number;
  driftMax?: number;
};

export const PERSONA_SCENARIOS: PersonaScenario[] = [
  {
    personaId: "everyday-scroller",
    name: "Feed → DMs → Reels hop",
    surfaceOrder: ["home", "dms", "reels"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /mostly browsing|no single job/i,
    expectNext: /reply|close/i,
  },
  {
    personaId: "everyday-scroller",
    name: "Feed only",
    surfaceOrder: ["home"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /scroll|feed|stories/i,
    expectNext: /close|caught/i,
  },
  {
    personaId: "companion-scroll",
    name: "Feed only on call",
    surfaceOrder: ["home"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /no one task|feed/i,
    expectNext: /close|feed/i,
  },
  {
    personaId: "companion-scroll",
    name: "Light drift to Reels",
    surfaceOrder: ["home", "reels"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /drift|no pressure|feed/i,
    expectNext: /close|feed/i,
  },
  {
    personaId: "dms-first",
    name: "DMs then Reels drift",
    surfaceOrder: ["dms", "reels"],
    postedThisVisit: false,
    leadSurface: "dms",
    expectHappened: /reels|reply|dm/i,
    expectNext: /dm|reply/i,
    driftMin: 40,
  },
  {
    personaId: "dms-first",
    name: "DMs only on intent",
    surfaceOrder: ["home", "dms"],
    postedThisVisit: false,
    leadSurface: "dms",
    expectHappened: /inbox|reply|dm/i,
    expectNext: /reply/i,
    driftMax: 25,
  },
  {
    personaId: "creator-poster",
    name: "Posted then Reels",
    surfaceOrder: ["create", "reels"],
    postedThisVisit: true,
    leadSurface: "create",
    expectHappened: /shared a post|main win/i,
    expectNext: /close|dm/i,
  },
  {
    personaId: "creator-poster",
    name: "Posted clean exit",
    surfaceOrder: ["home", "create"],
    postedThisVisit: true,
    leadSurface: "create",
    expectHappened: /shared a post|main win/i,
    expectNext: /close/i,
  },
  {
    personaId: "reels-binger",
    name: "Reels only",
    surfaceOrder: ["reels"],
    postedThisVisit: false,
    leadSurface: "reels",
    expectHappened: /reels dominated/i,
    expectNext: /close|reels/i,
    driftMin: 70,
  },
  {
    personaId: "reels-binger",
    name: "Reels plus DMs",
    surfaceOrder: ["reels", "dms"],
    postedThisVisit: false,
    leadSurface: "reels",
    expectHappened: /reels/i,
    expectNext: /dm|reply|close/i,
  },
  {
    personaId: "profile-checker",
    name: "Activity + feed",
    surfaceOrder: ["profile", "home"],
    postedThisVisit: false,
    leadSurface: "profile",
    expectHappened: /activity|profile|7 days|today/i,
    expectNext: /activity/i,
  },
  {
    personaId: "profile-checker",
    name: "Profile only",
    surfaceOrder: ["profile"],
    postedThisVisit: false,
    leadSurface: "profile",
    expectHappened: /profile|activity/i,
    expectNext: /activity/i,
  },
  {
    personaId: "marketer",
    name: "Post + open DMs",
    surfaceOrder: ["create", "dms"],
    postedThisVisit: true,
    leadSurface: "dms",
    expectHappened: /posting done|promo|dm/i,
    expectNext: /dm|lead/i,
  },
  {
    personaId: "marketer",
    name: "DMs without post",
    surfaceOrder: ["dms", "home"],
    postedThisVisit: false,
    leadSurface: "dms",
    expectHappened: /dm|promo|post/i,
    expectNext: /create|promo/i,
  },
  {
    personaId: "influencer-pro",
    name: "Batch DMs session",
    surfaceOrder: ["dms", "create"],
    postedThisVisit: false,
    leadSurface: "dms",
    expectHappened: /reply|inbox|content/i,
    expectNext: /dm|create/i,
  },
  {
    personaId: "influencer-pro",
    name: "Shipped content",
    surfaceOrder: ["dms", "create"],
    postedThisVisit: true,
    leadSurface: "create",
    expectHappened: /content|shipped|inbox/i,
    expectNext: /dm|reply|create/i,
  },
  {
    personaId: "busy-parent",
    name: "Quick home check",
    surfaceOrder: ["home"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /quick check|limit/i,
    expectNext: /close/i,
  },
  {
    personaId: "busy-parent",
    name: "Check with tab hops",
    surfaceOrder: ["home", "dms", "reels"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /quick check|limit/i,
    expectNext: /close/i,
  },
  {
    personaId: "teen-agency",
    name: "Mixed tabs encouraging",
    surfaceOrder: ["home", "reels", "dms"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /feed|reels|choice|terms/i,
    expectNext: /choice|close|one thing/i,
  },
  {
    personaId: "teen-agency",
    name: "No shame language",
    surfaceOrder: ["reels"],
    postedThisVisit: false,
    leadSurface: "home",
    expectHappened: /reels|browse|terms|step/i,
    expectNext: /choice|close|one thing/i,
  },
];

export function runPersonaScenario(scenario: PersonaScenario): ExitBrief {
  const surfacesVisited = [...new Set(scenario.surfaceOrder)];
  const intent = personaIntentCard(scenario.leadSurface, scenario.personaId);
  return personaExitBrief({
    intent,
    surfacesVisited,
    surfaceOrder: scenario.surfaceOrder,
    elapsedSec: 45,
    postedThisVisit: scenario.postedThisVisit,
    personaId: scenario.personaId,
  });
}
