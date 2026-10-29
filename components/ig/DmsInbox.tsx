"use client";

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
  const { card, loading } = useIntentCard("dms");

  return (
    <>
      <header className="ig-header">
        <span className="ig-logo" style={{ fontSize: 20, fontFamily: "inherit" }}>
          Messages
        </span>
        <IntentChip surface="dms" card={card} loading={loading} />
      </header>
      <div className="ig-scroll">
        {threads.map((thread) => (
          <div key={thread.id} className="dm-row">
            <div
              className="post-avatar"
              style={{ background: `hsl(${thread.hue} 50% 40%)`, width: 48, height: 48 }}
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
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
