"use client";

import { useSearchParams } from "next/navigation";

import { ReelsViewer, type ReelItem } from "@/components/ig/ReelsViewer";

type ReelsPageClientProps = {
  reels: ReelItem[];
};

export function ReelsPageClient({ reels }: ReelsPageClientProps) {
  const params = useSearchParams();
  const reel = params.get("reel");

  return (
    <div className="ig-route ig-route--reels">
      <ReelsViewer reels={reels} initialReelId={reel} />
    </div>
  );
}
