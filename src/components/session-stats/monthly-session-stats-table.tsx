"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  mappedMonthlySessionData,
  monthlySessionStatsColumns,
} from "@/components/session-stats/columns";
import { fetchSessionStats } from "@/components/session-stats/fetchMonthlySession";
import { TableDataType } from "@/app/page";

/** static client-side months list */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function MonthlySessionStatsTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Sessions", desc: true },
  ]);
  const [pageSizeInput, setPageSizeInput] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [data, setData] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const current = new Date().toLocaleString("en-US", { month: "long" });
    return MONTHS.includes(current) ? current : "January";
  });

  /** total sessions just for fun summary display */
  const [totalMonthSessions, setTotalMonthSessions] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { monthlyData } = await fetchSessionStats();
        setData(monthlyData as TableDataType[]);
      } catch (err) {
        console.error("Failed to load session stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /** map & filter rows by selectedMonth and search term */
  const filteredRows = useMemo(() => {
    const filtered = data.filter((row) => {
      const name = (row["Employee Name"] || "")
        .toString()
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const monthValue = row[selectedMonth];
      return name && monthValue !== undefined && monthValue !== "";
    });
    const totalSessions = filtered.reduce(
      (sum, row) => sum + (Number(row[selectedMonth]) || 0),
      0
    );
    setTotalMonthSessions(totalSessions);
    return filtered;
  }, [data, nameFilter, selectedMonth]);

  const mappedData = useMemo(
    () => mappedMonthlySessionData(filteredRows).map((r) => ({ ...r })),
    [filteredRows]
  );

  /** table config */
  const table = useReactTable({
    data: mappedData,
    columns: monthlySessionStatsColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /** page size */
  useEffect(() => {
    table.setPageSize(Number(pageSizeInput) || 1);
  }, [pageSizeInput, table]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
        Monthly Session Stats Table
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 py-4">
        {loading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <>
            <Input
              placeholder="Filter Your Name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="max-w-sm"
            />

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-500 bg-gray-800 text-gray-100 rounded px-3 py-2"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="text-xl">
              <span>Total Sessions: </span>
              <span className="font-bold text-red-400">
                {totalMonthSessions}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        {loading ? (
          <Skeleton className="h-96 w-full rounded-b" />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((r) => (
                  <TableRow key={r.id}>
                    {r.getVisibleCells().map((c) => (
                      <TableCell key={c.id}>
                        {flexRender(
                          c.column.columnDef.cell,
                          c.getContext()
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

      {/* Pagination */}
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
