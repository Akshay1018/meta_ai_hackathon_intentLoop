import { Suspense } from "react";

import { ReelsPageClient } from "@/components/ig/ReelsPageClient";
import type { ReelItem } from "@/components/ig/ReelsViewer";
import reels from "@/mock/reels.json";

export default function ReelsPage() {
  return (
    <Suspense fallback={<div className="ig-route ig-placeholder">Loading Reels…</div>}>
      <ReelsPageClient reels={reels.reels as ReelItem[]} />
    </Suspense>
  );
}
