"use client";

import { useEffect, useMemo, useState } from "react";

import { BriefSkeleton } from "@/components/intentloop/BriefSkeleton";
import { DriftBar } from "@/components/intentloop/DriftBar";
import { IncompleteSummaryTools } from "@/components/intentloop/IncompleteSummaryTools";
import { PrivateVisitCard } from "@/components/intentloop/PrivateVisitCard";
import { driftHeadline, sanitizeHappened } from "@/lib/brief-display";
import {
  formatVisitPathLine,
  incompleteSectionVisible,
  shouldAutoExpandIncompleteSection,
} from "@/lib/brief-summary-ui";
import { readSessionStartedAt } from "@/lib/session";
import type { ExitBrief, IntentCard } from "@/lib/schemas";
import { readSurfaceVisitOrder } from "@/lib/visit-tracker";

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
  const [userOpenedIncomplete, setUserOpenedIncomplete] = useState(false);

  useEffect(() => {
    if (!open) {
      setVoiceLine(null);
      setUserOpenedIncomplete(false);
    }
  }, [open]);

  const visitPathLine = useMemo(() => {
    if (!open || typeof window === "undefined") return "";
    const startedAt = readSessionStartedAt(Date.now());
    const elapsedSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    return formatVisitPathLine(readSurfaceVisitOrder(), elapsedSec);
  }, [open, brief?.happened]);

  if (!open) return null;

  const happened =
    brief && voiceLine
      ? `${sanitizeHappened(brief.happened)} You said: “${voiceLine}”`
      : brief
        ? sanitizeHappened(brief.happened)
        : "";

  const incompleteExpanded =
    brief != null &&
    incompleteSectionVisible(brief.drift, userOpenedIncomplete);

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
            <DriftBar drift={brief.drift} />
            {visitPathLine ? <p className="brief-visit-path">{visitPathLine}</p> : null}
            <p className="brief-happened">{happened}</p>
            {fallbackNote ? <p className="activity-hint">{fallbackNote}</p> : null}
            {intent ? (
              <>
                <IncompleteSummaryTools
                  intent={intent}
                  expanded={incompleteExpanded}
                  onRequestExpand={() => setUserOpenedIncomplete(true)}
                  onVoiceLine={setVoiceLine}
                  onNavigate={onNavigate}
                />
                <PrivateVisitCard intent={intent} brief={brief} />
              </>
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
