"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { IgStatusBar } from "@/components/ig/IgStatusBar";
import { PhoneShell } from "@/components/ig/PhoneShell";
import { TabBar } from "@/components/ig/TabBar";
import { SessionLayer } from "@/components/intentloop/SessionLayer";
import { SurfaceTracker } from "@/components/intentloop/SurfaceTracker";

type IgLayoutChromeProps = {
  children: ReactNode;
  metaKeyConfigured: boolean;
};

export function IgLayoutChrome({ children, metaKeyConfigured }: IgLayoutChromeProps) {
  const pathname = usePathname();
  const onReels = pathname === "/reels" || pathname.startsWith("/reels/");
  const hideTabBar =
    pathname === "/create" ||
    pathname.startsWith("/create/") ||
    pathname === "/reels/record";

  return (
    <PhoneShell metaKeyConfigured={metaKeyConfigured} variant={onReels ? "reels" : "default"}>
      <IgStatusBar dark={onReels} />
      <SurfaceTracker />
      <div className="ig-main">{children}</div>
      {hideTabBar ? null : <TabBar dark={onReels} />}
      <SessionLayer />
    </PhoneShell>
  );
}
