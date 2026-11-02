"use client";

import Link from "next/link";
import { useState } from "react";

import {
  IconChevronRight,
  IconClose,
  IconLocation,
  IconMusic,
  IconTagPeople,
} from "@/components/ig/IgIcons";
import { IntentChip } from "@/components/intentloop/IntentChip";
import { useIntentCard } from "@/components/intentloop/useIntentCard";
import { MOCK_IMAGES } from "@/lib/mock-assets";
import { markPostedThisVisit } from "@/lib/visit-outcome";

const PREVIEW_IMAGE = MOCK_IMAGES.create;

const CREATE_ROWS = [
  { id: "tag", label: "Tag people", Icon: IconTagPeople },
  { id: "location", label: "Add location", Icon: IconLocation },
  { id: "music", label: "Add music", Icon: IconMusic },
] as const;

export function CreateComposer() {
  const { card, loading, rateLimitHint } = useIntentCard("create");
  const [caption, setCaption] = useState("");
  const [posted, setPosted] = useState(false);

  const onShare = () => {
    setPosted(true);
    markPostedThisVisit();
  };

  return (
    <div className="ig-route ig-route--create">
      <header className="create-header">
        <Link href="/" className="create-cancel ig-icon-btn" aria-label="Close">
          <IconClose size={22} />
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
        <IntentChip surface="create" card={card} loading={loading} rateLimitHint={rateLimitHint} />
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
          rows={3}
        />
        <ul className="create-options" aria-label="Post options">
          {CREATE_ROWS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button type="button" className="create-option-row">
                <span className="create-option-icon">
                  <Icon size={22} />
                </span>
                <span className="create-option-label">{label}</span>
                <IconChevronRight size={18} className="create-option-chevron" />
              </button>
            </li>
          ))}
        </ul>
        {posted ? (
          <p className="create-toast" role="status">
            Shared to feed (mock). You can keep scrolling or close the app.
          </p>
        ) : null}
      </div>
    </div>
  );
}
