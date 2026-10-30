import Link from "next/link";

import { IconHeart, IconMessenger, IconNewPost } from "@/components/ig/IgIcons";
import { IgWordmark } from "@/components/ig/IgWordmark";

export function IgHeader() {
  return (
    <header className="ig-header">
      <IgWordmark />
      <div className="ig-header-actions">
        <Link href="/create" className="ig-icon-btn" aria-label="Create">
          <IconNewPost size={24} />
        </Link>
        <button type="button" className="ig-icon-btn" aria-label="Notifications">
          <IconHeart size={24} />
        </button>
        <Link href="/dms" className="ig-icon-btn" aria-label="Direct messages">
          <IconMessenger size={24} />
        </Link>
      </div>
    </header>
  );
}
