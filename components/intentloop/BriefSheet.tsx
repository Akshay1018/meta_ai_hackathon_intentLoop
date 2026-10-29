"use client";

import { BriefExtras } from "@/components/intentloop/BriefExtras";
import type { ExitBrief, IntentCard } from "@/lib/schemas";

type BriefSheetProps = {
  open: boolean;
  loading: boolean;
  brief: ExitBrief | null;
  intent: IntentCard | null;
  fallbackNote: string | null;
  onClose: () => void;
  onAction: () => void;
};

export function BriefSheet({
  open,
  loading,
  brief,
  intent,
  fallbackNote,
  onClose,
  onAction,
}: BriefSheetProps) {
  if (!open) return null;

  return (
    <div className="limit-root" role="dialog" aria-modal="true" aria-labelledby="brief-title">
      <button type="button" className="limit-backdrop" aria-label="Close brief" onClick={onClose} />
      <div className="limit-sheet brief-sheet">
        <div className="limit-handle" />
        <p id="brief-title" className="limit-title">
          Visit summary
        </p>
        {loading ? (
          <p className="limit-copy">Putting your session in words…</p>
        ) : brief ? (
          <>
            <p className="brief-drift">Drift {Math.round(brief.drift)}%</p>
            <p className="brief-happened">{brief.happened}</p>
            {fallbackNote ? <p className="activity-hint">{fallbackNote}</p> : null}
            {intent ? <BriefExtras intent={intent} brief={brief} /> : null}
            <button type="button" className="limit-btn limit-btn--accent" onClick={onAction}>
              {brief.next_action}
            </button>
            <button type="button" className="limit-btn" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <p className="limit-copy">Limit reached. Brief unavailable right now.</p>
            <button type="button" className="limit-btn" onClick={onClose}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
