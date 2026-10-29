import Link from "next/link";

import { IconMore } from "@/components/ig/IgIcons";

type ProfileGridTile = {
  id: string;
  hue: number;
  label: string;
  imageUrl?: string;
};

type ProfileData = {
  user: {
    username: string;
    displayName: string;
    posts: number;
    followers: string;
    following: string;
    bio: string;
  };
  grid: ProfileGridTile[];
};

export function ProfileHome({ data }: { data: ProfileData }) {
  return (
    <>
      <header className="ig-header ig-header--profile">
        <span className="profile-header-user">{data.user.username}</span>
        <button type="button" className="ig-icon-btn" aria-label="Settings">
          <IconMore size={22} />
        </button>
      </header>
      <div className="ig-scroll">
        <div className="profile-top">
          <div className="profile-avatar-wrap" aria-hidden="true">
            <div className="profile-avatar">Y</div>
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
        <div className="profile-actions">
          <button type="button" className="profile-btn">
            Edit profile
          </button>
          <button type="button" className="profile-btn">
            Share profile
          </button>
        </div>
        <Link href="/profile/activity" className="profile-activity-link">
          Your activity
        </Link>
        <div className="profile-tabs" role="tablist" aria-label="Profile content">
          <span className="profile-tab is-active" role="tab" aria-selected="true">
            ▦
          </span>
          <span className="profile-tab" role="tab" aria-selected="false">
            ▷
          </span>
          <span className="profile-tab" role="tab" aria-selected="false">
            ◉
          </span>
        </div>
        <div className="profile-grid">
          {data.grid.map((tile) => (
            <div key={tile.id} className="profile-tile">
              {tile.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tile.imageUrl} alt="" className="profile-tile-img" loading="lazy" />
              ) : (
                <span style={{ background: `hsl(${tile.hue} 45% 42%)` }}>{tile.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
