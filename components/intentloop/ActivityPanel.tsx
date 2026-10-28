"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLimitTimer } from "@/components/intentloop/useLimitTimer";
import { useSessionSettings } from "@/components/intentloop/useSessionSettings";
import { readBriefRecords, type BriefRecord } from "@/lib/brief-history";
import { limitSeconds, resetDemoVisit } from "@/lib/session";

function timerHint(input: {
  enabled: boolean;
  demoCompact: boolean;
  maxMinutes: number;
  phase: string;
  remaining: number;
  blockReason: string;
}): string {
  if (!input.enabled) return "IntentLoop is off — turn it on to get the limit banner.";
  if (input.blockReason === "skipped") {
    return "Banner hidden for this visit (Skip or visit summary). Start a new visit below to test again.";
  }
  if (input.blockReason === "snoozed") {
    return "Reminder snoozed — banner hidden until the snooze ends.";
  }
  if (input.phase === "open") return "Limit reached — check any tab for the bottom sheet.";
  const limit = input.demoCompact ? "45s demo" : `${input.maxMinutes} min`;
  return `${input.remaining}s until the banner (${limit}, counted from when you opened this tab session — not only time on Home).`;
}

export function ActivityPanel() {
  const { settings, update } = useSessionSettings();
  const { remaining, phase, blockReason } = useLimitTimer(settings);
  const [briefs, setBriefs] = useState<BriefRecord[]>([]);

  useEffect(() => {
    const refresh = () => setBriefs(readBriefRecords());
    refresh();
    window.addEventListener("intentloop:brief-saved", refresh);
    return () => window.removeEventListener("intentloop:brief-saved", refresh);
  }, []);

  const startNewVisit = () => {
    resetDemoVisit();
    window.dispatchEvent(new Event("intentloop:visit-reset"));
  };

  return (
    <>
      <header className="ig-header">
        <Link href="/profile" className="activity-back">
          ‹
        </Link>
        <span className="activity-title">Your activity</span>
        <span />
      </header>
      <div className="ig-scroll activity-scroll">
        <section className="activity-card">
          <p className="activity-kicker">Time spent</p>
          <p className="activity-metric">
            {settings.demoCompact ? "Demo clock" : "This visit"}
          </p>
          <p className="activity-sub">
            {timerHint({
              enabled: settings.enabled,
              demoCompact: settings.demoCompact,
              maxMinutes: settings.maxMinutes,
              phase,
              remaining,
              blockReason,
            })}
          </p>
          <button type="button" className="activity-reset-btn" onClick={startNewVisit}>
            Start new visit (demo)
          </button>
          <p className="activity-hint">
            Resets the {limitSeconds(settings)}s timer and shows the limit banner again after
            it expires.
          </p>
        </section>

        <section className="activity-card">
          <label className="activity-row" htmlFor="daily-limit">
            <span>Daily limit</span>
            <input
              id="daily-limit"
              className="activity-input"
              type="number"
              min={1}
              max={180}
              value={settings.maxMinutes}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) update({ maxMinutes: Math.min(180, Math.max(1, n)) });
              }}
            />
            <span className="activity-unit">min</span>
          </label>
          <p className="activity-hint">
            With demo mode on, the app uses 45 seconds instead of this value.
          </p>
        </section>

        <section className="activity-card">
          <label className="activity-row">
            <span>IntentLoop</span>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
            />
          </label>
          <label className="activity-row">
            <span>Demo: 15 min → 45 seconds</span>
            <input
              type="checkbox"
              checked={settings.demoCompact}
              onChange={(e) => update({ demoCompact: e.target.checked })}
            />
          </label>
        </section>

        <section className="activity-card">
          <p className="activity-kicker">Today</p>
          {briefs.length === 0 ? (
            <p className="activity-hint">Summaries appear here after you tap See visit summary.</p>
          ) : (
            <ul className="brief-list">
              {briefs.map((row) => (
                <li key={row.id} className="brief-list-item">
                  <span className="brief-list-time">{row.at}</span>
                  <strong>{row.intentGoal}</strong>
                  <p>{row.brief.happened}</p>
                  <p className="activity-hint">Drift {Math.round(row.brief.drift)}%</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
