/** Client-safe persona metadata (no Spark/schema exit logic). */

export const PERSONA_IDS = [
  "everyday-scroller",
  "companion-scroll",
  "dms-first",
  "creator-poster",
  "reels-binger",
  "profile-checker",
  "marketer",
  "influencer-pro",
  "busy-parent",
  "teen-agency",
] as const;

export type PersonaId = (typeof PERSONA_IDS)[number];

export type PersonaMetaTool = "spark-intent" | "spark-exit" | "spark-vision" | "voice" | "visit-card";

export type PersonaDefinition = {
  id: PersonaId;
  title: string;
  subtitle: string;
  entryHref: string;
  impactLine: string;
  metaTools: PersonaMetaTool[];
  visitScript: string;
};

export const PERSONAS: Record<PersonaId, PersonaDefinition> = {
  "everyday-scroller": {
    id: "everyday-scroller",
    title: "Everyday scroller",
    subtitle: "Feed → hops — “I only had 5 minutes”",
    entryHref: "/",
    impactLine: "Minutes tell me how long; IntentLoop tells me if the visit mattered.",
    metaTools: ["spark-intent", "spark-exit"],
    visitScript: "Home → DMs → Reels → wait for limit → visit summary.",
  },
  "companion-scroll": {
    id: "companion-scroll",
    title: "Companion-scroll",
    subtitle: "Feed while on a call — clarity, not guilt",
    entryHref: "/",
    impactLine: "Same limit banner; optional honest close when the visit ends.",
    metaTools: ["spark-intent", "spark-exit"],
    visitScript: "Stay on Home/feed only (or light tab hops) → summary — no invented DM goals.",
  },
  "dms-first": {
    id: "dms-first",
    title: "DMs-first",
    subtitle: "Opened Messages to send one reply",
    entryHref: "/dms",
    impactLine: "Silent Inbox · on intent; drift if Reels took over.",
    metaTools: ["spark-intent", "spark-exit", "voice"],
    visitScript: "DMs → Reels (drift) → summary → optional voice follow-up.",
  },
  "creator-poster": {
    id: "creator-poster",
    title: "Creator / poster",
    subtitle: "+ Create → Share — finish the post",
    entryHref: "/create",
    impactLine: "Did I post, or did Reels eat the session?",
    metaTools: ["spark-intent", "spark-exit", "spark-vision", "visit-card"],
    visitScript: "Create → Share → Reels → summary → optional screenshot match + visit card.",
  },
  "reels-binger": {
    id: "reels-binger",
    title: "Reels binger",
    subtitle: "“Just a few clips”",
    entryHref: "/reels",
    impactLine: "Reels intent + honest drift vs other goals.",
    metaTools: ["spark-intent", "spark-exit"],
    visitScript: "Reels only or Reels → Home → summary.",
  },
  "profile-checker": {
    id: "profile-checker",
    title: "Profile checker",
    subtitle: "Profile → Your activity — see the pattern",
    entryHref: "/profile/activity",
    impactLine: "Today + recent summaries in one place.",
    metaTools: ["spark-intent", "spark-exit"],
    visitScript: "Profile/activity → browse feed → summary → check Today / 7-day list.",
  },
  marketer: {
    id: "marketer",
    title: "Small business / marketer",
    subtitle: "DMs + Create for brand — did I work leads?",
    entryHref: "/dms",
    impactLine: "DMs are leads; the summary says if I actually worked the inbox.",
    metaTools: ["spark-intent", "spark-exit", "voice", "spark-vision", "visit-card"],
    visitScript: "DMs → Create → Share → summary; voice: “find Ria’s post”.",
  },
  "influencer-pro": {
    id: "influencer-pro",
    title: "Influencer / creator pro",
    subtitle: "Batch replies + ship content — closure between sessions",
    entryHref: "/dms",
    impactLine: "Reply window vs content window in one visit summary.",
    metaTools: ["spark-intent", "spark-exit", "voice", "visit-card"],
    visitScript: "DMs → Create (draft or share) → summary → visit card memento.",
  },
  "busy-parent": {
    id: "busy-parent",
    title: "Busy parent (adult)",
    subtitle: "Short check while kids are busy — stay within their limit",
    entryHref: "/",
    impactLine: "Quick check — close when done.",
    metaTools: ["spark-intent", "spark-exit"],
    visitScript: "Home only → limit sheet → Skip or summary → “close when done”.",
  },
  "teen-agency": {
    id: "teen-agency",
    title: "Teen with own limit (16+)",
    subtitle: "Mixed tabs — agency, never shame",
    entryHref: "/",
    impactLine: "Encouraging next action only — no “addicted” language.",
    metaTools: ["spark-intent", "spark-exit", "voice"],
    visitScript: "Home → Reels → DMs → summary — tone stays encouraging.",
  },
};

export function isPersonaId(value: string): value is PersonaId {
  return (PERSONA_IDS as readonly string[]).includes(value);
}

export function personaList(): PersonaDefinition[] {
  return PERSONA_IDS.map((id) => PERSONAS[id]);
}

export function personaTitle(id: PersonaId | null | undefined): string {
  if (!id || !isPersonaId(id)) return "";
  return PERSONAS[id].title;
}
