import { IconDm, IconHeart } from "@/components/ig/IgIcons";
import { IgWordmark } from "@/components/ig/IgWordmark";

export function IgHeader() {
  return (
    <header className="ig-header">
      <IgWordmark />
      <div className="ig-header-actions">
        <button type="button" className="ig-icon-btn" aria-label="Notifications">
          <IconHeart size={24} />
        </button>
        <button type="button" className="ig-icon-btn" aria-label="Direct messages">
          <IconDm size={24} />
        </button>
      </div>
    </header>
  );
}
