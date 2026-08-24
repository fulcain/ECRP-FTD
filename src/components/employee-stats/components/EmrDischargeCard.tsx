"use client";

import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Check, Copy, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage, useSharedLocalStorageString } from "@/app/hooks/useLocalStorage";

import {
  generateDischargeEmailBBCode,
  DISCHARGE_EMAIL_TITLE,
} from "@/components/employee-stats/lib/generate-discharge-email-bbcode";
import {
  SHARED_SIG_NAME_KEY,
  SHARED_SIG_RANK_KEY,
  SHARED_SIGNATURE_KEY,
  SHARED_EMAIL_DATE_KEY,
} from "@/components/employee-stats/lib/generate-fti-promotion-bbcode";

const FORM_STORAGE_KEY = "ftd-discharge-email-form-v1";

function todayFormatted(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${day}/${month}/${now.getFullYear()}`;
}

export function EmrDischargeCard() {
  const [savedForm, setSavedForm] = useLocalStorage(FORM_STORAGE_KEY, {
    name: "",
    reason: "",
    salutation: "",
    dischargeDate: "",
  });

  const [name, setName] = useState(savedForm?.name ?? "");
  const [reason, setReason] = useState(savedForm?.reason ?? "");
  const [salutation, setSalutation] = useState(savedForm?.salutation ?? "");
  const [dischargeDate, setDischargeDate] = useState(savedForm?.dischargeDate ?? "");

  useEffect(() => {
    setSavedForm({ name, reason, salutation, dischargeDate });
  }, [name, reason, salutation, dischargeDate, setSavedForm]);

  const [sigName] = useSharedLocalStorageString(SHARED_SIG_NAME_KEY, "");
  const [sigRank] = useSharedLocalStorageString(SHARED_SIG_RANK_KEY, "");
  const [signature] = useSharedLocalStorageString(SHARED_SIGNATURE_KEY, "");
  const [mdhDate] = useSharedLocalStorageString(SHARED_EMAIL_DATE_KEY, "");

  const bbcode = useMemo(
    () => generateDischargeEmailBBCode({ name, mdhDate, dischargeDate, reason, salutation, sigName, sigRank, signature }),
    [name, mdhDate, dischargeDate, reason, salutation, sigName, sigRank, signature],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bbcode);
      toast.success("Discharge email copied to clipboard", { theme: "dark" });
    } catch {
      toast.error("Couldn't copy to clipboard — check browser permissions.", {
        theme: "dark",
      });
    }
  };

  const [titleCopied, setTitleCopied] = useState(false);
  const copyTitle = async () => {
    try {
      await navigator.clipboard.writeText(DISCHARGE_EMAIL_TITLE);
      setTitleCopied(true);
      setTimeout(() => setTitleCopied(false), 1200);
    } catch {
      toast.error("Couldn't copy title.", { theme: "dark" });
    }
  };

  return (
    <Card className="border shadow-sm">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UserX className="h-4 w-4 text-muted-foreground" />
          EMR Discharge Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title indicator with its own copy button */}
        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/20 px-3 py-2">
          <span className="text-xs text-muted-foreground">Title:</span>
          <code className="text-xs font-mono text-foreground/80">{DISCHARGE_EMAIL_TITLE}</code>
          <button
            type="button"
            onClick={copyTitle}
            title="Copy title"
            aria-label="Copy title"
            className="cursor-pointer ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground"
          >
            {titleCopied ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Salutation</Label>
            <Select value={salutation} onValueChange={(v) => setSalutation(v)}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Mr. or Ms." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr.">Mr.</SelectItem>
                <SelectItem value="Ms.">Ms.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lastname"
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Discharge Date</Label>
            <div className="flex gap-1.5">
              <Input
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                placeholder="23/AUG/2026"
                className="bg-background flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setDischargeDate(todayFormatted())}
                className="shrink-0 text-xs"
              >
                Today
              </Button>
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Failure to complete training within the designated timeframe"
              className="bg-background"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Header title date, name, rank and signature image are pulled from the Shared Signature bar above.
        </p>

        <Button
          size="sm"
          onClick={handleCopy}
          className="px-6"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Discharge Email
        </Button>
      </CardContent>
    </Card>
  );
}