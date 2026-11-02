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
  rateLimitHint?: string | null;
};

export function IntentChip({ surface, card, loading, rateLimitHint }: IntentChipProps) {
  const label = CHIP_LABEL[surface];
  if (!label) return null;
  if (loading) {
    return <span className="intent-chip intent-chip--loading" aria-busy="true" />;
  }
  if (rateLimitHint) {
    return (
      <span className="intent-chip intent-chip--muted" title={rateLimitHint}>
        Intent · paused
      </span>
    );
  }
  if (!card) return null;
  return (
    <span className="intent-chip" title={card.goal}>
      <span className="intent-chip-dot" aria-hidden />
      {label} · on intent
    </span>
  );
}
