import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Calendar,
  PenLine,
  Wrench,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type {
  ChangeLogDay,
  ChangeLogEntryType,
} from "@/app/(routes)/change-log/data";

const TYPE_META: Record<
  ChangeLogEntryType,
  { label: string; icon: LucideIcon; className: string }
> = {
  added: {
    label: "Added",
    icon: Sparkles,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30",
  },
  changed: {
    label: "Changed",
    icon: PenLine,
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30",
  },
  fixed: {
    label: "Fixed",
    icon: Wrench,
    className:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/30",
  },
  removed: {
    label: "Removed",
    icon: Trash2,
    className:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30",
  },
};

function formatDate(iso: string): string {
  // Parsing as a Date then formatting in UTC avoids off-by-one timezone
  // shifts when the user's locale is west of UTC.
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ChangeLogCard({ day }: { day: ChangeLogDay }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar
            className="h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <CardTitle className="text-lg font-semibold tracking-tight">
            {formatDate(day.date)}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {day.entries.map((entry, index) => {
            const meta = TYPE_META[entry.type];
            const Icon = meta.icon;
            return (
              <li
                key={`${entry.type}-${index}`}
                className="flex items-start gap-3"
              >
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    meta.className,
                  )}
                >
                  <Icon className="h-3 w-3" aria-hidden />
                  {meta.label}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  {entry.description}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
