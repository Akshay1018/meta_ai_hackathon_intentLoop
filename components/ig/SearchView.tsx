"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { IconSearch } from "@/components/ig/IgIcons";
import { searchHitHref, searchMockContent } from "@/lib/mock-search";

export function SearchView() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const results = useMemo(() => searchMockContent(q), [q]);

  return (
    <div className="ig-route">
      <header className="ig-header ig-header--search">
        <div className="search-field search-field--active">
          <IconSearch size={16} />
          <input
            type="search"
            defaultValue={q}
            placeholder="Search"
            aria-label="Search"
            readOnly
          />
        </div>
      </header>
      <div className="ig-scroll search-scroll">
        {!q.trim() ? (
          <p className="search-empty">Search accounts and posts in this mock app.</p>
        ) : results.length === 0 ? (
          <p className="search-empty">No posts match “{q}”. Try pizza or food.</p>
        ) : (
          <ul className="search-results">
            {results.map((hit) => (
              <li key={`${hit.kind}-${hit.id}`}>
                <Link href={searchHitHref(hit)} className="search-result-row">
                  <div
                    className="search-result-thumb"
                    style={
                      hit.imageUrl
                        ? { backgroundImage: `url(${hit.imageUrl})` }
                        : { background: `hsl(${hit.hue} 50% 40%)` }
                    }
                  />
                  <div className="search-result-meta">
                    <span className="search-result-kind">{hit.kind === "post" ? "Post" : "Reel"}</span>
                    <span className="search-result-user">
                      {hit.kind === "post" ? hit.username : hit.user}
                    </span>
                    <span className="search-result-caption">{hit.caption}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
