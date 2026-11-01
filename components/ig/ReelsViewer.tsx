"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type KeyboardEvent, type MouseEvent } from "react";

import { IconCamera, IconComment, IconHeart, IconMore, IconShare } from "@/components/ig/IgIcons";

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
  initialReelId?: string | null;
};

export function ReelsViewer({ reels, initialReelId }: ReelsViewerProps) {
  const router = useRouter();
  const startIndex =
    initialReelId != null && initialReelId !== ""
      ? reels.findIndex((r) => r.id === initialReelId)
      : 0;
  const [index, setIndex] = useState(startIndex >= 0 ? startIndex : 0);
  const reel = reels[index] ?? reels[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % reels.length);
  }, [reels.length]);

  const stopTap = useCallback((e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  if (!reel) return null;

  return (
    <div className="reels-shell">
      <header className="reels-topbar">
        <span className="reels-title">Reels</span>
        <button
          type="button"
          className="ig-icon-btn reels-camera-btn"
          aria-label="Camera"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/reels/record");
          }}
        >
          <IconCamera size={24} />
        </button>
      </header>
      <div
        className="reels-stage"
        role="button"
        tabIndex={0}
        onClick={next}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            next();
          }
        }}
        aria-label="Next reel"
      >
        {reel.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="reels-video reels-video--photo"
            src={reel.imageUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
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
          <button
            type="button"
            className="ig-icon-btn reels-rail-btn"
            aria-label="Like"
            onClick={stopTap}
          >
            <IconHeart size={28} />
          </button>
          <button
            type="button"
            className="ig-icon-btn reels-rail-btn"
            aria-label="Comment"
            onClick={stopTap}
          >
            <IconComment size={28} />
          </button>
          <button
            type="button"
            className="ig-icon-btn reels-rail-btn"
            aria-label="Share"
            onClick={stopTap}
          >
            <IconShare size={28} />
          </button>
          <button
            type="button"
            className="ig-icon-btn reels-rail-btn"
            aria-label="More"
            onClick={stopTap}
          >
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
      </div>
    </div>
  );
}
