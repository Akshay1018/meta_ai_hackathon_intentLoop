"use client";

import Link from "next/link";
import { useState } from "react";

import { useConsentSettings } from "@/components/intentloop/useConsentSettings";
import { IntentChip } from "@/components/intentloop/IntentChip";
import { useIntentCard } from "@/components/intentloop/useIntentCard";
import { imageUrlToBase64 } from "@/lib/surroundings-from-url";
import { markPostedThisVisit } from "@/lib/visit-outcome";

import { MOCK_IMAGES } from "@/lib/mock-assets";

const PREVIEW_IMAGE = MOCK_IMAGES.create;

export function CreateComposer() {
  const { card, loading } = useIntentCard("create");
  const { consent, update: updateConsent } = useConsentSettings();
  const [caption, setCaption] = useState("");
  const [posted, setPosted] = useState(false);
  const [surroundingsNote, setSurroundingsNote] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const runSurroundingsCheck = async () => {
    setChecking(true);
    try {
      const { b64, mime } = await imageUrlToBase64(PREVIEW_IMAGE);
      const res = await fetch("/api/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: b64, mime }),
      });
      const json = (await res.json()) as { ok?: boolean; summary?: { nudge?: string } };
      if (json.ok && json.summary?.nudge) setSurroundingsNote(json.summary.nudge);
    } finally {
      setChecking(false);
    }
  };

  const onShare = () => {
    setPosted(true);
    markPostedThisVisit();
    setSurroundingsNote(null);

    const runCheck = consent.surroundingsCheck;
    if (!runCheck) {
      const ok = window.confirm(
        "Quick surroundings check after posting in public?\n\nSAM looks for phones, people, and traffic in your frame — one nudge only. You can enable this by default in Your activity.",
      );
      if (ok) {
        updateConsent({ surroundingsCheck: true });
        void runSurroundingsCheck();
      }
      return;
    }
    void runSurroundingsCheck();
  };

  return (
    <div className="ig-route ig-route--create">
      <header className="create-header">
        <Link href="/" className="create-cancel ig-icon-btn" aria-label="Close">
          ✕
        </Link>
        <span className="create-title">New post</span>
        <button
          type="button"
          className={caption.trim() ? "create-share create-share--on" : "create-share"}
          disabled={!caption.trim()}
          onClick={onShare}
        >
          Share
        </button>
      </header>
      <div className="create-subhead">
        <IntentChip surface="create" card={card} loading={loading} />
        {!loading && card ? (
          <span className="create-session-hint">Posting · that&apos;s the session</span>
        ) : null}
      </div>
      <div className="ig-scroll create-scroll">
        <div
          className="create-preview"
          style={{ backgroundImage: `url(${PREVIEW_IMAGE})` }}
        />
        <textarea
          className="create-caption"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => {
            setPosted(false);
            setCaption(e.target.value);
          }}
          rows={4}
        />
        {posted ? (
          <p className="create-toast" role="status">
            Shared to feed (mock). You can keep scrolling or close the app.
          </p>
        ) : null}
        {checking ? <p className="create-toast">Checking surroundings…</p> : null}
        {surroundingsNote ? (
          <p className="surroundings-toast" role="status">
            {surroundingsNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}
