import Papa from "papaparse";
import { TableDataType } from "@/app/page";

/**
 * Fetches and parses employee stats data from /api/current-emrs
 */
export async function fetchCurrentEMRs(): Promise<TableDataType[]> {
  try {
    const res = await fetch("/api/current-emrs");
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const rawData = parsed.data as TableDataType[];
    console.log(rawData);

    // Slice from index 2 to skip the first row
    return rawData.slice(2);
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    return [];
  }
}
