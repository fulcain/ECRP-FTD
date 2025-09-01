"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type SheetRow = {
  [key: string]: string | number;
};

/**
 * Generates two columns:
 * - Employee Name (unique)
 * - Total Sessions (based on filtered rows)
 * Total Sessions has a clickable sort button
 */
export const employeeColumns: ColumnDef<SheetRow>[] = [
  {
    accessorKey: "Your Name",
    header: "Employee Name", // plain text header
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: "Total Sessions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Total Sessions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) => info.getValue(),
    enableSorting: true,
    sortingFn: "basic",
  },
];

/**
 * Returns unique rows with numeric Total Sessions for sorting
 */
export function getUniqueEmployeeRows(data: SheetRow[], nameFilter = ""): SheetRow[] {
  const filtered = data.filter((row) =>
    (row["Your Name"] || "Unknown")
      .toString()
      .toLowerCase()
      .includes(nameFilter.toLowerCase())
  );

  const aggregated: Record<string, number> = {};
  filtered.forEach((row) => {
    const name = (row["Your Name"] || "Unknown").toString().trim();
    aggregated[name] = (aggregated[name] || 0) + 1;
  });

  return Object.entries(aggregated).map(([name, total]) => ({
    "Your Name": name,
    "Total Sessions": total,
  }));
}
