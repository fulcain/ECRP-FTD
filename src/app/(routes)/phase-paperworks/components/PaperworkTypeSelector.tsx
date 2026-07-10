"use client";

import {
  SessionProvider,
  useSession,
  FormType,
} from "@/app/(routes)/phase-paperworks/components/SessionContext";
import { SessionDetailsCard } from "@/app/(routes)/phase-paperworks/components/SessionDetailsCard";
import PaperworkForm from "@/app/(routes)/phase-paperworks/components/PaperworkForm";
import ReinstatementForm from "@/app/(routes)/phase-paperworks/components/ReinstatementForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PaperworkTypeSelect() {
  const { formType, setFormType } = useSession();

  return (
    <Select
      value={formType}
      onValueChange={(val) => setFormType(val as FormType)}
    >
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">Normal Paperwork</SelectItem>
        <SelectItem value="reinstatement">Reinstatement Paperwork</SelectItem>
      </SelectContent>
    </Select>
  );
}

/**
 * Top-level route entry that owns the paperwork-mode state and mounts the
 * matching form below it.
 *
 * Wraps the rendered form tree in a `SessionProvider` so the normal and
 * reinstatement forms share one session context (FTO name, date, EMR,
 * current phase, additional mandatories). The active form type itself
 * lives inside that provider as well, so the SessionDetailsCard and the
 * NextPhaseTitleCard can react to the form switch.
 */
export function PaperworkTypeSelector() {
  return (
    <SessionProvider>
      <div className="space-y-6">

        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
          <div className="flex items-center gap-3">
            <PaperworkTypeSelect />
          </div>
        </div>

        <PaperworkTypeRouter />

        <SessionDetailsCard />
      </div>
    </SessionProvider>
  );
}

/**
 * Renders the form that matches the active formType from context.
 * This guarantees that switching the selector keeps the correct form mounted
 * while the SessionDetailsCard stays mounted on the side.
 */
function PaperworkTypeRouter() {
  const { formType } = useSession();
  return formType === "normal" ? <PaperworkForm /> : <ReinstatementForm />;
}
