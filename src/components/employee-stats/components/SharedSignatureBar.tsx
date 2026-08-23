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

/** Read the FTO's saved name and signature from the global session details. */
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

/**
 * Renders shared Name, Rank, FTD Rank, and Signature URL inputs.
 * All email cards on the Emails tab read from these same keys, so you
 * only fill in your signature once.
 */
export function SharedSignatureBar() {
  const [sigName, setSigName] = useSharedLocalStorageString(SHARED_SIG_NAME_KEY, "");
  const [sigRank, setSigRank] = useSharedLocalStorageString(SHARED_SIG_RANK_KEY, "");
  const [ftdRank, setFtdRank] = useSharedLocalStorageString(SHARED_FTD_RANK_KEY, "");
  const [signature, setSignature] = useSharedLocalStorageString(SHARED_SIGNATURE_KEY, "");
  const [emailDate, setEmailDate] = useSharedLocalStorageString(SHARED_EMAIL_DATE_KEY, "");

  /**
   * Returns today's date in the mdheader2 title format
   * (e.g. "August 23rd, 2026").
   */
  function todayFormatted(): string {
    const now = new Date();
    const day = now.getDate();
    const s = ["th", "st", "nd", "rd"];
    const v = day % 100;
    const ordinal = day + (s[(v - 20) % 10] || s[v] || s[0]);
    const month = now.toLocaleString("en-US", { month: "long" });
    return `${month} ${ordinal}, ${now.getFullYear()}`;
  }

  // On first mount, pre-fill name, signature, and date from the app's session details.
  const [initDone, setInitDone] = useState(false);
  useEffect(() => {
    if (initDone) return;
    const defaults = readSessionDefaults();
    if (defaults.name && !sigName) setSigName(defaults.name);
    if (defaults.signature && !signature) setSignature(defaults.signature);
    if (!emailDate) setEmailDate(todayFormatted());
    setInitDone(true);
    // Only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="border shadow-sm border-primary/20 bg-primary/[0.03]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Signature className="h-4 w-4 text-muted-foreground" />
          Shared Signature - applies to all emails below
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Input
              value={emailDate}
              onChange={(e) => setEmailDate(e.target.value)}
              placeholder="August 23rd, 2026"
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              placeholder="Fname Lname"
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rank</Label>
            <Input
              value={sigRank}
              onChange={(e) => setSigRank(e.target.value)}
              placeholder="Captain"
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">FTD Rank</Label>
            <Input
              value={ftdRank}
              onChange={(e) => setFtdRank(e.target.value)}
              placeholder="Head of Field Training"
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Signature URL
            </Label>
            <Input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="bg-background"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}