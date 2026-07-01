"use client";

import { useState } from "react";
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
    <div className="space-y-6">
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
  );
}
