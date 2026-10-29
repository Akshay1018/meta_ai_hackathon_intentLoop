"use client";

import { useState } from "react";

import {
  IconBookmark,
  IconComment,
  IconHeart,
  IconMore,
  IconShare,
} from "@/components/ig/IgIcons";
import type { FeedPost as FeedPostType } from "@/lib/feed-types";

type FeedPostProps = {
  post: FeedPostType;
};

export function FeedPost({ post }: FeedPostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article className="post-card">
      <div className="post-head">
        <div
          className="post-avatar post-avatar--ring"
          style={{ background: `hsl(${post.hue} 50% 40%)` }}
        >
          {post.initials}
        </div>
        <div className="post-meta">
          <div className="post-user">{post.username}</div>
          {post.place ? <div className="post-place">{post.place}</div> : null}
        </div>
        <button type="button" className="ig-icon-btn" aria-label="More options">
          <IconMore size={22} />
        </button>
      </div>
      <div className="post-image-wrap">
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="post-image post-image--photo"
            src={post.imageUrl}
            alt={`Photo by ${post.username}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div
          className="post-image post-image-fallback"
          style={{
            background: `linear-gradient(145deg, hsl(${post.hue} 60% 48%), hsl(${post.hue + 40} 40% 28%))`,
          }}
          role="img"
          aria-label={`Photo by ${post.username}`}
        />
      </div>
      <div className="post-actions">
        <div className="post-actions-left">
          <button
            type="button"
            className="ig-icon-btn"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={() => setLiked((v) => !v)}
          >
            <IconHeart size={26} filled={liked} />
          </button>
          <button type="button" className="ig-icon-btn" aria-label="Comment">
            <IconComment size={26} />
          </button>
          <button type="button" className="ig-icon-btn" aria-label="Share">
            <IconShare size={26} />
          </button>
        </div>
        <button
          type="button"
          className="ig-icon-btn"
          aria-label={saved ? "Remove from saved" : "Save"}
          onClick={() => setSaved((v) => !v)}
        >
          <IconBookmark size={26} filled={saved} />
        </button>
      </div>
      <p className="post-likes">{(post.likes + (liked ? 1 : 0)).toLocaleString()} likes</p>
      <p className="post-caption">
        <strong>{post.username}</strong> {post.caption}
        <span className="post-time">{post.time}</span>
      </p>
    </article>
  );
}
