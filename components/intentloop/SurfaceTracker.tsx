"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { recordDwellSurfaceEnter } from "@/lib/visit-dwell";
import { pathnameToSurface, recordSurfaceVisit } from "@/lib/visit-tracker";

export function SurfaceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const surface = pathnameToSurface(pathname);
    if (surface) {
      recordSurfaceVisit(surface);
      recordDwellSurfaceEnter(surface);
    }
  }, [pathname]);

  return null;
}
