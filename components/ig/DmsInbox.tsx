"use client";

import { IconDm } from "@/components/ig/IgIcons";
import { IntentChip } from "@/components/intentloop/IntentChip";
import { useIntentCard } from "@/components/intentloop/useIntentCard";

export type DmThread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
  initials: string;
  hue: number;
};

type DmsInboxProps = {
  threads: DmThread[];
};

export function DmsInbox({ threads }: DmsInboxProps) {
  const { card, loading, rateLimitHint } = useIntentCard("dms");

  return (
    <div className="ig-route">
      <header className="ig-header ig-header--messages">
        <span className="messages-title">you</span>
        <div className="messages-head-actions">
          <IntentChip surface="dms" card={card} loading={loading} rateLimitHint={rateLimitHint} />
          <button type="button" className="ig-icon-btn" aria-label="New message">
            <IconDm size={22} />
          </button>
        </div>
      </header>
      <div className="ig-scroll">
        {threads.map((thread) => (
          <button key={thread.id} type="button" className="dm-row dm-row-btn">
            <div
              className="post-avatar post-avatar--ring"
              style={{ background: `hsl(${thread.hue} 50% 40%)`, width: 56, height: 56 }}
            >
              {thread.initials}
            </div>
            <div className="dm-body">
              <div className="dm-top">
                <span className={thread.unread ? "dm-name dm-name--unread" : "dm-name"}>
                  {thread.name}
                </span>
                <span className="dm-time">{thread.time}</span>
              </div>
              <p className={thread.unread ? "dm-preview dm-preview--unread" : "dm-preview"}>
                {thread.preview}
                {thread.unread ? <span className="dm-unread-dot" aria-label="Unread" /> : null}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
