import type { IntentCard, IntentSurface } from "@/lib/schemas";

const CHIP_LABEL: Partial<Record<IntentSurface, string>> = {
  dms: "Inbox · on intent",
  create: "Post · on intent",
  reels: "Reels · on intent",
  profile: "Profile · on intent",
};

type IntentChipProps = {
  surface: IntentSurface;
  card: IntentCard | null;
  loading: boolean;
};

export function IntentChip({ surface, card, loading }: IntentChipProps) {
  const label = CHIP_LABEL[surface];
  if (!label || loading || !card) return null;
  return (
    <span className="inbox-chip" title={card.goal}>
      {label}
    </span>
  );
}
