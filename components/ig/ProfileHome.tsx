import Link from "next/link";

type ProfileData = {
  user: {
    username: string;
    displayName: string;
    posts: number;
    followers: string;
    following: string;
    bio: string;
  };
  grid: { id: string; hue: number; label: string }[];
};

export function ProfileHome({ data }: { data: ProfileData }) {
  return (
    <>
      <header className="ig-header">
        <span className="activity-title">{data.user.username}</span>
        <span />
      </header>
      <div className="ig-scroll">
        <div className="profile-top">
          <div className="profile-avatar" aria-hidden="true">
            Y
          </div>
          <div className="profile-stats">
            <div>
              <strong>{data.user.posts}</strong>
              <span>posts</span>
            </div>
            <div>
              <strong>{data.user.followers}</strong>
              <span>followers</span>
            </div>
            <div>
              <strong>{data.user.following}</strong>
              <span>following</span>
            </div>
          </div>
        </div>
        <p className="profile-name">{data.user.displayName}</p>
        <p className="profile-bio">{data.user.bio}</p>
        <Link href="/profile/activity" className="profile-activity-link">
          Your activity
        </Link>
        <div className="profile-grid">
          {data.grid.map((tile) => (
            <div
              key={tile.id}
              className="profile-tile"
              style={{ background: `hsl(${tile.hue} 45% 42%)` }}
            >
              {tile.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
