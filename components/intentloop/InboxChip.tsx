import type { IntentCard } from "@/lib/schemas";

type InboxChipProps = {
  card: IntentCard | null;
  loading: boolean;
};

export function InboxChip({ card, loading }: InboxChipProps) {
  if (loading || !card) return null;
  return (
    <span className="inbox-chip" title={card.goal}>
      Inbox · on intent
    </span>
  );
}
