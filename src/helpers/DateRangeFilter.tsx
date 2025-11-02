"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  columnFilterValue: { start?: string; end?: string };
  setColumnFilter: (value: { start?: string; end?: string }) => void;
}

export function DateRangeFilter({
  columnFilterValue,
  setColumnFilter,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="date"
        value={columnFilterValue.start || ""}
        onChange={(e) =>
          setColumnFilter({ ...columnFilterValue, start: e.target.value })
        }
        className="w-36"
      />
      <span className="text-gray-500">to</span>
      <Input
        type="date"
        value={columnFilterValue.end || ""}
        onChange={(e) =>
          setColumnFilter({ ...columnFilterValue, end: e.target.value })
        }
        className="w-36"
      />
    </div>
  );
}
