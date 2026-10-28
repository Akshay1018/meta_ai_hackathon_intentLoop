"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useLimitTimer } from "@/components/intentloop/useLimitTimer";
import { useSessionSettings } from "@/components/intentloop/useSessionSettings";

export function ActivityPanel() {
  const search = useSearchParams();
  const showBriefHint = search.get("brief") === "1";
  const { settings, update } = useSessionSettings();
  const { remaining, phase } = useLimitTimer(settings);

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
            {phase === "open"
              ? "Limit reached"
              : settings.enabled
                ? `${remaining}s until the banner`
                : "IntentLoop is off"}
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
          <p className="activity-hint">Same idea as Instagram’s reminder. Default 15.</p>
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
          {showBriefHint ? (
            <p className="activity-hint">
              You asked for the brief. ExitBrief (Spark) lands in the next step — no extra
              API call yet.
            </p>
          ) : (
            <p className="activity-hint">No briefs yet. They show up after See brief.</p>
          )}
        </section>
      </div>
    </>
  );
}
