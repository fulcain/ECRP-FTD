"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TableDataType } from "@/app/page";

/**
 * Date, Instructor's Name, EMR's Name, Session Conducted, Time Start, Time Finish, Timestamp
 */
export const generateColumns = (): ColumnDef<TableDataType>[] => [
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.getValue("Date") as string;
      const dateB = rowB.getValue("Date") as string;

      const finishA = rowA.getValue("Time Finish") as string;
      const finishB = rowB.getValue("Time Finish") as string;

      const tsA = new Date(`${dateA} ${finishA}`).getTime();
      const tsB = new Date(`${dateB} ${finishB}`).getTime();

      return tsA - tsB;
    },
  },
  {
    accessorKey: "Your Name",
    header: "Instructor's Name",
  },
  {
    accessorKey: "EMR's Name",
    header: "EMR's Name",
  },
  {
    accessorKey: "Session Conducted",
    header: "Session Conducted",
  },
  {
    accessorKey: "Time Start",
    header: "Time Start",
  },
  {
    accessorKey: "Time Finish",
    header: "Time Finish",
  },
  {
    accessorKey: "Timestamp",
    header: "Timestamp",
  },
];
