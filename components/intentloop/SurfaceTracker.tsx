"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { pathnameToSurface, recordSurfaceVisit } from "@/lib/visit-tracker";

export function SurfaceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const surface = pathnameToSurface(pathname);
    if (surface) recordSurfaceVisit(surface);
  }, [pathname]);

  return null;
}
