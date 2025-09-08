import Papa from "papaparse";
// TODO: change this
import { AllDataType } from "./columns";

/**
 * Fetches and parses all data CSV from /api/all-data
 */
export async function fetchAllData(): Promise<AllDataType[]> {
  try {
    const res = await fetch("/api/all-data");
    const csvText = await res.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return parsed.data as AllDataType[];
  } catch (error) {
    console.error("Error fetching all data:", error);
    return [];
  }
}
