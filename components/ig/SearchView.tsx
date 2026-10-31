"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { IconSearch } from "@/components/ig/IgIcons";
import feed from "@/mock/feed.json";
import type { FeedPost } from "@/lib/feed-types";

const posts = feed.posts as FeedPost[];

export function SearchView() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return posts.filter((p) => {
      const blob = `${p.username} ${p.caption} ${p.place ?? ""}`.toLowerCase();
      return blob.includes(q) || (q === "food" && /dumpling|pizza|eat|coffee|slice/.test(blob));
    });
  }, [q]);

  return (
    <div className="ig-route">
      <header className="ig-header ig-header--search">
        <div className="search-field search-field--active">
          <IconSearch size={16} />
          <input
            type="search"
            defaultValue={params.get("q") ?? ""}
            placeholder="Search"
            aria-label="Search"
            readOnly
          />
        </div>
      </header>
      <div className="ig-scroll search-scroll">
        {!q ? (
          <p className="search-empty">Search accounts and posts in this mock app.</p>
        ) : results.length === 0 ? (
          <p className="search-empty">No posts match “{params.get("q")}”. Try pizza or food.</p>
        ) : (
          <ul className="search-results">
            {results.map((post) => (
              <li key={post.id} className="search-result-row">
                <div
                  className="search-result-thumb"
                  style={
                    post.imageUrl
                      ? { backgroundImage: `url(${post.imageUrl})` }
                      : { background: `hsl(${post.hue} 50% 40%)` }
                  }
                />
                <div className="search-result-meta">
                  <span className="search-result-user">{post.username}</span>
                  <span className="search-result-caption">{post.caption}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
