"use client";

import * as React from "react";
import { format, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function AllDataTable<T extends { Date?: string }>({
  columns,
  data,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pageSizeInput, setPageSizeInput] = React.useState(10);

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

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
    state: {
      sorting,
      columnFilters,
    },
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
          value={
            (table.getColumn("Your Name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("Your Name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Start Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!startDate}
              className="data-[empty=true]:text-muted-foreground w-[180px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
<PopoverContent
  align="start"
  className="w-auto p-2 rounded-md border shadow-md 
             bg-white border-gray-200 
             dark:bg-gray-800 dark:border-gray-700"
>
  <Calendar
    mode="single"
    selected={startDate}
    onSelect={setStartDate}
  />
</PopoverContent>
        </Popover>

        {/* End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!endDate}
              className="data-[empty=true]:text-muted-foreground w-[180px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
<PopoverContent
  align="start"
  className="w-auto p-2 rounded-md border shadow-md 
             bg-white border-gray-200 
             dark:bg-gray-800 dark:border-gray-700"
>
  <Calendar
    mode="single"
    selected={endDate}
    onSelect={setEndDate}
  />
</PopoverContent>
        </Popover>

        <div className="text-xl">
          <span>Total Sessions: </span>
          <span className="font-bold text-red-400">
            {table.getFilteredRowModel().rows.length}
          </span>
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
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
