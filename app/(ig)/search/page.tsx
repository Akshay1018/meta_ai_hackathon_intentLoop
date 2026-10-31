import { Suspense } from "react";

import { SearchView } from "@/components/ig/SearchView";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="ig-route ig-placeholder">Loading search…</div>}>
      <SearchView />
    </Suspense>
  );
}
