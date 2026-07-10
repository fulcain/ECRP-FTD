"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";

import {
  FormType,
  useSession,
} from "@/app/(routes)/phase-paperworks/components/SessionContext";

interface NextPhaseOption {
  /** Stable value used by the Select control. */
  value: string;
  /** Static label that is shown / copied when this option is selected. */
  label: string;
  /** Marker used at render-time to swap in the dynamic "Nx Mandatory" label. */
  dynamic?: "mandatory";
}

interface NextPhaseConfig {
  dropdownKey: string;
  /** All selectable titles. */
  options: NextPhaseOption[];
  /** current-phase → next-phase default. Values must exist in `options`. */
  nextPhaseMap: Record<string, string>;
}

const NORMAL_NEXT_PHASE: NextPhaseConfig = {
  dropdownKey: "ftd-next-phase-dropdown-normal",
  options: [
    { value: "phase1", label: "Pending Phase 1" },
    { value: "phase2", label: "Pending Phase 2" },
    { value: "phase2-mandatory", label: "Pending Phase 2 Mandatory Ride-Along" },
    { value: "phase3", label: "Pending Phase 3" },
    { value: "phase3-mandatory", label: "Pending Phase 3 Mandatory Ride-Along" },
    { value: "preCert", label: "Pending Pre-Certification" },
    { value: "certPassed", label: "Pending Certification" },
    {
      value: "pending-mandatory",
      label: "Pending Nx Mandatory Ride-Along",
      dynamic: "mandatory",
    },
  ],
  nextPhaseMap: {
    introduction: "phase1",
    phase1: "phase2",
    phase2: "phase3",
    phase3: "preCert",
    preCert: "certPassed",
    certPassed: "certPassed",
    certFailed: "certPassed",
    rideAlong: "phase1",
  },
};

const REINSTATEMENT_NEXT_PHASE: NextPhaseConfig = {
  dropdownKey: "ftd-next-phase-dropdown-reinstatement",
  options: [
    { value: "reinstatementPhase1", label: "Pending Phase 1" },
    { value: "reinstatementPhase2", label: "Pending Phase 2" },
    {
      value: "reinstatementPhase2-mandatory",
      label: "Pending Phase 2 Mandatory Ride-Along",
    },
    { value: "reinstatementCertPassed", label: "Pending Certification" },
    {
      value: "pending-mandatory",
      label: "Pending Nx Mandatory Ride-Along",
      dynamic: "mandatory",
    },
  ],
  nextPhaseMap: {
    reinstatementPhase1: "reinstatementPhase2",
    reinstatementPhase2: "reinstatementCertPassed",
    reinstatementCertPassed: "reinstatementCertPassed",
    reinstatementCertFailed: "reinstatementCertPassed",
    reinstatementRideAlong: "reinstatementPhase1",
  },
};

function getNextPhaseConfig(formType: FormType): NextPhaseConfig {
  return formType === "reinstatement"
    ? REINSTATEMENT_NEXT_PHASE
    : NORMAL_NEXT_PHASE;
}

/**
 * Dropdown + clipboard helper used by both paperwork forms to fill in
 * the pending phase title on the next session's EMR Profile / FTS post.
 *
 * Resolution rules:
 *   - Selection persists per form type (its own localStorage key) so
 *     switching forms keeps each form's last-picked value intact.
 *   - When the active form reports a NEW `currentPhase` (the user just
 *     clicked a phase button) the dropdown auto-advances to that phase's
 *     configured next phase, as long as a persisted selection already
 *     existed. Initial mount never auto-advances — the persisted choice
 *     wins.
 *   - The "Pending Nx Mandatory" option is rewired to display the live
 *     additional-mandatories count from `SessionContext`.
 */
export function NextPhaseTitleCard() {
  const { formType, currentPhase, additionalMandatories } = useSession();
  const [phaseCopied, setPhaseCopied] = useState(false);

  const config = getNextPhaseConfig(formType);

  const [nextPhaseDropdown, setNextPhaseDropdown] = useLocalStorage<string>(
    config.dropdownKey,
    config.options[0].value,
  );
  // Per-form localStorage key means a value from the other form type may
  // outlive its options array; fall back to the first valid option so the
  // Select control never receives an unknown value.
  const safeNextPhaseDropdown = config.options.some(
    (o) => o.value === nextPhaseDropdown,
  )
    ? nextPhaseDropdown
    : config.options[0].value;

  // Tracks the last phase we synced into the dropdown. Used to:
  //   1. Distinguish "first mount" (preserve the persisted selection)
  //      from "user clicked a new phase button" (auto-advance to the
  //      logical next phase).
  //   2. Avoid re-running the sync on every render.
  const lastSyncedPhaseRef = useRef<string | null>(null);
  useEffect(() => {
    if (!currentPhase) {
      lastSyncedPhaseRef.current = null;
      return;
    }
    if (lastSyncedPhaseRef.current === currentPhase) return;
    if (lastSyncedPhaseRef.current === null) {
      lastSyncedPhaseRef.current = currentPhase;
      return;
    }
    lastSyncedPhaseRef.current = currentPhase;
    const nextValue = config.nextPhaseMap[currentPhase] ?? currentPhase;
    const safeValue = config.options.some((o) => o.value === nextValue)
      ? nextValue
      : config.options[0].value;
    setNextPhaseDropdown(safeValue);
  }, [currentPhase, config, setNextPhaseDropdown]);

  const mandatoryCount = useMemo(() => {
    const n = parseInt(additionalMandatories, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [additionalMandatories]);

  const dynamicMandatoryLabel = useMemo(
    () =>
      mandatoryCount > 0
        ? `Pending ${mandatoryCount}x Mandatory Ride-Along`
        : "Pending Nx Mandatory",
    [mandatoryCount],
  );

  const selectedOption = config.options.find(
    (o) => o.value === safeNextPhaseDropdown,
  );
  const resolvedTitle =
    selectedOption?.dynamic === "mandatory"
      ? dynamicMandatoryLabel
      : selectedOption?.label || "";

  const copyTitle = async () => {
    if (!resolvedTitle) return;
    await navigator.clipboard.writeText(resolvedTitle);
    setPhaseCopied(true);
    toast.success("Next phase title copied!", { theme: "dark" });
    setTimeout(() => setPhaseCopied(false), 2000);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Next Phase Title
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <div className="flex items-center gap-2">
              <Select
                value={safeNextPhaseDropdown}
                onValueChange={(v) => setNextPhaseDropdown(v)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((option) => (
                    <SelectItem
                      key={
                        option.dynamic === "mandatory"
                          ? `${option.value}-${mandatoryCount}`
                          : option.value
                      }
                      value={option.value}
                    >
                      {option.dynamic === "mandatory"
                        ? dynamicMandatoryLabel
                        : option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={copyTitle}
                className="shrink-0"
                disabled={!resolvedTitle}
              >
                <Copy className="h-4 w-4 mr-1" />
                {phaseCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          {safeNextPhaseDropdown === "pending-mandatory" && (
            <div className="text-xs rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-amber-700 dark:text-amber-300">
              Go to the Next Session Focus Section and choose amount of Adittional Mandatories they have to do.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
