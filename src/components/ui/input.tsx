import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-lg border border-border/80 bg-background px-3 py-1 text-sm transition-all duration-150",
        "placeholder:text-muted-foreground/50",
        "hover:border-border",
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };