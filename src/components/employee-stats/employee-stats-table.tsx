"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";

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
  employeeColumns,
  mapEmployeeData,
} from "@/components/employee-stats/columns";
import { fetchEmployeeStats } from "@/components/employee-stats/fetchEmployeeStats";
import { Pagination } from "@/components/pagination";
import { TableDataType } from "@/app/page";

export function EmployeeStatsTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Total Sessions", desc: true },
  ]);
  const [pageSizeInput, setPageSizeInput] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [data, setData] = useState<TableDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const stats = await fetchEmployeeStats();
      setData(stats);
      setLoading(false);
    };
    loadData();
  }, []);

  const mappedData = useMemo(
    () =>
      mapEmployeeData(data).map((row) => ({
        ...row,
        "Total Sessions": Number(row["Total Sessions"] || 0),
      })),
    [data],
  );

  const tableRows = useMemo(
    () =>
      mappedData.filter((row) =>
        ((row as any)["Employee Name"] || "")
          .toLowerCase()
          .includes(nameFilter.toLowerCase()),
      ),
    [mappedData, nameFilter],
  );

  const table = useReactTable({
    data: tableRows,
    columns: employeeColumns,
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
        Employee Stats Table
      </h2>

      {/* Filters */}
      <div className="flex items-center py-4 space-x-4">
        {loading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <Input
            placeholder="Filter Employee Name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="max-w-sm"
          />
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
                    colSpan={employeeColumns.length}
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
