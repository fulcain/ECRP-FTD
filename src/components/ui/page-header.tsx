import Image from "next/image";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Show the FT logo next to title. Default true. */
  showLogo?: boolean;
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  icon,
  showLogo = false,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-8 flex flex-col items-center gap-3 text-center", className)}>
      {showLogo && (
        <div className="flex items-center gap-3">
          <Image alt="FT" src="/FT.png" height={36} width={36} className="opacity-90" />
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
      )}
      {!showLogo && icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
      )}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground max-w-lg">{subtitle}</p>
        )}
      </div>
    </header>
  );
}