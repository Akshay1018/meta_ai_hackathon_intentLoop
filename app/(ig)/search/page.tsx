import { IconSearch } from "@/components/ig/IgIcons";

export default function SearchPage() {
  return (
    <div className="ig-route">
      <header className="ig-header ig-header--search">
        <div className="search-field">
          <IconSearch size={16} />
          <input type="search" placeholder="Search" aria-label="Search" readOnly />
        </div>
      </header>
      <div className="ig-scroll ig-placeholder">
        <p>Search is mock-only for this prototype.</p>
      </div>
    </div>
  );
}
