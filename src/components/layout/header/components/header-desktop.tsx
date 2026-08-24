"use client";

import type { HeaderLink } from "@/components/layout/header/configs/HeaderLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type HeaderDesktopProps = {
  headerLinks: HeaderLink[];
};

export function HeaderDesktop({ headerLinks }: HeaderDesktopProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {headerLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href!}
          className={cn(
            "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href!)
              ? "bg-surface-hover text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/50",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}