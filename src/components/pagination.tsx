"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  table: any;
  pageSize: number;
  setPageSize: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  table,
  pageSize,
  setPageSize,
}) => {
  return (
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
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      />
    </div>
  );
};
