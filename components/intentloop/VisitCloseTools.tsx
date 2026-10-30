"use client";

import { useCallback, useRef, useState } from "react";

import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { driftHeadline, visitCardHook } from "@/lib/brief-display";
import { webmBlobToWav } from "@/lib/client-wav";
import type { ExitBrief, IntentCard } from "@/lib/schemas";

type VisitCloseToolsProps = {
  intent: IntentCard;
  brief: ExitBrief;
  onVoiceLine?: (line: string) => void;
};

type Panel = "menu" | "photo" | "voice" | "card" | null;

export function VisitCloseTools({ intent, brief, onVoiceLine }: VisitCloseToolsProps) {
  const { consent, update } = useConsentSettings();
  const [panel, setPanel] = useState<Panel>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<{
    happened: string;
    vs_intent: string;
    next_step: string;
  } | null>(null);
  const [voiceText, setVoiceText] = useState<string | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const ensureConsent = useCallback(
    (key: keyof typeof consent, label: string): boolean => {
      if (consent[key]) return true;
      const ok = window.confirm(
        `${label}\n\nOnly when you choose. Processed for this summary — not saved to your feed. Turn on anytime in Your activity.`,
      );
      if (ok) update({ [key]: true });
      return ok;
    },
    [consent, update],
  );

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
    if (!ensureConsent("voiceSummary", "Hold to add your visit in one sentence.")) return;
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
          }
        } finally {
          setBusy(null);
        }
      };
      mediaRef.current = rec;
      rec.start();
      setRecording(true);
      setPanel("voice");
    } catch {
      window.alert("Microphone access is needed only while you hold record.");
    }
  };

  const stopVoice = () => {
    mediaRef.current?.stop();
  };

  const buildCard = async () => {
    if (!ensureConsent("visitCard", "Save a private visit card to your device.")) return;
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

      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = `data:image/png;base64,${bg}`;
      });
      ctx.drawImage(img, 0, 0, 1024, 1024);
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillRect(64, 280, 896, 460);
      ctx.fillStyle = "#262626";
      ctx.textAlign = "center";
      ctx.font = "600 42px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(json.lines.goal.slice(0, 60), 512, 360);
      ctx.font = "400 32px -apple-system, BlinkMacSystemFont, sans-serif";
      const outcome = json.lines.outcome.slice(0, 120);
      wrapText(ctx, outcome, 512, 430, 820, 38);
      ctx.font = "600 28px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#0095f6";
      ctx.fillText(json.lines.hook.slice(0, 70), 512, 640);

      setCardUrl(canvas.toDataURL("image/png"));
      setPanel("card");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="visit-close">
      <p className="visit-close-title">More help closing this visit</p>

      {panel === null ? (
        <div className="visit-close-actions">
          <button
            type="button"
            className="visit-close-btn"
            disabled={!!busy}
            onClick={() => {
              if (!ensureConsent("photoMatch", "Compare one photo from your camera roll.")) return;
              setPanel("photo");
              photoRef.current?.click();
            }}
          >
            Still looking for something?
          </button>
          <button
            type="button"
            className="visit-close-btn"
            disabled={!!busy || recording}
            onClick={() => void startVoice()}
          >
            Say it in one sentence
          </button>
          <button
            type="button"
            className="visit-close-btn"
            disabled={!!busy}
            onClick={() => void buildCard()}
          >
            Save visit card
          </button>
        </div>
      ) : null}

      {recording ? (
        <div className="visit-close-panel">
          <p className="activity-hint">Recording… release to finish.</p>
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
        </div>
      ) : null}

      {cardUrl ? (
        <div className="visit-close-result">
          <p className="visit-close-result-kicker">Visit card · {driftHeadline(brief.drift)}</p>
          <img className="brief-session-card" src={cardUrl} alt="Visit card you can save" />
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

