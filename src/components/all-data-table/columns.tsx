"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type SheetRow = {
  [key: string]: string;
};

/**
 * Generates columns dynamically from data
 * Excludes any keys provided in `excludeKeys`
 */
export function generateColumns(
  data: SheetRow[],
  excludeKeys: string[] = []
): ColumnDef<SheetRow>[] {
  if (!data || data.length === 0) return [];

  return Object.keys(data[0])
    .filter((key) => !excludeKeys.includes(key.toLowerCase()))
    .map((key) => {
      const headerLabel = key.charAt(0).toUpperCase() + key.slice(1);

      // Add custom header for Timestamp column to enable sorting
      if (key.toLowerCase() === "timestamp") {
        return {
          accessorKey: key,
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center"
            >
              {headerLabel}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
        } as ColumnDef<SheetRow>;
      }

      // Default column
      return {
        accessorKey: key,
        header: headerLabel,
      } as ColumnDef<SheetRow>;
    });
}
