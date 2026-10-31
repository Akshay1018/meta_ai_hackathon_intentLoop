import feed from "@/mock/feed.json";
import reels from "@/mock/reels.json";
import type { FeedPost } from "@/lib/feed-types";

export type ReelSearchItem = {
  kind: "reel";
  id: string;
  user: string;
  caption: string;
  imageUrl?: string;
  hue: number;
};

export type PostSearchItem = FeedPost & { kind: "post" };

export type SearchHit = PostSearchItem | ReelSearchItem;

const posts = feed.posts as FeedPost[];
const reelList = reels.reels as Omit<ReelSearchItem, "kind">[];

export function searchMockContent(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const postHits: PostSearchItem[] = posts
    .filter((p) => {
      const blob = `${p.username} ${p.caption} ${p.place ?? ""}`.toLowerCase();
      return blob.includes(q) || (q === "food" && /dumpling|pizza|eat|coffee|slice/.test(blob));
    })
    .map((p) => ({ ...p, kind: "post" as const }));

  const reelHits: ReelSearchItem[] = reelList
    .filter((r) => {
      const blob = `${r.user} ${r.caption}`.toLowerCase();
      return blob.includes(q) || (q === "food" && /pizza|dumpling|eat/.test(blob));
    })
    .map((r) => ({ ...r, kind: "reel" as const }));

  return [...postHits, ...reelHits];
}

export function postDeepLink(postId: string): string {
  return `/?post=${encodeURIComponent(postId)}`;
}

export function reelDeepLink(reelId: string): string {
  return `/reels?reel=${encodeURIComponent(reelId)}`;
}

export function searchHitHref(hit: SearchHit): string {
  return hit.kind === "post" ? postDeepLink(hit.id) : reelDeepLink(hit.id);
}
