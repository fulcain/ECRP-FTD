import { ChangeLogCard } from "@/app/(routes)/change-log/components/ChangeLogCard";
import { changeLog } from "@/app/(routes)/change-log/data";
import { History } from "lucide-react";

export default function ChangeLogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          <History className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">Change Log</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          A day-by-day record of updates, fixes, and new features shipped to
          the FTD App. Most recent changes appear first.
        </p>
      </header>

      {changeLog.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          No entries yet — check back soon.
        </p>
      ) : (
        <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
          {changeLog.map((day) => (
            <div key={day.date} className="relative">
              <span
                aria-hidden
                className="absolute -left-6 top-6 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background"
              />
              <ChangeLogCard day={day} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
