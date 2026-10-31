import { postDeepLink, reelDeepLink, searchMockContent } from "@/lib/mock-search";
import type { VoiceFollowUpRoute } from "@/lib/voice-follow-up";

export type VisionAction = {
  navigate_to: VoiceFollowUpRoute;
  action_label: string;
  search_query: string | null;
  /** Single clear feed/reel match — skip Search list */
  direct_href: string | null;
};

export function buildSearchHref(query: string | null): string {
  if (!query?.trim()) return "/search";
  return `/search?q=${encodeURIComponent(query.trim())}`;
}

export function resolveVisionHref(action: VisionAction): string | null {
  if (action.direct_href) return action.direct_href;
  if (!action.navigate_to) return null;
  if (action.navigate_to === "/search") {
    return buildSearchHref(action.search_query);
  }
  return action.navigate_to;
}

/** When search would return exactly one post or reel, deep-link instead of Search. */
export function enrichVisionAction(action: VisionAction, happened: string): VisionAction {
  const blob = `${happened} ${action.search_query ?? ""}`.toLowerCase();

  if (action.search_query) {
    const hits = searchMockContent(action.search_query);
    const posts = hits.filter((h) => h.kind === "post");
    if (posts.length === 1) {
      return {
        ...action,
        action_label: "View post",
        direct_href: postDeepLink(posts[0]!.id),
        navigate_to: null,
        search_query: null,
      };
    }
    const reels = hits.filter((h) => h.kind === "reel");
    if (posts.length === 0 && reels.length === 1) {
      return {
        ...action,
        action_label: "View Reel",
        direct_href: reelDeepLink(reels[0]!.id),
        navigate_to: null,
        search_query: null,
      };
    }
  }

  const usernames = [
    "slice.brooklyn",
    "maya.draws",
    "jordan.runs",
    "priya.eats",
    "mountain.ria",
  ];
  const mentioned = usernames.find((u) => blob.includes(u.replace(".", "")) || blob.includes(u));
  if (mentioned) {
    const hits = searchMockContent(mentioned.split(".")[0] ?? mentioned);
    const post = hits.find((h) => h.kind === "post" && h.username === mentioned);
    if (post) {
      return {
        ...action,
        action_label: "View post",
        direct_href: postDeepLink(post.id),
        navigate_to: null,
        search_query: null,
      };
    }
  }

  return { ...action, direct_href: null };
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
      direct_href: null,
    };
  }

  if (/reel|clip|video/.test(blob)) {
    return {
      navigate_to: "/reels",
      action_label: "Open Reels",
      search_query: null,
      direct_href: null,
    };
  }

  if (/message|dm|inbox|reply/.test(blob)) {
    return {
      navigate_to: "/dms",
      action_label: "Open messages",
      search_query: null,
      direct_href: null,
    };
  }

  if (/profile|activity/.test(blob)) {
    return {
      navigate_to: "/profile",
      action_label: "Open profile",
      search_query: null,
      direct_href: null,
    };
  }

  if (/feed|home|scroll|post/.test(blob) || input.intentSurface === "home") {
    return {
      navigate_to: "/",
      action_label: "Back to feed",
      search_query: null,
      direct_href: null,
    };
  }

  if (/search|find|look for/.test(blob)) {
    const m = input.next_step.match(/search for (?:the )?([a-z0-9 ]+)/i);
    const q = m?.[1]?.trim().slice(0, 40) ?? "posts";
    return {
      navigate_to: "/search",
      action_label: `Search ${q}`,
      search_query: q,
      direct_href: null,
    };
  }

  return {
    navigate_to: "/",
    action_label: "Back to feed",
    search_query: null,
    direct_href: null,
  };
}
