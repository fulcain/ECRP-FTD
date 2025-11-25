"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchAllData } from "@/components/all-data-table/fetchAllData";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CreateNewSessionProps {
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  setDropdowns: React.Dispatch<
    React.SetStateAction<{ names: string[]; sessions: string[] }>
  >;
  dropdowns: { names: string[]; sessions: string[] };
}

export function CreateNewSession({
  setData,
  dropdowns,
  setDropdowns,
}: CreateNewSessionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [dateOpen, setDateOpen] = useState(false);

  const [form, setForm] = useState({
    yourName: "",
    date: undefined as Date | undefined,
    timeStart: "",
    timeFinish: "",
    emrName: "",
    sessionConducted: "",
  });

  // Fetch form names
  useEffect(() => {
    const loadFormNames = async () => {
      try {
        const res = await fetch("/api/get-fto-names");
        const data = await res.json();
        setDropdowns((prev) => ({ ...prev, names: data.options }));
      } catch (err) {
        console.error("Error fetching form names:", err);
      }
    };
    loadFormNames();
  }, [setDropdowns]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.yourName ||
      !form.date ||
      !form.timeStart ||
      !form.timeFinish ||
      !form.emrName ||
      !form.sessionConducted
    ) {
      toast.error("Fill all the fields", { theme: "dark" });
      return;
    }

    setSubmitting(true);

    try {
      // Convert time from "HH:MM" to "h:mm:ss AM/PM"
      const formatTime12h = (time24: string) => {
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        if (hour === 0) hour = 12;
        return `${hour}:${minute}:00 ${ampm}`;
      };

      const payload = {
        ...form,
        timeStart: formatTime12h(form.timeStart),
        timeFinish: formatTime12h(form.timeFinish),
        date: format(form.date!, "MM/dd/yyyy"),
      };

      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Session created successfully ", { theme: "dark" });
        setForm({
          yourName: "",
          date: undefined,
          timeStart: "",
          timeFinish: "",
          emrName: "",
          sessionConducted: "",
        });

        const fresh = await fetchAllData();
        setData(fresh);
      } else {
        toast.error(
          `Something went wrong: ${result.error ?? result.raw ?? "unknown error"}`,
          { theme: "dark" },
        );
      }
    } catch (err) {
      toast.error("Network error or Apps Script blocked ", { theme: "dark" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
        Create new FTD session
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border p-4 rounded-lg"
      >
        {/* Your Name */}
        <div className="flex flex-col gap-2">
          <Label>Your Name</Label>
          <Select
            value={form.yourName}
            onValueChange={(v) => setForm({ ...form, yourName: v })}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Select your name" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.names?.length === 0 ? (
                <div className="p-2 cursor-pointer">
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              ) : (
                <>
                  <div
                    className="p-2 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      placeholder="Search..."
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      className="mb-2"
                      autoFocus
                    />
                  </div>
                  {dropdowns.names
                    .filter((name) =>
                      name.toLowerCase().includes(nameSearch.toLowerCase()),
                    )
                    .map((name) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={name}
                        value={name}
                      >
                        {name}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label>Date</Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {form.date ? format(form.date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.date}
                onSelect={(date) => {
                  setForm({ ...form, date });
                  setDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Start */}
        <div className="flex flex-col gap-2">
          <Label>Time Start</Label>
          <Input
            type="time"
            value={form.timeStart}
            onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
          />
        </div>

        {/* Time Finish */}
        <div className="flex flex-col gap-2">
          <Label>Time Finish</Label>
          <Input
            type="time"
            value={form.timeFinish}
            onChange={(e) => setForm({ ...form, timeFinish: e.target.value })}
          />
        </div>

        {/* EMR Name */}
        <div className="flex flex-col gap-2">
          <Label>{"EMR's Name"}</Label>
          <Input
            placeholder="Enter EMR's Name"
            type="text"
            value={form.emrName}
            onChange={(e) => setForm({ ...form, emrName: e.target.value })}
          />
        </div>

        {/* Session Conducted */}
        <div className="flex flex-col gap-2">
          <Label>Session Conducted</Label>
          <Select
            value={form.sessionConducted}
            onValueChange={(v) => setForm({ ...form, sessionConducted: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns.sessions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={submitting} className="mt-2 w-full">
          {submitting ? "Saving..." : "Create Session"}
        </Button>
      </form>
    </>
  );
}
