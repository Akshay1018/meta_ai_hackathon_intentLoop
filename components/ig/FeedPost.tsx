import type { FeedPost as FeedPostType } from "@/lib/feed-types";

type FeedPostProps = {
  post: FeedPostType;
};

export function FeedPost({ post }: FeedPostProps) {
  return (
    <article>
      <div className="post-head">
        <div
          className="post-avatar"
          style={{ background: `hsl(${post.hue} 50% 40%)` }}
        >
          {post.initials}
        </div>
        <div className="post-meta">
          <div className="post-user">{post.username}</div>
          <div className="post-place">{post.place}</div>
        </div>
        <span aria-hidden="true">⋯</span>
      </div>
      <div
        className="post-image"
        style={{
          background: `linear-gradient(145deg, hsl(${post.hue} 60% 48%), hsl(${post.hue + 40} 40% 28%))`,
        }}
        role="img"
        aria-label={`Photo by ${post.username}`}
      />
      <div className="post-actions" aria-hidden="true">
        <span>♡</span>
        <span>💬</span>
        <span>✈</span>
      </div>
      <p className="post-likes">{post.likes.toLocaleString()} likes</p>
      <p className="post-caption">
        <strong>{post.username}</strong> {post.caption}
        <span className="post-time">{post.time}</span>
      </p>
    </article>
  );
}
