"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Mail, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { CurrentEMRsTable } from "@/components/current-emrs/current-emrs-table";
import { FtoManagementCard } from "@/components/employee-stats/components/FtoManagementCard";
import { FtiPromotionCard } from "@/components/employee-stats/components/FtiPromotionCard";
import { EmrTrainingTimeCard } from "@/components/employee-stats/components/EmrTrainingTimeCard";
import { EmrDischargeCard } from "@/components/employee-stats/components/EmrDischargeCard";
import { SharedSignatureBar } from "@/components/employee-stats/components/SharedSignatureBar";

export type TableDataType = {
  [key: string]: string | number;
};

type CommandTab = "emrs" | "ftos" | "emails";

const VALID_TABS: CommandTab[] = ["emrs", "ftos", "emails"];

const TABS: { value: CommandTab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "emrs", label: "EMRs", Icon: Users },
  { value: "ftos", label: "FTOs", Icon: UserPlus },
  { value: "emails", label: "Emails", Icon: Mail },
];

function isValidTab(value: string): value is CommandTab {
  return (VALID_TABS as string[]).includes(value);
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <CommandPageContent />
    </Suspense>
  );
}

const COMMAND_TAB_LS_KEY = "ftd-command-tab";

function readSavedTab(): CommandTab {
  try {
    const raw = localStorage.getItem(COMMAND_TAB_LS_KEY);
    return isValidTab(raw ?? "") ? (raw as CommandTab) : "emrs";
  } catch {
    return "emrs";
  }
}

function CommandPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Priority: URL param > localStorage > default "emrs"
  const initialTab = (() => {
    const param = searchParams.get("tab");
    if (isValidTab(param ?? "")) return param as CommandTab;
    return readSavedTab();
  })();

  const [tab, setTab] = useState<CommandTab>(initialTab);

  // Sync tab → URL + localStorage
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    try {
      localStorage.setItem(COMMAND_TAB_LS_KEY, tab);
    } catch { /* noop */ }
  }, [tab, pathname, router, searchParams]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-2 space-x-3">
        <Image alt="FT" src="/FT.png" height={50} width={50} />
        <span>Command Page</span>
      </h1>

      <div
        role="tablist"
        aria-label="Command sections"
        className="inline-flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5"
      >
        {TABS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              tab === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "emrs" && <CurrentEMRsTable />}
      {tab === "ftos" && <FtoManagementCard />}
      {tab === "emails" && (
        <div className="space-y-6">
          <SharedSignatureBar />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FtiPromotionCard />
            <EmrTrainingTimeCard />
            <EmrDischargeCard />
          </div>
        </div>
      )}
    </div>
  );
}