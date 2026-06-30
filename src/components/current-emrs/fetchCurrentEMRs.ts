import Papa from "papaparse";
import { TableDataType } from "@/app/page";

/**
 * Fetches and parses the Current EMRs data from /api/current-emrs.
 *
 * The published sheet has two leading blank rows before the real header row.
 * If those aren't stripped, papaparse (header: true) uses a blank row as the
 * header and every value ends up keyed under "" / "_1" / "_2"…, so the table
 * renders blank. We drop leading empty/whitespace-only rows first.
 */
export async function fetchCurrentEMRs(): Promise<TableDataType[]> {
  try {
    const res = await fetch("/api/current-emrs");
    const csvText = await res.text();

    const lines = csvText.split(/\r?\n/);
    let firstContent = 0;
    while (
      firstContent < lines.length &&
      (lines[firstContent].trim() === "" ||
        /^,*$/.test(lines[firstContent].trim()))
    ) {
      firstContent++;
    }
    const cleaned = lines.slice(firstContent).join("\n");

    const parsed = Papa.parse<TableDataType>(cleaned, {
      header: true,
      skipEmptyLines: true,
    });

    return parsed.data;
  } catch (error) {
    console.error("[fetchCurrentEMRs] error:", error);
    return [];
  }
}
