import type { Story } from "@/lib/feed-types";

type StoriesRowProps = {
  stories: Story[];
};

export function StoriesRow({ stories }: StoriesRowProps) {
  return (
    <div className="stories" aria-label="Stories">
      {stories.map((story) => (
        <div key={story.id} className="story">
          <div className={story.self ? "story-ring story-ring--self" : "story-ring"}>
            <div
              className="story-avatar"
              style={{ background: `hsl(${story.hue} 55% 42%)` }}
            >
              {story.initials}
            </div>
          </div>
          <span className="story-name">{story.name}</span>
        </div>
      ))}
    </div>
  );
}
