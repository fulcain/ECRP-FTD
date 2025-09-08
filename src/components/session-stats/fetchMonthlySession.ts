import Papa from "papaparse";

import { TableDataType } from "@/app/page";

export async function fetchSessionStats() {
  const res = await fetch("/api/session-stats");
  const csvText = await res.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  // Find index where September === "Total Month Sessions"
  const totalMonthIndex = parsed.data.findIndex(
    (row: any) => row["September"] === "Total Month Sessions",
  );

  let totalMonthSessions = 0;
  if (totalMonthIndex !== -1) {
    const totalMonthsObject = parsed.data[totalMonthIndex] as TableDataType;
    totalMonthSessions = Number(totalMonthsObject["_1"] ?? 0);
  }

  // Find the index of the row where September === "Employee"
  const startIndex = parsed.data.findIndex(
    (row: any) => row["September"] === "Employee",
  );

  // Slice the array from the next row after "Employee" to the end
  const filteredData =
    startIndex >= 0 ? parsed.data.slice(startIndex + 1) : parsed.data;

  return {
    totalMonthSessions,
    monthlyData: filteredData as TableDataType[],
  };
}
