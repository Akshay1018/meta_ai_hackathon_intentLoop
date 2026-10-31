import type { VoiceFollowUpRoute } from "@/lib/voice-follow-up";

export type VisionAction = {
  navigate_to: VoiceFollowUpRoute;
  action_label: string;
  search_query: string | null;
};

export function buildSearchHref(query: string | null): string {
  if (!query?.trim()) return "/search";
  return `/search?q=${encodeURIComponent(query.trim())}`;
}

/** Infer in-app navigation from vision copy (fixture + fallback when API omits action). */
export function inferVisionAction(input: {
  happened: string;
  next_step: string;
  intentSurface: string;
}): VisionAction {
  const blob = `${input.happened} ${input.next_step}`.toLowerCase();

  const food =
    /pizza|pepperoni|food|dumpling|burger|coffee|slice|recipe|eat|restaurant|board/.test(blob);
  if (food) {
    const query = blob.includes("pizza") || blob.includes("pepperoni") ? "pizza" : "food";
    return {
      navigate_to: "/search",
      action_label: query === "pizza" ? "Search pizza" : "Search food",
      search_query: query,
    };
  }

  if (/reel|clip|video/.test(blob)) {
    return {
      navigate_to: "/reels",
      action_label: "Open Reels",
      search_query: null,
    };
  }

  if (/message|dm|inbox|reply/.test(blob)) {
    return {
      navigate_to: "/dms",
      action_label: "Open messages",
      search_query: null,
    };
  }

  if (/profile|activity/.test(blob)) {
    return {
      navigate_to: "/profile",
      action_label: "Open profile",
      search_query: null,
    };
  }

  if (/feed|home|scroll|post/.test(blob) || input.intentSurface === "home") {
    return {
      navigate_to: "/",
      action_label: "Back to feed",
      search_query: null,
    };
  }

  if (/search|find|look for/.test(blob)) {
    const m = input.next_step.match(/search for (?:the )?([a-z0-9 ]+)/i);
    const q = m?.[1]?.trim().slice(0, 40) ?? "posts";
    return {
      navigate_to: "/search",
      action_label: `Search ${q}`,
      search_query: q,
    };
  }

  return {
    navigate_to: "/",
    action_label: "Back to feed",
    search_query: null,
  };
}
