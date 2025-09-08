import Papa from "papaparse";
import { TableDataType } from "@/app/page";

/**
 * Fetches and parses all data CSV from /api/all-data
 */
export async function fetchAllData(): Promise<TableDataType[]> {
  try {
    const res = await fetch("/api/all-data");
    const csvText = await res.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return parsed.data as TableDataType[];
  } catch (error) {
    console.error("Error fetching all data:", error);
    return [];
  }
}
