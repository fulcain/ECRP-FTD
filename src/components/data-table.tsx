"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
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
// import { DateRangeFilter } from "@/helpers/DateRangeFilter";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [pageSizeInput, setPageSizeInput] = React.useState(10);
  // const [timestampFilter, setTimestampFilter] = React.useState<{
  //   start?: string;
  //   end?: string;
  // }>({});

  const table = useReactTable({
    data,
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
    filterFns: {
      dateRange: (
        row,
        columnId,
        filterValue: { start?: string; end?: string },
      ) => {
        const cellValue = row.getValue(columnId) as string;

        // Parse the timestamp string "M/D/YYYY H:mm:ss"
        const [datePart, timePart] = cellValue.split(" ");
        if (!datePart) return false;

        const [month, day, year] = datePart.split("/").map(Number);
        const [hours = 0, minutes = 0, seconds = 0] = timePart
          ? timePart.split(":").map(Number)
          : [];

        const cellDate = new Date(
          year,
          month - 1,
          day,
          hours,
          minutes,
          seconds,
        );

        const start = filterValue.start
          ? new Date(filterValue.start)
          : undefined;
        const end = filterValue.end ? new Date(filterValue.end) : undefined;

        if (start && end) return cellDate >= start && cellDate <= end;
        if (start) return cellDate >= start;
        if (end) return cellDate <= end;

        return true;
      },
    },
  });

  // Update page size when input changes
  React.useEffect(() => {
    table.setPageSize(Number(pageSizeInput) || 1);
  }, [pageSizeInput, table]);

  return (
    <div className="space-y-4">
      {/* Filter and Total Sessions */}
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

        {/* <DateRangeFilter */}
        {/*   columnFilterValue={timestampFilter} */}
        {/*   setColumnFilter={(val) => { */}
        {/*     setTimestampFilter(val); */}
        {/*     table.getColumn("Timestamp")?.setFilterValue(val); */}
        {/*   }} */}
        {/* /> */}
        <span className="text-sm text-gray-700">
          Total Sessions: {table.getFilteredRowModel().rows.length}
        </span>
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
