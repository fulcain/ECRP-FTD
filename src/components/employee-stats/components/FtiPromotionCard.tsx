"use client";

import { useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Check, Copy, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSharedLocalStorageString } from "@/app/hooks/useLocalStorage";

import {
  generateFtiPromotionEmailBBCode,
  FTI_PROMOTION_TITLE,
  SHARED_SIG_NAME_KEY,
  SHARED_SIG_RANK_KEY,
  SHARED_FTD_RANK_KEY,
  SHARED_SIGNATURE_KEY,
  SHARED_EMAIL_DATE_KEY,
} from "@/components/employee-stats/lib/generate-fti-promotion-bbcode";

export function FtiPromotionCard() {
  const [sigName] = useSharedLocalStorageString(SHARED_SIG_NAME_KEY, "");
  const [sigRank] = useSharedLocalStorageString(SHARED_SIG_RANK_KEY, "");
  const [ftdRank] = useSharedLocalStorageString(SHARED_FTD_RANK_KEY, "");
  const [signature] = useSharedLocalStorageString(SHARED_SIGNATURE_KEY, "");
  const [date] = useSharedLocalStorageString(SHARED_EMAIL_DATE_KEY, "");

  const bbcode = useMemo(
    () => generateFtiPromotionEmailBBCode({ name: sigName, rank: sigRank, ftdRank, signature, date }),
    [sigName, sigRank, ftdRank, signature, date],
  );

  const hasRequired = sigName.trim() !== "" && signature.trim() !== "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bbcode);
      toast.success("FTI Promotion email copied to clipboard", { theme: "dark" });
    } catch {
      toast.error("Couldn't copy to clipboard — check browser permissions.", { theme: "dark" });
    }
  };

  const [titleCopied, setTitleCopied] = useState(false);
  const copyTitle = async () => {
    try {
      await navigator.clipboard.writeText(FTI_PROMOTION_TITLE);
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
          <Mail className="h-4 w-4 text-muted-foreground" />
          FTI Promotion Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title indicator with its own copy button */}
        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/20 px-3 py-2">
          <span className="text-xs text-muted-foreground">Title:</span>
          <code className="text-xs font-mono text-foreground/80">{FTI_PROMOTION_TITLE}</code>
          <button
            type="button"
            onClick={copyTitle}
            title="Copy title"
            aria-label="Copy title"
            className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground"
          >
            {titleCopied ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Date, name, rank, FTD rank and signature are pulled from the Shared Signature bar above.
        </p>

        <Button
          size="sm"
          disabled={!hasRequired}
          onClick={copyToClipboard}
          className="px-6"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy FTI Promotion Email
        </Button>
      </CardContent>
    </Card>
  );
}