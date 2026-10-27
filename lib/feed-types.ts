export type Story = {
  id: string;
  name: string;
  initials: string;
  self: boolean;
  hue: number;
};

export type FeedPost = {
  id: string;
  username: string;
  place: string;
  time: string;
  likes: number;
  caption: string;
  hue: number;
  initials: string;
};

export type FeedData = {
  stories: Story[];
  posts: FeedPost[];
};
