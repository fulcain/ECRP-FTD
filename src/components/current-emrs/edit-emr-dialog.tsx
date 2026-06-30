"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface EditEMRDialogProps {
  row: TableDataType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setData: React.Dispatch<React.SetStateAction<TableDataType[]>>;
}

// Normalize the sheet's "TRUE"/"FALSE" strings into booleans for the checkbox.
const toBool = (value: unknown) =>
  String(value).trim().toUpperCase() === "TRUE";

/**
 * Edit dialog for a single EMR row. Pre-fills every field from the selected
 * row, posts the full updated row to /api/update-emr on save, then refetches.
 */
export function EditEMRDialog({
  row,
  open,
  onOpenChange,
  setData,
}: EditEMRDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    EMR: "",
    profileLink: "",
    startDate: "",
    trainingReminder: "",
    fourWeeks: "",
    reminderSent: false,
    reinstatee: false,
    loa: false,
    notes: "",
  });

  // Seed the form from the selected row whenever it changes.
  useEffect(() => {
    if (!row) return;
    setForm({
      EMR: String(row["EMR"] ?? ""),
      startDate: String(row["Start Date"] ?? ""),
      trainingReminder: String(row["Training Reminder Date"] ?? ""),
      fourWeeks: String(row["4 Weeks"] ?? ""),
      reminderSent: toBool(row["Reminder Sent?"]),
      reinstatee: toBool(row["Reinstatee?"]),
      loa: toBool(row["LOA?"]),
      notes: String(row["Notes"] ?? ""),
      profileLink: String(row["Profile Link"] ?? "")
    });
  }, [row]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!row) return;

    if (
      !form.EMR ||
      !form.profileLink ||
      !form.trainingReminder ||
      !form.startDate ||
      !form.fourWeeks
    ) {
      toast.error("Fill all required fields", { theme: "dark" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/update-emr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Keep the original name so the backend can locate the row even if
          // the user renames the EMR.
          originalEMR: String(row["EMR"] ?? ""),
          ...form,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("EMR record updated successfully", { theme: "dark" });
        // Update the row in local state immediately so the table
        // reflects the change right away (published CSV can be cached).
        const updatedRow: TableDataType = {
          "EMR": form.EMR,
          "Start Date": form.startDate,
          "Training Reminder Date": form.trainingReminder,
          "4 Weeks": form.fourWeeks,
          "Reminder Sent?": form.reminderSent ? "TRUE" : "FALSE",
          "Reinstatee?": form.reinstatee ? "TRUE" : "FALSE",
          "LOA?": form.loa ? "TRUE" : "FALSE",
          "Notes": form.notes,
          "Profile Link": form.profileLink,
        };
        setData((prev) =>
          prev.map((r) =>
            String(r["EMR"] ?? "").trim().toLowerCase() ===
            String(row["EMR"] ?? "").trim().toLowerCase()
              ? { ...r, ...updatedRow }
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
            <DialogTitle>Edit EMR Record</DialogTitle>
            <DialogDescription>
              Update the fields for this EMR record. Changes are saved to the
              sheet.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>EMR Name</Label>
              <Input
                placeholder="Enter EMR's Name"
                value={form.EMR}
                onChange={(e) => setForm({ ...form, EMR: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>EMR Profile Link</Label>
              <Input
                placeholder="Enter EMR profile URL"
                value={form.profileLink}
                onChange={(e) =>
                  setForm({ ...form, profileLink: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Start Date</Label>
              <Input
                placeholder="Enter Date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Training Reminder Date</Label>
              <Input
                placeholder="Enter Date"
                value={form.trainingReminder}
                onChange={(e) =>
                  setForm({ ...form, trainingReminder: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>4 Weeks</Label>
              <Input
                placeholder="Enter Date"
                value={form.fourWeeks}
                onChange={(e) =>
                  setForm({ ...form, fourWeeks: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.reminderSent}
                onCheckedChange={(checked) =>
                  setForm({ ...form, reminderSent: !!checked })
                }
              />
              <Label>Reminder Sent?</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.reinstatee}
                onCheckedChange={(checked) =>
                  setForm({ ...form, reinstatee: !!checked })
                }
              />
              <Label>Reinstatee?</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.loa}
                onCheckedChange={(checked) =>
                  setForm({ ...form, loa: !!checked })
                }
              />
              <Label>LOA?</Label>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Notes</Label>
              <Input
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
