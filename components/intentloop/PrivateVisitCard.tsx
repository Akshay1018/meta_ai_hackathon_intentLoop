"use client";

import { useCallback, useState } from "react";

import { ConsentBanner } from "@/components/intentloop/ConsentBanner";
import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { driftHeadline } from "@/lib/brief-display";
import type { ExitBrief, IntentCard } from "@/lib/schemas";

type PrivateVisitCardProps = {
  intent: IntentCard;
  brief: ExitBrief;
};

export function PrivateVisitCard({ intent, brief }: PrivateVisitCardProps) {
  const { consent, update } = useConsentSettings();
  const [pendingConsent, setPendingConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cardUrl, setCardUrl] = useState<string | null>(null);

  const buildCard = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, intentGoal: intent.goal }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        backgroundBase64?: string;
        imageBase64?: string;
        lines?: { goal: string; outcome: string; hook: string };
      };
      const bg = json.backgroundBase64 ?? json.imageBase64;
      if (!json.ok || !bg || !json.lines) return;

      const w = 864;
      const h = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = `data:image/png;base64,${bg}`;
      });
      ctx.drawImage(img, 0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(48, 320, w - 96, 520);
      ctx.fillStyle = "#8e8e8e";
      ctx.textAlign = "center";
      ctx.font = "600 22px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`VISIT CARD · ${driftHeadline(brief.drift).toUpperCase()}`, w / 2, 380);
      ctx.fillStyle = "#262626";
      ctx.font = "600 36px -apple-system, BlinkMacSystemFont, sans-serif";
      wrapText(ctx, json.lines.goal.slice(0, 50), w / 2, 440, w - 120, 42);
      ctx.font = "400 28px -apple-system, BlinkMacSystemFont, sans-serif";
      wrapText(ctx, json.lines.outcome.slice(0, 100), w / 2, 540, w - 120, 34);
      ctx.font = "500 24px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#0095f6";
      ctx.fillText(json.lines.hook.slice(0, 60), w / 2, 780);

      setCardUrl(canvas.toDataURL("image/png"));
    } finally {
      setBusy(false);
    }
  }, [brief, intent.goal]);

  const onCreate = () => {
    if (consent.visitCard) {
      void buildCard();
      return;
    }
    setPendingConsent(true);
  };

  return (
    <section className="brief-memento" aria-labelledby="brief-memento-title">
      <p id="brief-memento-title" className="brief-memento-title">
        Private visit card
      </p>
      <p className="brief-memento-sub">A memento for your camera roll — not shared to your feed.</p>

      {pendingConsent ? (
        <ConsentBanner
          message="Create a private visit card on this device only (Muse Image background)."
          primaryLabel="Allow visit card"
          onPrimary={() => {
            update({ visitCard: true });
            setPendingConsent(false);
            void buildCard();
          }}
          onSecondary={() => setPendingConsent(false)}
        />
      ) : null}

      {!cardUrl ? (
        <button type="button" className="visit-tile visit-tile--wide brief-memento-btn" disabled={busy} onClick={onCreate}>
          <span className="visit-tile-title">Create visit card</span>
          <span className="visit-tile-sub">Soft background + your goal and outcome</span>
        </button>
      ) : (
        <div className="visit-close-result visit-close-result--card">
          <p className="visit-close-result-kicker">{driftHeadline(brief.drift)}</p>
          <img className="brief-session-card brief-session-card--portrait" src={cardUrl} alt="Visit card" />
          <a className="visit-close-download" href={cardUrl} download="intentloop-visit.png">
            Download card
          </a>
        </div>
      )}

      {busy ? <p className="activity-hint">Creating card…</p> : null}
    </section>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = w;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}
