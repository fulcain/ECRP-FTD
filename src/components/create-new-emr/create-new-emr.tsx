"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchCurrentEMRs } from "@/components/current-emrs/fetchCurrentEMRs";

interface CreateNewEMRProps {
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export function CreateNewEMR({ setData }: CreateNewEMRProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const payload = { ...form };

      const res = await fetch("/api/create-new-emr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("EMR record created successfully", { theme: "dark" });

        // setForm({
        //   EMR: "",
        //   profileLink: "",
        //   startDate: "",
        //   trainingReminder: "",
        //   fourWeeks: "",
        //   reminderSent: false,
        //   reinstatee: false,
        //   loa: false,
        //   notes: "",
        // });

        const fresh = await fetchCurrentEMRs();
        setData(fresh);
      } else {
        toast.error(
          `Something went wrong: ${result.error ?? result.raw ?? "unknown error"}`,
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

      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
        Create New EMR Record
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border p-4 rounded-lg"
      >
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
            onChange={(e) => setForm({ ...form, profileLink: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Start Date</Label>
          <Input
            placeholder="Enter Date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
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
            onChange={(e) => setForm({ ...form, fourWeeks: e.target.value })}
          />
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
            onCheckedChange={(checked) => setForm({ ...form, loa: !!checked })}
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

        <Button type="submit" disabled={submitting} className="mt-2 w-full">
          {submitting ? "Saving..." : "Create Record"}
        </Button>
      </form>
    </>
  );
}
