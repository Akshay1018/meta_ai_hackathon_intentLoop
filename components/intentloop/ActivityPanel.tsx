"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { useLimitTimer } from "@/components/intentloop/useLimitTimer";
import { useSessionSettings } from "@/components/intentloop/useSessionSettings";
import { PersonaPicker } from "@/components/intentloop/PersonaPicker";
import { TimeWhereOnDemand } from "@/components/intentloop/TimeWhereOnDemand";
import { idbReadBriefsLastDays, type StoredBriefRecord } from "@/lib/brief-idb";
import { readBriefRecords, type BriefRecord } from "@/lib/brief-history";
import { personaTitle } from "@/lib/persona-catalog";
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
  const { consent, update: updateConsent } = useConsentSettings();
  const { remaining, phase, blockReason } = useLimitTimer(settings);
  const [briefs, setBriefs] = useState<BriefRecord[]>([]);
  const [history7d, setHistory7d] = useState<StoredBriefRecord[]>([]);
  const [visitResetNonce, setVisitResetNonce] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setBriefs(readBriefRecords());
      void idbReadBriefsLastDays(7).then(setHistory7d);
    };
    const onVisitReset = () => {
      refresh();
      setVisitResetNonce((n) => n + 1);
    };
    refresh();
    window.addEventListener("intentloop:brief-saved", refresh);
    window.addEventListener("intentloop:visit-reset", onVisitReset);
    return () => {
      window.removeEventListener("intentloop:brief-saved", refresh);
      window.removeEventListener("intentloop:visit-reset", onVisitReset);
    };
  }, []);

  const startNewVisit = () => {
    resetDemoVisit();
    window.dispatchEvent(new Event("intentloop:visit-reset"));
  };

  return (
    <div className="ig-route">
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
            Resets the {limitSeconds(settings)}s timer, clears tab history and intent cache for
            this visit, then shows the limit banner again after it expires.
          </p>
          <TimeWhereOnDemand visitResetNonce={visitResetNonce} />
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

        <section className="activity-card activity-card--privacy">
          <p className="activity-kicker">Privacy</p>
          <p className="activity-sub">
            IntentLoop uses <strong>which tabs you open here</strong> and your limit — not your real
            IG password or DMs. Summaries stay <strong>on this device</strong>. Photo, voice, surroundings,
            and visit card run <strong>only when you turn them on</strong> and choose to use them.
          </p>
        </section>

        <section className="activity-card">
          <p className="activity-kicker">Optional features (your consent)</p>
          <label className="activity-row">
            <span>Match a screenshot from your photos</span>
            <input
              type="checkbox"
              checked={consent.photoMatch}
              onChange={(e) => updateConsent({ photoMatch: e.target.checked })}
            />
          </label>
          <label className="activity-row">
            <span>Surroundings check — Mac camera on Reels record / Live mock</span>
            <input
              type="checkbox"
              checked={consent.surroundingsCheck}
              onChange={(e) => updateConsent({ surroundingsCheck: e.target.checked })}
            />
          </label>
          <p className="activity-hint">
            Reels → camera → allow Mac preview, then auto/manual SAM checks while recording. Notes
            appear on your visit summary. Not used for still Create posts.
          </p>
          <label className="activity-row">
            <span>Say what you still wanted (microphone)</span>
            <input
              type="checkbox"
              checked={consent.voiceSummary}
              onChange={(e) => updateConsent({ voiceSummary: e.target.checked })}
            />
          </label>
          <label className="activity-row">
            <span>Private visit picture</span>
            <input
              type="checkbox"
              checked={consent.visitCard}
              onChange={(e) => updateConsent({ visitCard: e.target.checked })}
            />
          </label>
        </section>

        <section className="activity-card activity-card--persona">
          <p className="activity-kicker">Who you&apos;re browsing as</p>
          <p className="activity-hint">
            Pick the kind of visit that matches you — we tune the silent intent line and your limit
            summary in plain language. Optional extras (photo, voice, visit picture) still only run
            if you turn them on above.
          </p>
          <PersonaPicker />
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
                  {personaTitle(row.personaId) ? (
                    <span className="brief-list-persona">{personaTitle(row.personaId)}</span>
                  ) : null}
                  <strong>{row.intentGoal}</strong>
                  <p>{row.brief.happened}</p>
                  <p className="activity-hint">Drift {Math.round(row.brief.drift)}%</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="activity-card">
          <p className="activity-kicker">Last 7 days</p>
          {history7d.length === 0 ? (
            <p className="activity-hint">
              Saved on this device after each visit summary (Profile checker persona).
            </p>
          ) : (
            <ul className="brief-list">
              {history7d.map((row) => (
                <li key={row.id} className="brief-list-item">
                  <span className="brief-list-time">
                    {row.day} · {row.at}
                  </span>
                  {personaTitle(row.personaId) ? (
                    <span className="brief-list-persona">{personaTitle(row.personaId)}</span>
                  ) : null}
                  <strong>{row.intentGoal}</strong>
                  <p>{row.brief.happened}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
