"use client";

import { FileText, RefreshCcw } from "lucide-react";

import {
  FormType,
  SessionProvider,
  useSession,
} from "@/app/(routes)/paperwork/components/SessionContext";
import { SessionDetailsCard } from "@/app/(routes)/paperwork/components/SessionDetailsCard";
import PaperworkForm from "@/app/(routes)/paperwork/components/PaperworkForm";
import ReinstatementForm from "@/app/(routes)/paperwork/components/ReinstatementForm";
import { cn } from "@/lib/utils";

interface PaperworkTypeOption {
  value: FormType;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const PAPERWORK_TYPES: PaperworkTypeOption[] = [
  {
    value: "normal",
    label: "Normal FT Paperwork",
    description: "Field training phases for new EMRs.",
    Icon: FileText,
  },
  {
    value: "reinstatement",
    label: "Reinstatement Paperwork",
    description: "Phases for previous Employees of the Department.",
    Icon: RefreshCcw,
  },
];

export function PaperworkTypeSelector() {
  return (
    <SessionProvider>
      <div className="space-y-6">
        <PaperworkHeader />
        <PaperworkTypeRouter />
        <SessionDetailsCard />
      </div>
    </SessionProvider>
  );
}

function PaperworkHeader() {
  return (
    <header className="max-w-4xl mx-auto py-8 px-4 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-light tracking-tight">Paperwork</h1>
          <p className="text-sm text-muted-foreground">
            Choose a paperwork format to begin.
          </p>
        </div>
        <span className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Saved into your browser automatically.
        </span>
      </div>
      <PaperworkTypeTabs />
    </header>
  );
}

function PaperworkTypeTabs() {
  const { formType, setFormType } = useSession();

  return (
    <nav aria-label="Paperwork type" className="grid gap-3 sm:grid-cols-2">
      {PAPERWORK_TYPES.map(({ value, label, description, Icon }) => {
        const active = formType === value;
        return (
          <button
            key={value}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => setFormType(value)}
            className={cn(
              "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              active
                ? "border-primary/70 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:bg-muted/40",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground group-hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-primary" : "text-foreground",
                )}
              >
                {label}
              </span>
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function PaperworkTypeRouter() {
  const { formType } = useSession();
  return formType === "normal" ? <PaperworkForm /> : <ReinstatementForm />;
}
