import { Suspense } from "react";

import { ActivityPanel } from "@/components/intentloop/ActivityPanel";

export default function ActivityPage() {
  return (
    <Suspense fallback={<p className="ig-placeholder">Your activity</p>}>
      <ActivityPanel />
    </Suspense>
  );
}
