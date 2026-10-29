"use client";

import { useCallback, useState } from "react";

import { IconComment, IconHeart, IconMore, IconShare } from "@/components/ig/IgIcons";
import { IntentChip } from "@/components/intentloop/IntentChip";
import { useIntentCard } from "@/components/intentloop/useIntentCard";

export type ReelItem = {
  id: string;
  user: string;
  caption: string;
  likes: string;
  hue: number;
  imageUrl?: string;
};

type ReelsViewerProps = {
  reels: ReelItem[];
};

export function ReelsViewer({ reels }: ReelsViewerProps) {
  const { card, loading } = useIntentCard("reels");
  const [index, setIndex] = useState(0);
  const reel = reels[index] ?? reels[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % reels.length);
  }, [reels.length]);

  if (!reel) return null;

  return (
    <div className="reels-shell">
      <header className="reels-topbar">
        <span className="reels-title">Reels</span>
        <IntentChip surface="reels" card={card} loading={loading} />
      </header>
      <button type="button" className="reels-stage" onClick={next} aria-label="Next reel">
        {reel.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="reels-video reels-video--photo" src={reel.imageUrl} alt="" />
        ) : (
          <div
            className="reels-video"
            style={{
              background: `linear-gradient(165deg, hsl(${reel.hue} 55% 28%), hsl(${reel.hue} 40% 12%))`,
            }}
          />
        )}
        <div className="reels-scrim" aria-hidden />
        <div className="reels-rail">
          <button type="button" className="ig-icon-btn reels-rail-btn" aria-label="Like">
            <IconHeart size={28} />
          </button>
          <button type="button" className="ig-icon-btn reels-rail-btn" aria-label="Comment">
            <IconComment size={28} />
          </button>
          <button type="button" className="ig-icon-btn reels-rail-btn" aria-label="Share">
            <IconShare size={28} />
          </button>
          <button type="button" className="ig-icon-btn reels-rail-btn" aria-label="More">
            <IconMore size={28} />
          </button>
        </div>
        <div className="reels-meta">
          <p className="reels-user">{reel.user}</p>
          <p className="reels-caption">{reel.caption}</p>
          <p className="reels-likes">{reel.likes} likes</p>
        </div>
        <div className="reels-dots">
          {reels.map((r, i) => (
            <span key={r.id} className={i === index ? "reels-dot is-active" : "reels-dot"} />
          ))}
        </div>
      </button>
    </div>
  );
}
