"use client";

import { useCallback, useRef, useState } from "react";

import { ConsentBanner } from "@/components/intentloop/ConsentBanner";
import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { driftHeadline } from "@/lib/brief-display";
import { webmBlobToWav } from "@/lib/client-wav";
import type { ExitBrief, IntentCard } from "@/lib/schemas";
import type { VoiceFollowUp } from "@/lib/voice-follow-up";

type VisitCloseToolsProps = {
  intent: IntentCard;
  brief: ExitBrief;
  onVoiceLine?: (line: string) => void;
  onNavigate?: (href: string) => void;
};

type ConsentKey = "photoMatch" | "voiceSummary" | "visitCard";

const TOOLS = [
  {
    id: "photo" as const,
    consent: "photoMatch" as ConsentKey,
    title: "Still looking?",
    subtitle: "Upload a photo — Spark compares it to what you came for",
    consentMessage: "Compare one photo from your camera roll to your visit intent.",
    consentPrimary: "Allow photo",
  },
  {
    id: "voice" as const,
    consent: "voiceSummary" as ConsentKey,
    title: "Say it in one sentence",
    subtitle: "Hold to speak — we'll suggest a next step",
    consentMessage: "Add your visit in one sentence with the microphone.",
    consentPrimary: "Allow microphone",
  },
  {
    id: "card" as const,
    consent: "visitCard" as ConsentKey,
    title: "Visit card",
    subtitle: "Private image for your camera roll",
    consentMessage: "Create a private visit card on this device only.",
    consentPrimary: "Allow visit card",
  },
];

export function VisitCloseTools({
  intent,
  brief,
  onVoiceLine,
  onNavigate,
}: VisitCloseToolsProps) {
  const { consent, update } = useConsentSettings();
  const [pendingConsent, setPendingConsent] = useState<(typeof TOOLS)[number] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<{
    happened: string;
    vs_intent: string;
    next_step: string;
  } | null>(null);
  const [voiceText, setVoiceText] = useState<string | null>(null);
  const [voiceFollowUp, setVoiceFollowUp] = useState<VoiceFollowUp | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [micHint, setMicHint] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const grantConsent = useCallback(
    (key: ConsentKey) => {
      update({ [key]: true });
    },
    [update],
  );

  const runPhoto = () => {
    photoRef.current?.click();
  };

  const onPhotoPick = async (file: File) => {
    setBusy("photo");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!m) return;
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, imageBase64: m[2], mime: m[1] }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        happened?: string;
        vs_intent?: string;
        next_step?: string;
      };
      if (json.ok && json.happened) {
        setPhotoResult({
          happened: json.happened,
          vs_intent: json.vs_intent ?? "",
          next_step: json.next_step ?? "If this is the one, save it — then close.",
        });
      }
    } finally {
      setBusy(null);
    }
  };

  const startVoice = async () => {
    setMicHint(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setBusy("voice");
        try {
          const webm = new Blob(chunksRef.current, { type: "audio/webm" });
          const wav = await webmBlobToWav(webm);
          const form = new FormData();
          form.append("audio", wav, "note.wav");
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const json = (await res.json()) as { ok?: boolean; text?: string };
          if (json.ok && json.text) {
            setVoiceText(json.text);
            onVoiceLine?.(json.text);
            const fu = await fetch("/api/voice-follow-up", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transcript: json.text, intent }),
            });
            const fuJson = (await fu.json()) as { ok?: boolean; followUp?: VoiceFollowUp };
            if (fuJson.ok && fuJson.followUp) setVoiceFollowUp(fuJson.followUp);
          }
        } finally {
          setBusy(null);
        }
      };
      mediaRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      setMicHint("Microphone access is needed only while you record.");
    }
  };

  const stopVoice = () => {
    mediaRef.current?.stop();
  };

  const buildCard = async () => {
    setBusy("card");
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
      setBusy(null);
    }
  };

  const onToolClick = (tool: (typeof TOOLS)[number]) => {
    if (consent[tool.consent]) {
      if (tool.id === "photo") runPhoto();
      else if (tool.id === "voice") void startVoice();
      else void buildCard();
      return;
    }
    setPendingConsent(tool);
  };

  const onConsentPrimary = () => {
    if (!pendingConsent) return;
    grantConsent(pendingConsent.consent);
    const tool = pendingConsent;
    setPendingConsent(null);
    if (tool.id === "photo") runPhoto();
    else if (tool.id === "voice") void startVoice();
    else void buildCard();
  };

  return (
    <div className="visit-close">
      <p className="visit-close-title">Need help closing this visit?</p>
      <p className="visit-close-sub">Optional — uses Meta AI only when you tap a tile.</p>

      {pendingConsent ? (
        <ConsentBanner
          message={pendingConsent.consentMessage}
          primaryLabel={pendingConsent.consentPrimary}
          onPrimary={onConsentPrimary}
          onSecondary={() => setPendingConsent(null)}
        />
      ) : null}

      {micHint ? <p className="activity-hint">{micHint}</p> : null}

      <div className="visit-close-grid">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={tool.id === "card" ? "visit-tile visit-tile--wide" : "visit-tile"}
            disabled={!!busy || recording}
            onClick={() => onToolClick(tool)}
          >
            <span className="visit-tile-title">{tool.title}</span>
            <span className="visit-tile-sub">{tool.subtitle}</span>
          </button>
        ))}
      </div>

      {recording ? (
        <div className="visit-close-panel">
          <p className="activity-hint">Recording… tap Release when finished.</p>
          <button type="button" className="limit-btn limit-btn--primary" onClick={stopVoice}>
            Release
          </button>
        </div>
      ) : null}

      {photoResult ? (
        <div className="visit-close-result">
          <p className="visit-close-result-kicker">About this photo</p>
          <p>{photoResult.happened}</p>
          <p className="activity-hint">{photoResult.vs_intent}</p>
          <p>
            <strong>Next:</strong> {photoResult.next_step}
          </p>
        </div>
      ) : null}

      {voiceText ? (
        <div className="visit-close-result">
          <p className="visit-close-result-kicker">In your words</p>
          <p>{voiceText}</p>
          {voiceFollowUp ? (
            <>
              <p className="visit-close-voice-summary">{voiceFollowUp.summary}</p>
              {voiceFollowUp.navigate_to ? (
                <button
                  type="button"
                  className="limit-btn limit-btn--primary visit-close-voice-action"
                  onClick={() => onNavigate?.(voiceFollowUp.navigate_to!)}
                >
                  {voiceFollowUp.action_label}
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      {cardUrl ? (
        <div className="visit-close-result visit-close-result--card">
          <p className="visit-close-result-kicker">Visit card · {driftHeadline(brief.drift)}</p>
          <img className="brief-session-card brief-session-card--portrait" src={cardUrl} alt="Visit card" />
          <a className="visit-close-download" href={cardUrl} download="intentloop-visit.png">
            Download card
          </a>
        </div>
      ) : null}

      {busy ? <p className="activity-hint">Working… ({busy})</p> : null}

      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onPhotoPick(f);
          e.target.value = "";
        }}
      />
    </div>
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
