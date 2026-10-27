"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/reels", label: "Reels", icon: "▷" },
  { href: "/create", label: "+", icon: "+" },
  { href: "/dms", label: "DMs", icon: "✈" },
  { href: "/profile", label: "Profile", icon: "●" },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((tab) => {
        const active =
          tab.href === "/"
            ? pathname === "/"
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={active ? "tab is-active" : "tab"}
            aria-current={active ? "page" : undefined}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
