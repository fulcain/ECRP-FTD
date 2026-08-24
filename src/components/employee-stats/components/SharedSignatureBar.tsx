"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Signature } from "lucide-react";
import { useSharedLocalStorageString } from "@/app/hooks/useLocalStorage";

import {
  SHARED_SIG_NAME_KEY,
  SHARED_SIG_RANK_KEY,
  SHARED_SIGNATURE_KEY,
  SHARED_FTD_RANK_KEY,
  SHARED_EMAIL_DATE_KEY,
} from "@/components/employee-stats/lib/generate-fti-promotion-bbcode";

function readSessionDefaults() {
  try {
    const raw = localStorage.getItem("ftd-session-details");
    if (!raw) return { name: "", signature: "" };
    const parsed = JSON.parse(raw);
    return {
      name: parsed?.ftoName ?? "",
      signature: parsed?.signature ?? "",
    };
  } catch {
    return { name: "", signature: "" };
  }
}

export function SharedSignatureBar({
  subtitle = "applies to all emails below",
}: {
  subtitle?: string;
}) {
  const [sigName, setSigName] = useSharedLocalStorageString(SHARED_SIG_NAME_KEY, "");
  const [sigRank, setSigRank] = useSharedLocalStorageString(SHARED_SIG_RANK_KEY, "");
  const [ftdRank, setFtdRank] = useSharedLocalStorageString(SHARED_FTD_RANK_KEY, "");
  const [signature, setSignature] = useSharedLocalStorageString(SHARED_SIGNATURE_KEY, "");
  const [emailDate, setEmailDate] = useSharedLocalStorageString(SHARED_EMAIL_DATE_KEY, "");

  function todayFormatted(): string {
    const now = new Date();
    const day = now.getDate();
    const s = ["th", "st", "nd", "rd"];
    const v = day % 100;
    const ordinal = day + (s[(v - 20) % 10] || s[v] || s[0]);
    const month = now.toLocaleString("en-US", { month: "long" });
    return `${month} ${ordinal}, ${now.getFullYear()}`;
  }

  const [initDone, setInitDone] = useState(false);
  useEffect(() => {
    if (initDone) return;
    const defaults = readSessionDefaults();
    if (defaults.name && !sigName) setSigName(defaults.name);
    if (defaults.signature && !signature) setSignature(defaults.signature);
    if (!emailDate) setEmailDate(todayFormatted());
    setInitDone(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="ring-1 ring-inset ring-primary/10">
      <CardHeader className="pb-2">
        <CardTitle>
          <Signature className="h-4 w-4 text-muted-foreground" />
          Shared Signature <span className="font-normal text-muted-foreground">— {subtitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">Date</Label>
            <Input
              value={emailDate}
              onChange={(e) => setEmailDate(e.target.value)}
              placeholder="August 23rd, 2026"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">Name</Label>
            <Input
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              placeholder="Fname Lname"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">Rank</Label>
            <Input
              value={sigRank}
              onChange={(e) => setSigRank(e.target.value)}
              placeholder="Captain"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">FTD Rank</Label>
            <Input
              value={ftdRank}
              onChange={(e) => setFtdRank(e.target.value)}
              placeholder="Head of Field Training"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">Signature URL</Label>
            <Input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="https://i.ibb.co/..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}