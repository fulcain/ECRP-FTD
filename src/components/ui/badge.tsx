import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "muted" | "accent";
  className?: string;
};

const variants = {
  default: "bg-primary/10 text-primary ring-1 ring-primary/20",
  muted: "bg-surface-hover text-muted-foreground ring-1 ring-border/50",
  accent: "bg-accent text-accent-foreground ring-1 ring-accent/50",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}