"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableDataType } from "@/app/page";

interface EditSessionDialogProps {
  row: TableDataType | null;
  originalRowNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setData: React.Dispatch<React.SetStateAction<TableDataType[]>>;
}

/**
 * Edit dialog for a single FT session row.
 *
 * The Apps Script update handler locates the row by **sheet row
 * number** — sent as `originalRowNumber` — so the row lookup is
 * purely positional and dodges every timezone / display-format /
 * cell-type pitfall that bit the earlier `originalTimestamp`
 * strategies. We also send `originalTimestamp` so the Apps Script
 * can sanity-check that the row we landed on is the row we
 * intended (catches the rare case where the published CSV row
 * order drifted from the live sheet).
 *
 * After a successful save we patch the row in `setData` by
 * Timestamp equality so the table reflects the edit before the
 * published CSV re-caches.
 */
export function EditSessionDialog({
  row,
  originalRowNumber,
  open,
  onOpenChange,
  setData,
}: EditSessionDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    Timestamp: "",
    yourName: "",
    date: "",
    timeStart: "",
    timeFinish: "",
    emrName: "",
    sessionConducted: "",
  });

  useEffect(() => {
    if (!row) return;
    setForm({
      Timestamp: String(row["Timestamp"] ?? ""),
      yourName: String(row["Your Name"] ?? ""),
      date: String(row["Date"] ?? ""),
      timeStart: String(row["Time Start"] ?? ""),
      timeFinish: String(row["Time Finish"] ?? ""),
      emrName: String(row["EMR's Name"] ?? ""),
      sessionConducted: String(row["Session Conducted"] ?? ""),
    });
  }, [row]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!row) return;

    if (
      !form.yourName ||
      !form.date ||
      !form.timeStart ||
      !form.timeFinish ||
      !form.emrName ||
      !form.sessionConducted
    ) {
      toast.error("Fill all required fields", { theme: "dark" });
      return;
    }

    if (originalRowNumber == null) {
      toast.error(
        "Missing sheet row identifier — reload the table so the CSV index re-syncs.",
        { theme: "dark" },
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalRowNumber: String(originalRowNumber),
          originalTimestamp: String(row["Timestamp"] ?? ""),
          yourName: form.yourName,
          date: form.date,
          timeStart: form.timeStart,
          timeFinish: form.timeFinish,
          emrName: form.emrName,
          sessionConducted: form.sessionConducted,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("FT session updated successfully", { theme: "dark" });
        const updatedRow: TableDataType = {
          ...row,
          "Date": form.date,
          "Your Name": form.yourName,
          "Time Start": form.timeStart,
          "Time Finish": form.timeFinish,
          "EMR's Name": form.emrName,
          "Session Conducted": form.sessionConducted,
        };
        setData((prev) =>
          prev.map((r) =>
            String(r["Timestamp"] ?? "") === String(row["Timestamp"] ?? "")
              ? updatedRow
              : r,
          ),
        );
        onOpenChange(false);
      } else {
        toast.error(
          `Something went wrong: ${result.error ?? result.raw ?? JSON.stringify(result)}`,
          { theme: "dark" },
        );
      }
    } catch (err) {
      toast.error("Network error or Apps Script blocked", { theme: "dark" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit FT Session</DialogTitle>
            <DialogDescription>
              Update the fields for this FT session row.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
              <Label>Sheet Row</Label>
              <Input
                value={
                  originalRowNumber != null ? String(originalRowNumber) : "—"
                }
                readOnly
                disabled
                className="bg-muted/40 cursor-not-allowed text-muted-foreground font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Instructor's Name</Label>
              <Input
                placeholder="Enter instructor's name"
                value={form.yourName}
                onChange={(e) =>
                  setForm({ ...form, yourName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Input
                placeholder="Enter date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Time Start (UTC)</Label>
                <Input
                  placeholder="Enter start time"
                  value={form.timeStart}
                  onChange={(e) =>
                    setForm({ ...form, timeStart: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Time Finish (UTC)</Label>
                <Input
                  placeholder="Enter finish time"
                  value={form.timeFinish}
                  onChange={(e) =>
                    setForm({ ...form, timeFinish: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>EMR's Name</Label>
              <Input
                placeholder="Enter EMR's name"
                value={form.emrName}
                onChange={(e) =>
                  setForm({ ...form, emrName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Session Conducted</Label>
              <Input
                placeholder="What was conducted in this session?"
                value={form.sessionConducted}
                onChange={(e) =>
                  setForm({ ...form, sessionConducted: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
