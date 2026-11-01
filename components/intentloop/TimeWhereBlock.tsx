"use client";

import type { IntentSurface } from "@/lib/schemas";
import { formatDwellSeconds, type DwellRow } from "@/lib/visit-dwell";

type TimeWhereBlockProps = {
  rows: DwellRow[];
  elapsedSec: number;
  compact?: boolean;
  variant?: "default" | "card";
  deltas?: Partial<Record<IntentSurface, number>>;
  showHeader?: boolean;
};

function formatDelta(seconds: number): string {
  if (seconds === 0) return "No change";
  const sign = seconds > 0 ? "+" : "−";
  return `${sign}${formatDwellSeconds(Math.abs(seconds))} since last refresh`;
}

export function TimeWhereBlock({
  rows,
  elapsedSec,
  compact = false,
  variant = "default",
  deltas,
  showHeader = true,
}: TimeWhereBlockProps) {
  if (rows.length === 0) {
    return (
      <p className="time-where-empty">
        Hop between tabs to see where this visit goes — Feed, Reels, Messages, and more.
      </p>
    );
  }

  const attributed = rows.reduce((s, r) => s + r.seconds, 0);
  const otherSec = Math.max(0, Math.round(elapsedSec - attributed));

  const rootClass = [
    "time-where",
    compact ? "time-where--compact" : "",
    variant === "card" ? "time-where--card" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {showHeader ? (
        <div className="time-where-head">
          <span className="time-where-title">Time + where</span>
          <span className="time-where-total">{formatDwellSeconds(elapsedSec)} visit</span>
        </div>
      ) : (
        <p className="time-where-total time-where-total--solo">
          {formatDwellSeconds(elapsedSec)} this visit
        </p>
      )}
      <div className="time-where-stack" role="img" aria-label="Time per tab this visit">
        {rows.map((row) => (
          <div
            key={row.surface}
            className={`time-where-seg time-where-seg--${row.surface}`}
            style={{ flexGrow: Math.max(row.percent, 4) }}
            title={`${row.label} ${formatDwellSeconds(row.seconds)}`}
          />
        ))}
      </div>
      <ul className="time-where-legend">
        {rows.map((row) => (
          <li key={row.surface} className="time-where-row">
            <span className={`time-where-dot time-where-dot--${row.surface}`} aria-hidden />
            <span className="time-where-label">{row.label}</span>
            <span className="time-where-meta">
              {formatDwellSeconds(row.seconds)} · {row.percent}%
              {deltas && deltas[row.surface] != null ? (
                <span className="time-where-delta"> · {formatDelta(deltas[row.surface]!)}</span>
              ) : null}
            </span>
          </li>
        ))}
        {otherSec >= 1 ? (
          <li className="time-where-row time-where-row--other">
            <span className="time-where-dot time-where-dot--other" aria-hidden />
            <span className="time-where-label">Other (Search, Shop…)</span>
            <span className="time-where-meta">{formatDwellSeconds(otherSec)}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
