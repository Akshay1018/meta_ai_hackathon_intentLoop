"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { FeedPost } from "@/components/ig/FeedPost";
import { IgHeader } from "@/components/ig/IgHeader";
import { StoriesRow } from "@/components/ig/StoriesRow";
import type { FeedData } from "@/lib/feed-types";

type FeedHomeProps = {
  data: FeedData;
};

export function FeedHome({ data }: FeedHomeProps) {
  const params = useSearchParams();
  const focusPost = params.get("post");

  useEffect(() => {
    if (!focusPost) return;
    const el = document.getElementById(`post-${focusPost}`);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("post-card--focus");
      window.setTimeout(() => el.classList.remove("post-card--focus"), 2400);
    }, 150);
    return () => window.clearTimeout(t);
  }, [focusPost]);

  return (
    <div className="ig-route">
      <IgHeader />
      <div className="ig-scroll">
        <StoriesRow stories={data.stories} />
        {data.posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
