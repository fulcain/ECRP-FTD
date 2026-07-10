"use client";

import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/app/(routes)/phase-paperworks/components/SessionContext";
import {
  reinstatementConfig,
  ReinstatementPhaseKey,
} from "@/app/(routes)/phase-paperworks/lib/reinstatementConfig";
import { resolveReinstatementNotes } from "@/app/(routes)/phase-paperworks/lib/phase-notes/registry";

function isReinstatementPhaseKey(
  value: unknown,
): value is ReinstatementPhaseKey {
  return typeof value === "string" && value in reinstatementConfig;
}

/**
 * Read-only reference panel for reinstatement paperwork. The mirror of
 * `PhaseNotesCard`, but resolves notes from the reinstatement-namespaced
 * registry instead of the normal one.
 */
export function ReinstatementNotesCard() {
  const { currentPhase } = useSession();

  if (!isReinstatementPhaseKey(currentPhase)) return null;
  const phase: ReinstatementPhaseKey = currentPhase;
  const config = reinstatementConfig[phase];
  const NotesComponent = resolveReinstatementNotes(phase);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          Reinstatement Notes - {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[600px] overflow-y-auto rounded-md bg-muted/30 border border-border/40 px-4 py-4">
          {NotesComponent ? (
            <NotesComponent />
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No reference notes available for this reinstatement phase.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
