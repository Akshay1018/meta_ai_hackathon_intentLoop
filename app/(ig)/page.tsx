import { Suspense } from "react";

import { FeedHome } from "@/components/ig/FeedHome";
import type { FeedData } from "@/lib/feed-types";
import feed from "@/mock/feed.json";

const data = feed as FeedData;

export default function HomePage() {
  return (
    <Suspense fallback={<div className="ig-route ig-placeholder">Loading feed…</div>}>
      <FeedHome data={data} />
    </Suspense>
  );
}
