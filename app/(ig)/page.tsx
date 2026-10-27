import { FeedPost } from "@/components/ig/FeedPost";
import { IgHeader } from "@/components/ig/IgHeader";
import { StoriesRow } from "@/components/ig/StoriesRow";
import type { FeedData } from "@/lib/feed-types";
import feed from "@/mock/feed.json";

const data = feed as FeedData;

export default function HomePage() {
  return (
    <>
      <IgHeader />
      <div className="ig-scroll">
        <StoriesRow stories={data.stories} />
        {data.posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
