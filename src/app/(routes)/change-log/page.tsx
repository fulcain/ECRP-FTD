import { ChangeLogCard } from "@/app/(routes)/change-log/components/ChangeLogCard";
import { changeLog } from "@/app/(routes)/change-log/data";
import { History } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export default function ChangeLogPage() {
  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        title="Change Log"
        subtitle="A record of updates, fixes, and new features shipped to the FTD App. Most recent changes first."
        icon={<History className="h-5 w-5" />}
        showLogo={false}
      />

      {changeLog.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          No entries yet — check back soon.
        </p>
      ) : (
        <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border/40">
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
    </PageContainer>
  );
}