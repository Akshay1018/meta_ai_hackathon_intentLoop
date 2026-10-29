import { ReelsViewer, type ReelItem } from "@/components/ig/ReelsViewer";
import reels from "@/mock/reels.json";

export default function ReelsPage() {
  return (
    <div className="ig-route ig-route--reels">
      <ReelsViewer reels={reels.reels as ReelItem[]} />
    </div>
  );
}
