import { ColumnDef } from "@tanstack/react-table";
import { TableDataType } from "@/app/page";

const StatusBox = ({ value }: { value: string }) => {
  const isTrue = value === "TRUE";
  return (
    <div
      className={`w-4 h-4 rounded-full ${isTrue ? "bg-green-500" : "bg-red-500"}`}
      title={isTrue ? "Yes" : "No"}
    />
  );
};

export function mapEmployeeDataRaw(rawData: TableDataType[]): TableDataType[] {
  return rawData.slice(1).map((row) => ({
    EMR: row[""] ?? "",
    "Start Date": row["_1"] ?? "",
    "Training Reminder Date": row["_2"] ?? "",
    "4 Weeks": row["_3"] ?? "",
    "Reminder Sent?": row["_4"] ?? "",
    "Reinstatee?": row["_5"] ?? "",
    "LOA?": row["_6"] ?? "",
    Notes: row["_7"] ?? "",
  }));
}

// Columns for the table
export const currentEMRColumns: ColumnDef<TableDataType>[] = [
  {
    accessorKey: "EMR",
    header: "EMR",
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: "Start Date",
    header: "Start Date",
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: "Training Reminder Date",
    header: "Training Reminder Date",
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: "4 Weeks",
    header: "4 Weeks",
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: "Reminder Sent?",
    header: "Reminder Sent?",
    cell: (info) => <StatusBox value={info.getValue() as string} />,
  },
  {
    accessorKey: "Reinstatee?",
    header: "Reinstatee?",
    cell: (info) => <StatusBox value={info.getValue() as string} />,
  },
  {
    accessorKey: "LOA?",
    header: "LOA?",
    cell: (info) => <StatusBox value={info.getValue() as string} />,
  },
  { accessorKey: "Notes", header: "Notes", cell: (info) => info.getValue() },
];
