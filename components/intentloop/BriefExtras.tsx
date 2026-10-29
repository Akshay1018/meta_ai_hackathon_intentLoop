"use client";

import { useCallback, useRef, useState } from "react";

import type { ExitBrief, IntentCard } from "@/lib/schemas";

type BriefExtrasProps = {
  intent: IntentCard;
  brief: ExitBrief;
};

type Line = { id: string; label: string; text: string };

export function BriefExtras({ intent, brief }: BriefExtrasProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [cardB64, setCardB64] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const shotRef = useRef<HTMLInputElement>(null);
  const walkRef = useRef<HTMLInputElement>(null);
  const wavRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((label: string, text: string) => {
    setLines((prev) => [{ id: `${Date.now()}`, label, text }, ...prev].slice(0, 6));
  }, []);

  const readFileB64 = (file: File) =>
    new Promise<{ b64: string; mime: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result ?? "");
        const [, meta, b64] = dataUrl.match(/^data:([^;]+);base64,(.+)$/) ?? [];
        if (!b64) reject(new Error("Bad image"));
        else resolve({ b64, mime: meta ?? file.type });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const onScreenshot = async (file: File) => {
    setBusy("vision");
    try {
      const { b64, mime } = await readFileB64(file);
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, imageBase64: b64, mime }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        happened?: string;
        vs_intent?: string;
      };
      if (json.ok && json.happened) {
        addLine("Screenshot", `${json.happened} ${json.vs_intent ?? ""}`.trim());
      }
    } finally {
      setBusy(null);
    }
  };

  const onWalkPhoto = async (file: File) => {
    setBusy("segment");
    try {
      const { b64, mime } = await readFileB64(file);
      const res = await fetch("/api/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: b64, mime }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        summary?: { nudge?: string };
      };
      if (json.ok && json.summary?.nudge) addLine("Walk check", json.summary.nudge);
    } finally {
      setBusy(null);
    }
  };

  const onWav = async (file: File) => {
    setBusy("voice");
    try {
      const form = new FormData();
      form.append("audio", file, file.name);
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const json = (await res.json()) as { ok?: boolean; text?: string; message?: string };
      if (json.ok && json.text) addLine("Voice note", json.text);
      else if (json.message) addLine("Voice", json.message);
    } finally {
      setBusy(null);
    }
  };

  const onSessionCard = async () => {
    setBusy("card");
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, intentGoal: intent.goal }),
      });
      const json = (await res.json()) as { ok?: boolean; imageBase64?: string };
      if (json.ok && json.imageBase64) setCardB64(json.imageBase64);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="brief-extras">
      <p className="brief-extras-title">Optional proof (you choose)</p>
      <div className="brief-extras-row">
        <button type="button" className="brief-extras-btn" disabled={!!busy} onClick={() => shotRef.current?.click()}>
          Screenshot
        </button>
        <button type="button" className="brief-extras-btn" disabled={!!busy} onClick={() => walkRef.current?.click()}>
          Walk photo
        </button>
        <button type="button" className="brief-extras-btn" disabled={!!busy} onClick={() => wavRef.current?.click()}>
          Voice (WAV)
        </button>
        <button type="button" className="brief-extras-btn" disabled={!!busy} onClick={() => void onSessionCard()}>
          Session card
        </button>
      </div>
      {busy ? <p className="activity-hint">Calling Meta ({busy})…</p> : null}
      <input
        ref={shotRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onScreenshot(f);
          e.target.value = "";
        }}
      />
      <input
        ref={walkRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onWalkPhoto(f);
          e.target.value = "";
        }}
      />
      <input
        ref={wavRef}
        type="file"
        accept="audio/wav,audio/x-wav"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onWav(f);
          e.target.value = "";
        }}
      />
      {lines.map((line) => (
        <div key={line.id} className="brief-extra-line">
          <strong>{line.label}</strong>
          <p>{line.text}</p>
        </div>
      ))}
      {cardB64 ? (
        <img
          className="brief-session-card"
          src={`data:image/png;base64,${cardB64}`}
          alt="Session card generated by Muse Image"
        />
      ) : null}
    </div>
  );
}
