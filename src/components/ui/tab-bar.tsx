"use client";

import { cn } from "@/lib/utils";

export interface Tab<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

type TabBarProps<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  /** Called on tab change. */
  onChange?: (value: T) => void;
};

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: TabBarProps<T>) {
  return (
    <nav
      role="tablist"
      aria-label="Page sections"
      className="inline-flex items-center rounded-lg border border-border/50 bg-surface p-0.5"
    >
      {tabs.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={active === value}
          onClick={() => onChange?.(value)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
            active === value
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/30"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover",
          )}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </button>
      ))}
    </nav>
  );
}
