import Papa from "papaparse";
import { TableDataType } from "@/app/page";

/**
 * Fetches and parses employee stats data from /api/current-emrs
 * Returns an array of all EMR values (key "") after slicing the first two rows
 */
export async function fetchEMRs() {
  try {
    const res = await fetch("/api/current-emrs");
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const rawData = parsed.data.slice(2) as TableDataType[];

    const emrs = rawData.map((row) => row[""] || "");

    return emrs;
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    return [];
  }
}
