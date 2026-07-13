import Papa from "papaparse";
import { TableDataType } from "@/app/page";

/**
 * Fetches and parses all-data CSV from /api/all-data.
 *
 * Each row is stamped with `__csvIndex` (0-based position in the
 * post-header CSV) so the edit dialog can map any visible row back
 * to its 1-based sheet row. With the header at sheet row 1, the
 * formula is simply `__csvIndex + 2`. Injecting at fetch time keeps
 * the index correct through downstream sort / filter / pagination
 * because each row carries its own identity.
 */
export async function fetchAllData(): Promise<TableDataType[]> {
  try {
    const res = await fetch("/api/all-data");
    const csvText = await res.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return (parsed.data as TableDataType[]).map((row, i) => ({
      ...row,
      __csvIndex: i,
    }));
  } catch (error) {
    console.error("Error fetching all data:", error);
    return [];
  }
}
