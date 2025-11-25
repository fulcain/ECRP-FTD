"use client";
import { useState, useMemo } from "react";
import { format, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateColumns } from "@/components/all-data-table/columns";
import { TableDataType } from "@/app/page";

import { fetchAllData } from "@/components/all-data-table/fetchAllData";
import { Pagination } from "@/components/pagination";

export function AllDataTable() {
  const [data, setData] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState(true);

  // Static dropdowns for testing
  const [dropdowns] = useState({
    names: ["Name 1", "Name 2"],
    sessions: ["Session A", "Session B", "Session C"],
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columns: ColumnDef<TableDataType>[] = generateColumns();
  const [pageSizeInput, setPageSizeInput] = useState(10);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    yourName: "",
    date: "",
    timeStart: "",
    timeFinish: "",
    emrName: "",
    sessionConducted: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch sheet data (can leave as-is for testing)
  useState(() => {
    const loadData = async () => {
      const allData = await fetchAllData();
      setData(allData);
      setLoading(false);
    };
    loadData();
  });

  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return data;

    return data.filter((row) => {
      const dateStr = row["Date"] as string | undefined;
      if (!dateStr) return true;
      const rowDate = new Date(dateStr);
      if (startDate && isBefore(rowDate, startDate)) return false;
      if (endDate && isAfter(rowDate, endDate)) return false;
      return true;
    });
  }, [data, startDate, endDate]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useState(() => {
    table.setPageSize(Number(pageSizeInput) || 1);
  });

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
      toast.error("Fill all the fields");
      return;
    }

    setSubmitting(true);
    try {
      console.log("Submitting form:", JSON.stringify(form));

      // POST to our Next.js API route
      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Session logged successfully ");
        setForm({
          yourName: "",
          date: "",
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
        );
        console.error("Apps Script response:", result);
      }
    } catch (err) {
      toast.error("Network error or Apps Script blocked 😭");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 mt-40">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
        Field Training Session Reports
      </h2>

      {/* ---- New Session Form ---- */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-4 border border-gray-700 p-4 rounded-lg bg-gray-900/40"
      >
        {/* Static Name dropdown */}
        <Select
          value={form.yourName}
          onValueChange={(v) => setForm({ ...form, yourName: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Your Name" />
          </SelectTrigger>
          <SelectContent>
            {dropdowns.names.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <Input
          type="time"
          value={form.timeStart}
          onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
          placeholder="Time Start"
        />

        <Input
          type="time"
          value={form.timeFinish}
          onChange={(e) => setForm({ ...form, timeFinish: e.target.value })}
          placeholder="Time Finish"
        />

        <Input
          type="text"
          placeholder="EMR's Name"
          value={form.emrName}
          onChange={(e) => setForm({ ...form, emrName: e.target.value })}
        />

        {/* Static Session dropdown */}
        <Select
          value={form.sessionConducted}
          onValueChange={(v) => setForm({ ...form, sessionConducted: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Session Conducted" />
          </SelectTrigger>
          <SelectContent>
            {dropdowns.sessions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="submit"
          disabled={submitting}
          className="md:col-span-3 mt-2"
        >
          {submitting ? "Saving..." : "Create Session"}
        </Button>
      </form>

      {/* ---- Filters, Table, Pagination ---- */}
      <div className="flex items-center py-4 space-x-4">
        {loading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <>
            <Input
              placeholder="Filter Your Name..."
              value={
                (table.getColumn("Your Name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("Your Name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            {/* Start Date Picker */}
            <Popover open={startOpen} onOpenChange={setStartOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!startDate}
                  className="w-[180px] justify-between font-normal"
                >
                  {startDate ? format(startDate, "PPP") : "Start date"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* End Date Picker */}
            <Popover open={endOpen} onOpenChange={setEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!endDate}
                  className="w-[180px] justify-between font-normal"
                >
                  {endDate ? format(endDate, "PPP") : "End date"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setEndDate(date);
                    setEndOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="text-xl">
              <span>Total Sessions: </span>
              <span className="font-bold text-red-400">
                {table.getFilteredRowModel().rows.length}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        {loading ? (
          <Skeleton className="h-96 w-full rounded-b" />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && (
        <Pagination
          table={table}
          pageSize={pageSizeInput}
          setPageSize={setPageSizeInput}
        />
      )}
    </div>
  );
}
