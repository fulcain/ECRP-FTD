"use client";

import { useState } from "react";
import { SessionProvider } from "@/app/(routes)/phase-paperworks/components/SessionContext";
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

export function PaperworkTypeSelector() {
  const [type, setType] = useState<"normal" | "reinstatement">("normal");

  return (
    <SessionProvider>
      <div className="space-y-6">
        {/* Shared session details (FTO name, date, time, EMR, session type) */}
        <SessionDetailsCard />

        {/* Paperwork type selector */}
        <div className="flex items-center gap-3">
          <Select
            value={type}
            onValueChange={(val) => setType(val as "normal" | "reinstatement")}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal Paperwork</SelectItem>
              <SelectItem value="reinstatement">Reinstatement Paperwork</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "normal" ? <PaperworkForm /> : <ReinstatementForm />}
      </div>
    </SessionProvider>
  );
}
