import { IconAddStory } from "@/components/ig/IgIcons";
import type { Story } from "@/lib/feed-types";

type StoriesRowProps = {
  stories: Story[];
};

export function StoriesRow({ stories }: StoriesRowProps) {
  return (
    <div className="stories" aria-label="Stories">
      {stories.map((story) => (
        <button key={story.id} type="button" className="story story-btn">
          <div className={story.self ? "story-ring story-ring--self" : "story-ring"}>
            <div
              className="story-avatar"
              style={{ background: `hsl(${story.hue} 55% 42%)` }}
            >
              {story.initials}
            </div>
            {story.self ? (
              <span className="story-add-badge">
                <IconAddStory size={16} />
              </span>
            ) : null}
          </div>
          <span className="story-name">{story.name}</span>
        </button>
      ))}
    </div>
  );
}
