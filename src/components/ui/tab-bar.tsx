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
      className="inline-flex items-center rounded-xl border border-border/40 bg-surface p-1"
    >
      {tabs.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={active === value}
          onClick={() => onChange?.(value)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
            active === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/50",
          )}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </button>
      ))}
    </nav>
  );
}