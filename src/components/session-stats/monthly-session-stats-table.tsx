"use client";
import React from "react";
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

import { useState, useEffect,useMemo } from "react";

import {
  mappedMonthlySessionData,
  monthlySessionStatsColumns,
} from "@/components/session-stats/columns";
import { fetchSessionStats } from "@/components/session-stats/fetchMonthlySession";
import { TableDataType } from "@/app/page";

export function MonthlySessionStatsTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Sessions", desc: true },
  ]);
  const [pageSizeInput, setPageSizeInput] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [data, setData] = useState<TableDataType[]>([]);
  const [totalMonthSessions, setTotalMonthSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
		const { totalMonthSessions, monthlyData } = await fetchSessionStats();

		setTotalMonthSessions(totalMonthSessions);
        setData(monthlyData as TableDataType[]);
      } catch (err) {
        console.error("Failed to load session stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const mappedData = useMemo(
    () => mappedMonthlySessionData(data).map((row) => ({ ...row })),
    [data],
  );
const tableRows = useMemo(() => {
  const filtered = mappedData.filter((row) =>
    (row['Employee Name'] || '')
      .toString()
      .toLowerCase()
      .includes(nameFilter.toLowerCase())
  );


  return filtered;
}, [mappedData, nameFilter]);

  const table = useReactTable({
    data: tableRows,
    columns: monthlySessionStatsColumns,
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

      {/* Filters */}
      <div className="flex items-center py-4 space-x-4">
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
          <>
            <Skeleton className="h-96 w-full rounded-b" />
          </>
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
