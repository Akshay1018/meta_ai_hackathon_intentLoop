"use client";

import Link from "next/link";
import { useState } from "react";

import { IntentChip } from "@/components/intentloop/IntentChip";
import { useIntentCard } from "@/components/intentloop/useIntentCard";
import { markPostedThisVisit } from "@/lib/visit-outcome";

export function CreateComposer() {
  const { card, loading } = useIntentCard("create");
  const [caption, setCaption] = useState("");
  const [posted, setPosted] = useState(false);

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
          onClick={() => {
            setPosted(true);
            markPostedThisVisit();
          }}
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
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1493246507136-91e8fad9978e?w=800&h=800&fit=crop&q=80)",
          }}
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
      </div>
    </div>
  );
}
