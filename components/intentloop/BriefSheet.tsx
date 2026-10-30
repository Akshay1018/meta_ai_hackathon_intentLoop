"use client";

import { useState } from "react";

import { BriefSkeleton } from "@/components/intentloop/BriefSkeleton";
import { DriftRing } from "@/components/intentloop/DriftRing";
import { VisitCloseTools } from "@/components/intentloop/VisitCloseTools";
import { driftHeadline, sanitizeHappened } from "@/lib/brief-display";
import type { ExitBrief, IntentCard } from "@/lib/schemas";

type BriefSheetProps = {
  open: boolean;
  loading: boolean;
  brief: ExitBrief | null;
  intent: IntentCard | null;
  fallbackNote: string | null;
  onClose: () => void;
  onAction: () => void;
  onNavigate: (href: string) => void;
};

export function BriefSheet({
  open,
  loading,
  brief,
  intent,
  fallbackNote,
  onClose,
  onAction,
  onNavigate,
}: BriefSheetProps) {
  const [voiceLine, setVoiceLine] = useState<string | null>(null);

  if (!open) return null;

  const happened =
    brief && voiceLine
      ? `${sanitizeHappened(brief.happened)} You said: “${voiceLine}”`
      : brief
        ? sanitizeHappened(brief.happened)
        : "";

  return (
    <div className="limit-root" role="dialog" aria-modal="true" aria-labelledby="brief-title">
      <button type="button" className="limit-backdrop" aria-label="Close brief" onClick={onClose} />
      <div className="limit-sheet brief-sheet">
        <div className="limit-handle" />
        <p id="brief-title" className="limit-title">
          Visit summary
        </p>
        <p className="limit-copy limit-copy--brief">
          One honest line about this visit — not a full analytics report.
        </p>
        {loading ? (
          <BriefSkeleton />
        ) : brief ? (
          <>
            <p className="brief-drift-label">{driftHeadline(brief.drift)}</p>
            <DriftRing drift={brief.drift} />
            <p className="brief-happened">{happened}</p>
            {fallbackNote ? <p className="activity-hint">{fallbackNote}</p> : null}
            {intent ? (
              <VisitCloseTools
                intent={intent}
                brief={brief}
                onVoiceLine={setVoiceLine}
                onNavigate={onNavigate}
              />
            ) : null}
            <button type="button" className="limit-btn limit-btn--primary" onClick={onAction}>
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
