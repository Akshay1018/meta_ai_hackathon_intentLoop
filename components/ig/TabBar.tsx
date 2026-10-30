"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconCreate,
  IconDm,
  IconHome,
  IconProfile,
  IconReels,
} from "@/components/ig/IgIcons";

const TABS = [
  { href: "/", label: "Home", kind: "home" as const },
  { href: "/reels", label: "Reels", kind: "reels" as const },
  { href: "/create", label: "New post", kind: "create" as const },
  { href: "/dms", label: "Messages", kind: "dms" as const },
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
            className={
              active
                ? `tab is-active${tab.kind === "create" ? " tab--create" : ""}`
                : `tab${tab.kind === "create" ? " tab--create" : ""}`
            }
            aria-current={active ? "page" : undefined}
            aria-label={tab.label}
          >
            {tab.kind === "home" ? (
              <IconHome size={26} filled={active} />
            ) : tab.kind === "reels" ? (
              <IconReels size={26} />
            ) : tab.kind === "create" ? (
              <IconCreate size={28} />
            ) : tab.kind === "dms" ? (
              <IconDm size={26} filled={active} />
            ) : (
              <IconProfile size={26} active={active} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
