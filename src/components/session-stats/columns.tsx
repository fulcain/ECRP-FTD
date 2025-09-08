import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type SheetRow = {
  [key: string]: string | number;
};

// Define a mapped type where ribbons are strings and Total Sessions is number
export type MonthlySessionStats = {
  "Employee Name": string;
  Sessions: string;
};

// Map raw CSV object keys to table-friendly keys, including ribbons
export function mappedMonthlySessionData(
  rawData: SheetRow[],
): MonthlySessionStats[] {
  return rawData.map((row) => ({
    "Employee Name": String(row["September"] ?? ""),
    Sessions: String(row["_1"]),
  }));
}

// Columns for your table
export const monthlySessionStatsColumns: ColumnDef<MonthlySessionStats>[] = [
  {
    accessorKey: "Employee Name",
    header: "Employee Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: "Sessions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Sessions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: (info) => info.getValue(),
    enableSorting: true,
    sortingFn: "basic",
  },
];
