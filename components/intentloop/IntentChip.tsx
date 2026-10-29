import type { IntentCard, IntentSurface } from "@/lib/schemas";

const CHIP_LABEL: Partial<Record<IntentSurface, string>> = {
  dms: "Inbox",
  create: "Post",
  reels: "Reels",
  profile: "Profile",
};

type IntentChipProps = {
  surface: IntentSurface;
  card: IntentCard | null;
  loading: boolean;
};

export function IntentChip({ surface, card, loading }: IntentChipProps) {
  const label = CHIP_LABEL[surface];
  if (!label) return null;
  if (loading) {
    return <span className="intent-chip intent-chip--loading" aria-busy="true" />;
  }
  if (!card) return null;
  return (
    <span className="intent-chip" title={card.goal}>
      <span className="intent-chip-dot" aria-hidden />
      {label} · on intent
    </span>
  );
}
