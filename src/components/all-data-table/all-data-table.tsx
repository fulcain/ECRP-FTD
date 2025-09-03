"use client";

import * as React from "react";
import { format, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { generateColumns, AllDataType } from "@/components/all-data-table/columns";

interface DataTableProps<T> {
  data: T[];
}

export function AllDataTable<T extends { Date?: string }>({ data }: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const columns: ColumnDef<AllDataType>[] = generateColumns();

  const [pageSizeInput, setPageSizeInput] = React.useState(10);

  // Date picker states
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const filteredData = React.useMemo(() => {
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

  React.useEffect(() => {
    table.setPageSize(Number(pageSizeInput) || 1);
  }, [pageSizeInput, table]);

  return (
    <div className="space-y-4 mt-40">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
        Field Training Session Reports
      </h2>

      {/* Filters */}
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filter Your Name..."
          value={(table.getColumn("Your Name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Your Name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        {/* Start Date Picker */}
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" data-empty={!startDate} className="w-[180px] justify-between font-normal">
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
            <Button variant="outline" data-empty={!endDate} className="w-[180px] justify-between font-normal">
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
          <span className="font-bold text-red-400">{table.getFilteredRowModel().rows.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>

        <span className="ml-2 text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
