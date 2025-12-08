"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { monthlySessionStatsColumns } from "@/components/session-stats/columns";
import { fetchAllData } from "@/components/all-data-table/fetchAllData";
import { TableDataType } from "@/app/page";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthlySessionStatsTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Sessions", desc: true },
  ]);
  const [pageSizeInput, setPageSizeInput] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [data, setData] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const currentYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [totalMonthSessions, setTotalMonthSessions] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allData = await fetchAllData();
        setData(allData);
      } catch (err) {
        console.error("Failed to load master sheet data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const yearList = useMemo(() => {
    if (!data?.length) return [currentYear];

    const setYears = new Set<string>();

    data.forEach((row) => {
      const dateStr = row["Timestamp"] || row["Date"] || row["date"];
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        setYears.add(d.getFullYear().toString());
      }
    });

    return Array.from(setYears).sort();
  }, [data]);

  const monthData = useMemo(() => {
    if (!data?.length) return [];

    const counts: Record<string, number> = {};

    data.forEach((row) => {
      const dateStr = row["Timestamp"] || row["Date"] || row["date"];
      const name = String(row["Your Name"] || "").trim();
      const d = new Date(dateStr);

      if (isNaN(d.getTime())) return;

      const month = d.toLocaleString("en-US", { month: "long" });
      const year = d.getFullYear().toString();

      if (month === selectedMonth && year === selectedYear && name) {
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    const result = Object.entries(counts).map(([name, count]) => ({
      "Your Name": name,
      Sessions: count.toString(),
    }));

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    setTotalMonthSessions(total);

    return result;
  }, [data, selectedMonth, selectedYear]);

  const tableRows = useMemo(() => {
    return monthData.filter((row) =>
      row["Your Name"].toLowerCase().includes(nameFilter.toLowerCase()),
    );
  }, [monthData, nameFilter]);

  const table = useReactTable({
    data: tableRows,
    columns: monthlySessionStatsColumns(),
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(Number(pageSizeInput) || 1);
  }, [pageSizeInput, table]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
        Monthly Session Stats Table
      </h2>

      <div className="flex flex-wrap items-center gap-4 py-4">
        {loading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px] text-white border">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="text-gray-100">
                {yearList.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px] text-white border">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="text-gray-100">
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Filter Your Name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="max-w-sm"
            />

            <div className="text-xl">
              <span>Total Sessions: </span>
              <span className="font-bold text-red-400">{totalMonthSessions}</span>
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
                    colSpan={monthlySessionStatsColumns.length}
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
