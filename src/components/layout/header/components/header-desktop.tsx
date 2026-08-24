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
    <nav className="hidden md:flex items-center gap-0.5">
      {headerLinks.map((item) => {
        const isActive = item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href!);
        return (
          <Link
            key={item.label}
            href={item.href!}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/60",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}