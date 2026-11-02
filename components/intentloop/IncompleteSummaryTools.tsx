"use client";

import { useCallback, useRef, useState } from "react";

import { ConsentBanner } from "@/components/intentloop/ConsentBanner";
import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { isRateLimited, parseRetryAfterSeconds, type ApiJson } from "@/lib/api-client";
import { webmBlobToWav } from "@/lib/client-wav";
import { rateLimitUserMessage } from "@/lib/rate-limit-messages";
import type { IntentCard } from "@/lib/schemas";
import {
  buildSearchHref,
  resolveVisionHref,
  type VisionAction,
} from "@/lib/vision-action";
import type { VoiceFollowUp } from "@/lib/voice-follow-up";

type IncompleteSummaryToolsProps = {
  intent: IntentCard;
  expanded: boolean;
  onRequestExpand: () => void;
  onVoiceLine?: (line: string) => void;
  onNavigate?: (href: string) => void;
};

type ConsentKey = "photoMatch" | "voiceSummary";

const OPEN_LOOP_TOOLS = [
  {
    id: "photo" as const,
    consent: "photoMatch" as ConsentKey,
    title: "Match a screenshot",
    subtitle: "The Reel or post you wanted — we'll compare it to why you opened IG.",
    consentMessage: "Compare one screenshot from your camera roll to your visit intent.",
    consentPrimary: "Allow photo",
  },
  {
    id: "voice" as const,
    consent: "voiceSummary" as ConsentKey,
    title: "Say what you still wanted",
    subtitle: "We'll suggest where to go next (e.g. Reels, Search).",
    consentMessage: "Use the microphone once to add what the summary missed.",
    consentPrimary: "Allow microphone",
  },
] as const;

export function IncompleteSummaryTools({
  intent,
  expanded,
  onRequestExpand,
  onVoiceLine,
  onNavigate,
}: IncompleteSummaryToolsProps) {
  const { consent, update } = useConsentSettings();
  const [pendingConsent, setPendingConsent] = useState<(typeof OPEN_LOOP_TOOLS)[number] | null>(
    null,
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<{
    happened: string;
    vs_intent: string;
    next_step: string;
    action: VisionAction;
  } | null>(null);
  const [voiceText, setVoiceText] = useState<string | null>(null);
  const [voiceFollowUp, setVoiceFollowUp] = useState<VoiceFollowUp | null>(null);
  const [recording, setRecording] = useState(false);
  const [micHint, setMicHint] = useState<string | null>(null);
  const [toolHint, setToolHint] = useState<string | null>(null);
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
    setToolHint(null);
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
      const json = (await res.json()) as ApiJson & {
        happened?: string;
        vs_intent?: string;
        next_step?: string;
        action?: VisionAction;
      };
      if (isRateLimited(res, json)) {
        const retry = parseRetryAfterSeconds(res, json);
        setToolHint(json.message ?? rateLimitUserMessage(retry));
        return;
      }
      if (json.ok && json.happened && json.action) {
        setPhotoResult({
          happened: json.happened,
          vs_intent: json.vs_intent ?? "",
          next_step: json.next_step ?? "",
          action: json.action,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  const startVoice = async () => {
    setMicHint(null);
    setToolHint(null);
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
          const json = (await res.json()) as ApiJson & { text?: string };
          if (isRateLimited(res, json)) {
            const retry = parseRetryAfterSeconds(res, json);
            setToolHint(json.message ?? rateLimitUserMessage(retry));
            return;
          }
          if (json.ok && json.text) {
            setVoiceText(json.text);
            onVoiceLine?.(json.text);
            const fu = await fetch("/api/voice-follow-up", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transcript: json.text, intent }),
            });
            const fuJson = (await fu.json()) as ApiJson & { followUp?: VoiceFollowUp };
            if (isRateLimited(fu, fuJson)) {
              const retry = parseRetryAfterSeconds(fu, fuJson);
              setToolHint(fuJson.message ?? rateLimitUserMessage(retry));
              return;
            }
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

  const onToolClick = (tool: (typeof OPEN_LOOP_TOOLS)[number]) => {
    if (consent[tool.consent]) {
      if (tool.id === "photo") runPhoto();
      else void startVoice();
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
    else void startVoice();
  };

  return (
    <section className="brief-incomplete" aria-labelledby="brief-incomplete-title">
      <div className="brief-incomplete-head">
        <p id="brief-incomplete-title" className="brief-incomplete-title">
          Summary incomplete?
        </p>
        {!expanded ? (
          <button type="button" className="brief-incomplete-toggle" onClick={onRequestExpand}>
            Not quite right?
          </button>
        ) : (
          <p className="brief-incomplete-sub">Optional — Spark vision or Voice when you need more.</p>
        )}
      </div>

      {expanded ? (
        <>
          {pendingConsent ? (
            <ConsentBanner
              message={pendingConsent.consentMessage}
              primaryLabel={pendingConsent.consentPrimary}
              onPrimary={onConsentPrimary}
              onSecondary={() => setPendingConsent(null)}
            />
          ) : null}

          {micHint ? <p className="activity-hint">{micHint}</p> : null}
          {toolHint ? <p className="activity-hint">{toolHint}</p> : null}

          <div className="visit-close-grid">
            {OPEN_LOOP_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="visit-tile"
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
          {photoResult.next_step ? (
            <p className="activity-hint">{photoResult.next_step}</p>
          ) : null}
          {resolveVisionHref(photoResult.action) ? (
            <button
              type="button"
              className="limit-btn limit-btn--primary visit-close-voice-action"
              onClick={() => {
                const href = resolveVisionHref(photoResult.action);
                if (href) onNavigate?.(href);
              }}
            >
              {photoResult.action.action_label}
            </button>
          ) : null}
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
                      onClick={() => {
                    const href =
                      voiceFollowUp.navigate_to === "/search"
                        ? buildSearchHref(voiceFollowUp.search_query ?? voiceText)
                        : voiceFollowUp.navigate_to!;
                    onNavigate?.(href);
                  }}
                    >
                      {voiceFollowUp.action_label}
                    </button>
                  ) : null}
                </>
              ) : null}
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
        </>
      ) : null}
    </section>
  );
}
