"use client";

import { useEffect, useMemo, useState } from "react";

import { BriefSkeleton } from "@/components/intentloop/BriefSkeleton";
import { DriftBar } from "@/components/intentloop/DriftBar";
import { TimeWhereBlock } from "@/components/intentloop/TimeWhereBlock";
import { IncompleteSummaryTools } from "@/components/intentloop/IncompleteSummaryTools";
import { PrivateVisitCard } from "@/components/intentloop/PrivateVisitCard";
import { driftHeadline, sanitizeHappened } from "@/lib/brief-display";
import {
  formatVisitPathLine,
  incompleteSectionVisible,
} from "@/lib/brief-summary-ui";
import { readSessionStartedAt } from "@/lib/session";
import type { ExitBrief, IntentCard } from "@/lib/schemas";
import { readDwellRowsForVisit } from "@/lib/visit-dwell";
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

  const visitTiming = useMemo(() => {
    if (!open || typeof window === "undefined") {
      return { visitPathLine: "", elapsedSec: 0, dwellRows: [] as ReturnType<typeof readDwellRowsForVisit> };
    }
    const startedAt = readSessionStartedAt(Date.now());
    const elapsedSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    return {
      visitPathLine: formatVisitPathLine(readSurfaceVisitOrder(), elapsedSec),
      elapsedSec,
      dwellRows: readDwellRowsForVisit(elapsedSec),
    };
  }, [open, brief?.happened]);

  if (!open) return null;

  const happened =
    brief && voiceLine
      ? `${sanitizeHappened(brief.happened)} You said: “${voiceLine}”`
      : brief
        ? sanitizeHappened(brief.happened)
        : "";

  const incompleteExpanded =
    brief != null && incompleteSectionVisible(brief.drift, userOpenedIncomplete);

  return (
    <div className="limit-root" role="dialog" aria-modal="true" aria-labelledby="brief-title">
      <button type="button" className="limit-backdrop" aria-label="Close brief" onClick={onClose} />
      <div className="limit-sheet brief-sheet">
        <div className="brief-sheet-header">
          <div className="limit-handle" />
          <p id="brief-title" className="limit-title">
            Visit summary
          </p>
          <p className="limit-copy limit-copy--brief">
            One honest line about this visit — not a full analytics report.
          </p>
        </div>

        {loading ? (
          <div className="brief-sheet-body">
            <BriefSkeleton />
          </div>
        ) : brief ? (
          <>
            <div className="brief-sheet-body">
              <section className="brief-section brief-section--metrics" aria-label="Drift and time">
                <p className="brief-drift-label">{driftHeadline(brief.drift)}</p>
                <DriftBar drift={brief.drift} />
                {visitTiming.visitPathLine ? (
                  <p className="brief-visit-path">{visitTiming.visitPathLine}</p>
                ) : null}
                <TimeWhereBlock
                  rows={visitTiming.dwellRows}
                  elapsedSec={visitTiming.elapsedSec}
                  variant="card"
                />
              </section>

              <section className="brief-section brief-section--story" aria-label="Summary">
                <p className="brief-happened">{happened}</p>
                {fallbackNote ? <p className="brief-fallback-note">{fallbackNote}</p> : null}
              </section>

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
            </div>

            <div className="brief-sheet-actions">
              <button type="button" className="limit-btn limit-btn--primary" onClick={onAction}>
                {brief.next_action}
              </button>
              <button type="button" className="limit-btn" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="brief-sheet-body">
              <p className="limit-copy">Limit reached. Brief unavailable right now.</p>
            </div>
            <div className="brief-sheet-actions">
              <button type="button" className="limit-btn" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
