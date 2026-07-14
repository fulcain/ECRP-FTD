"use client";

import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/app/(routes)/paperwork/components/SessionContext";
import {
  paperworkConfig,
  PhaseKey,
} from "@/app/(routes)/paperwork/lib/paperworkConfig";
import { resolveNormalNotes } from "@/app/(routes)/paperwork/lib/phase-notes/registry";

function isPaperworkPhaseKey(value: unknown): value is PhaseKey {
  return typeof value === "string" && value in paperworkConfig;
}

/** Read-only reference panel for the active normal-form phase. */
export function PhaseNotesCard() {
  const { currentPhase } = useSession();

  if (!isPaperworkPhaseKey(currentPhase)) return null;
  const phase: PhaseKey = currentPhase;
  const config = paperworkConfig[phase];
  const NotesComponent = resolveNormalNotes(phase);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          Phase Notes - {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[600px] overflow-y-auto rounded-md bg-muted/30 border border-border/40 px-4 py-4">
          {NotesComponent ? (
            <NotesComponent />
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No reference notes available for this phase.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
