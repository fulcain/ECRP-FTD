"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
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

import { SheetRow, employeeColumns, mapEmployeeData } from "@/components/employee-stats/columns";

interface EmployeeStatsTableProps {
  data: SheetRow[];
}

export function EmployeeStatsTable({ data }: EmployeeStatsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "Total Sessions", desc: true }, // default sort by highest
  ]);
  const [pageSizeInput, setPageSizeInput] = React.useState(10);
  const [nameFilter, setNameFilter] = React.useState("");

  // Map raw CSV data to table-friendly keys & cast Total Sessions to number
  const mappedData = React.useMemo(
    () =>
      mapEmployeeData(data).map((row) => ({
        ...row,
        "Total Sessions": Number(row["Total Sessions"] || 0),
      })),
    [data],
  );

  // Filter rows by Employee Name
  const tableRows = React.useMemo(
    () =>
      mappedData.filter((row) =>
        (row["Employee Name"] || "")
          .toString()
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

  React.useEffect(() => {
    table.setPageSize(Number(pageSizeInput) || 1);
  }, [pageSizeInput, table]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold  text-gray-300 mb-6">
        Employee Stats Table
      </h2>

      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filter Employee Name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
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
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>

        <span className="ml-2 text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <span className="ml-4 text-sm text-gray-500">Rows per page:</span>
        <input
          type="number"
          min={1}
          className="border rounded px-2 py-1 w-16"
          value={pageSizeInput}
          onChange={(e) => setPageSizeInput(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
