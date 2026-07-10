import Papa from "papaparse";
import { TableDataType } from "@/app/page";

/**
 * Fetches and parses employee stats data from /api/employee-stats
 */
export async function fetchEmployeeStats(): Promise<TableDataType[]> {
  try {
    const res = await fetch("/api/employee-stats");
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const rawData: TableDataType[] = parsed.data as TableDataType[];

    // The published sheet has a header banner row first, then active
    // employees, then an "Ex FTOs" sentinel that marks the end of the
    // active list. Slice everything before the sentinel; also drop the
    // banner row by starting at index 1.
    const stopIndex = rawData.findIndex((obj) => obj["Names"] === "Ex FTOs");

    let sliced =
      stopIndex > -1 ? rawData.slice(1, stopIndex) : rawData.slice(1);

    if (
      sliced.length &&
      Object.values(sliced[sliced.length - 1]).every((v) => !v)
    ) {
      sliced = sliced.slice(0, -1);
    }

    return sliced;
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    return [];
  }
}
