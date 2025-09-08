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

    // Find the row where Names === "Ex FTOs"
    const stopIndex = rawData.findIndex((obj) => obj["Names"] === "Ex FTOs");

    // Slice from index 1 up to (but not including) that row
    let sliced =
      stopIndex > -1 ? rawData.slice(1, stopIndex) : rawData.slice(1);

    // Remove last object if it's empty
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
