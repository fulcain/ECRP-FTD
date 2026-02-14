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
import { fetchEMRs } from "@/helpers/fetchEMRs";
import { XCircle, RotateCcw } from "lucide-react";

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
  const [emrSearch, setEmrSearch] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [EMRs, setEMRs] = useState<string[]>([]);

  const [form, setForm] = useState({
    yourName: "",
    date: undefined as Date | undefined,
    timeStart: "",
    timeFinish: "",
    emrName: "",
    emrNameManual: "",
    sessionConducted: "",
  });

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

  useEffect(() => {
    const loadEMRs = async () => {
      try {
        const emrs = await fetchEMRs();
        if (emrs) setEMRs(emrs.map(String));
      } catch (err) {
        console.error("Error fetching EMRs:", err);
      }
    };
    loadEMRs();
  }, []);

  const resetEMRSelection = () => {
    setForm({
      ...form,
      emrName: "",
      emrNameManual: "",
    });
    setEmrSearch(""); 
    toast.info("EMR field cleared", { theme: "dark" });
  };

  const resetNameSelection = () => {
    setForm({
      ...form,
      yourName: "",
    });
    setNameSearch(""); 
    toast.info("Name field cleared", { theme: "dark" });
  };

  const handleEmrSelectOpenChange = (open: boolean) => {
    if (!open) {
      setEmrSearch(""); 
    }
  };

  const handleNameSelectOpenChange = (open: boolean) => {
    if (!open) {
      setNameSearch(""); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emrNameToUse = form.emrName || form.emrNameManual;

    if (
      !form.yourName ||
      !form.date ||
      !form.timeStart ||
      !form.timeFinish ||
      !emrNameToUse ||
      !form.sessionConducted
    ) {
      toast.error("Fill all the fields", { theme: "dark" });
      return;
    }

    setSubmitting(true);
    try {
      const formatTime12h = (time24: string) => {
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute}:00 ${ampm}`;
      };

      const payload = {
        ...form,
        emrName: emrNameToUse,
        timeStart: formatTime12h(form.timeStart),
        timeFinish: formatTime12h(form.timeFinish),
        date: format(form.date!, "M/dd/yyyy"),
      };

      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Session created successfully", { theme: "dark" });
        setForm({
          yourName: "",
          date: undefined,
          timeStart: "",
          timeFinish: "",
          emrName: "",
          emrNameManual: "",
          sessionConducted: "",
        });
        setEmrSearch(""); 

        const fresh = await fetchAllData();
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

  const isEmrSelected = form.emrName || form.emrNameManual;
  const isNameSelected = form.yourName;

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
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Your Name</Label>
            {isNameSelected && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetNameSelection}
                className="h-7 px-2 text-muted-foreground hover:text-destructive gap-1"
              >
                <XCircle className="h-4 w-4" />
                <span className="text-xs">Clear</span>
              </Button>
            )}
          </div>
          <Select
            value={form.yourName}
            onValueChange={(v) => setForm({ ...form, yourName: v })}
            onOpenChange={handleNameSelectOpenChange}
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
                  {dropdowns?.names
                    ?.filter((name) =>
                      name.toLowerCase().includes(nameSearch.toLowerCase()),
                    )
                    .map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

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

        <div className="flex flex-col gap-2">
          <Label>Time Start</Label>
          <Input
            type="time"
            value={form.timeStart}
            onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Time Finish</Label>
          <Input
            type="time"
            value={form.timeFinish}
            onChange={(e) => setForm({ ...form, timeFinish: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>{"EMR's Name"}</Label>
            {isEmrSelected && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetEMRSelection}
                className="h-7 px-2 text-muted-foreground hover:text-destructive gap-1"
              >
                <XCircle className="h-4 w-4" />
                <span className="text-xs">Clear</span>
              </Button>
            )}
          </div>

          <Select
            value={form.emrName}
            onValueChange={(v) => {
              setForm({ ...form, emrName: v, emrNameManual: "" });
              setEmrSearch(""); 
            }}
            onOpenChange={handleEmrSelectOpenChange}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Select EMR" />
            </SelectTrigger>
            <SelectContent>
              {EMRs.length === 0 ? (
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
                      placeholder="Search EMR..."
                      value={emrSearch}
                      onChange={(e) => setEmrSearch(e.target.value)}
                      className="mb-2"
                      autoFocus
                    />
                  </div>
                  {EMRs.filter((emr) =>
                    emr.toLowerCase().includes(emrSearch.toLowerCase()),
                  ).map((emr) => (
                    <SelectItem key={emr} value={emr}>
                      {emr}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          <div className="relative">
            <Input
              placeholder="Type EMR name manually"
              value={form.emrNameManual}
              onChange={(e) =>
                setForm({ ...form, emrNameManual: e.target.value, emrName: "" })
              }
              className={form.emrNameManual ? "pr-8" : ""}
            />
            {form.emrNameManual && (
              <button
                type="button"
                onClick={() => setForm({ ...form, emrNameManual: "" })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          {isEmrSelected && (
            <p className="text-xs text-muted-foreground mt-1">
              Selected: {form.emrName || form.emrNameManual}
              {form.emrName && " (from list)"}
              {form.emrNameManual && " (manual entry)"}
            </p>
          )}
        </div>

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

        <div className="flex gap-2 mt-2 items-center justify-center">
          <Button type="submit" disabled={submitting} className="">
            {submitting ? "Saving..." : "Create Session"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setForm({
                yourName: "",
                date: undefined,
                timeStart: "",
                timeFinish: "",
                emrName: "",
                emrNameManual: "",
                sessionConducted: "",
              });
              setEmrSearch("");
              setNameSearch("");
              toast.info("Form reset", { theme: "dark" });
            }}
            className="px-3"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </>
  );
}
