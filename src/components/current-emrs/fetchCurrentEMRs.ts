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

export interface EMRProfileLink {
  EMR: string;
  profileLink: string;
}

/**
 * Fetches and parses the Current EMRs data from /api/current-emrs, returning
 * only column A (EMR) and column I (profileLink) as a flat array of objects.
 *
 * This parses by raw column position rather than header name, since it skips
 * the same leading blank rows as fetchCurrentEMRs but still includes the
 * header row itself in the slice — so we additionally drop the first row
 * after cleaning (the actual header) to keep only data rows.
 */
export async function fetchEMRProfileLinks(): Promise<EMRProfileLink[]> {
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

    const parsed = Papa.parse<string[]>(cleaned, {
      header: false,
      skipEmptyLines: true,
    });

    // Drop the header row (first row after cleaning leading blanks).
    const rows = parsed.data.slice(1);

    return rows
      .map((row) => ({
        EMR: (row[0] ?? "").trim(),
        profileLink: (row[8] ?? "").trim(), // column I = index 8
      }))
      .filter((entry) => entry.EMR !== "" || entry.profileLink !== "");
  } catch (error) {
    console.error("[fetchEMRProfileLinks] error:", error);
    return [];
  }
}