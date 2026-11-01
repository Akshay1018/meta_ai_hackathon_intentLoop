"use client";

import { useCallback, useEffect, useState } from "react";

import { TimeWhereBlock } from "@/components/intentloop/TimeWhereBlock";
import {
  dwellDeltasSinceBaseline,
  readDwellRowsForVisit,
  readDwellViewBaseline,
  totalsFromRows,
  writeDwellViewBaseline,
} from "@/lib/visit-dwell";
import { readSessionStartedAt } from "@/lib/session";

const REFRESH_TOOLTIP =
  "Update this breakdown with time spent since you last refreshed. Changes since your last refresh appear next to each tab.";

type Snapshot = {
  rows: ReturnType<typeof readDwellRowsForVisit>;
  elapsedSec: number;
  deltas: ReturnType<typeof dwellDeltasSinceBaseline>;
  showDeltas: boolean;
};

type TimeWhereOnDemandProps = {
  visitResetNonce: number;
};

export function TimeWhereOnDemand({ visitResetNonce }: TimeWhereOnDemandProps) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const loadSnapshot = useCallback((mode: "initial" | "refresh") => {
    const startedAt = readSessionStartedAt(Date.now());
    const elapsedSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    const baseline = readDwellViewBaseline();
    const rows = readDwellRowsForVisit(elapsedSec);
    const showDeltas = mode === "refresh" && baseline != null;
    const deltas = showDeltas ? dwellDeltasSinceBaseline(rows, baseline) : {};
    writeDwellViewBaseline({ totalsSec: totalsFromRows(rows), elapsedSec });
    setSnapshot({ rows, elapsedSec, deltas, showDeltas });
  }, []);

  useEffect(() => {
    loadSnapshot("initial");
  }, [visitResetNonce, loadSnapshot]);

  return (
    <div className="time-where-on-demand">
      <div className="time-where-on-demand-toolbar">
        <p className="time-where-on-demand-label">Time + where</p>
        <button
          type="button"
          className="time-where-refresh"
          title={REFRESH_TOOLTIP}
          aria-label={REFRESH_TOOLTIP}
          onClick={() => loadSnapshot("refresh")}
        >
          <span className="time-where-refresh-icon" aria-hidden>
            ↻
          </span>
          Refresh
        </button>
      </div>
      {snapshot ? (
        <>
          <p className="activity-hint time-where-on-demand-hint">
            {snapshot.showDeltas
              ? "Updated — look for “since last refresh” under each tab."
              : "Where this visit has gone so far. Refresh after more scrolling to see what changed."}
          </p>
          <TimeWhereBlock
            rows={snapshot.rows}
            elapsedSec={snapshot.elapsedSec}
            deltas={snapshot.showDeltas ? snapshot.deltas : undefined}
            showHeader={false}
          />
        </>
      ) : null}
    </div>
  );
}
