"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconHome,
  IconProfile,
  IconReels,
  IconSearch,
  IconShop,
} from "@/components/ig/IgIcons";

const TABS = [
  { href: "/", label: "Home", kind: "home" as const },
  { href: "/search", label: "Search", kind: "search" as const },
  { href: "/reels", label: "Reels", kind: "reels" as const },
  { href: "/shop", label: "Shop", kind: "shop" as const },
  { href: "/profile", label: "Profile", kind: "profile" as const },
];

type TabBarProps = {
  dark?: boolean;
};

export function TabBar({ dark }: TabBarProps) {
  const pathname = usePathname();

  return (
    <nav className={dark ? "tabbar tabbar--dark" : "tabbar"} aria-label="Main">
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
            aria-label={tab.label}
          >
            {tab.kind === "home" ? (
              <IconHome size={25} filled={active} />
            ) : tab.kind === "search" ? (
              <IconSearch size={25} />
            ) : tab.kind === "reels" ? (
              <IconReels size={25} active={active} />
            ) : tab.kind === "shop" ? (
              <IconShop size={25} />
            ) : active ? (
              <span className="tab-avatar tab-avatar--active" aria-hidden>
                Y
              </span>
            ) : (
              <IconProfile size={25} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
