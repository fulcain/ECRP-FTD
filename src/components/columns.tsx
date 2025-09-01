"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SheetRow = {
  [key: string]: string;
};

/**
 * Generates columns dynamically from data
 * Excludes any keys provided in `excludeKeys`
 */
export function generateColumns(
  data: SheetRow[],
  excludeKeys: string[] = []
): ColumnDef<SheetRow>[] {
  if (!data || data.length === 0) return [];

  return Object.keys(data[0])
    .filter((key) => !excludeKeys.includes(key.toLowerCase()))
    .map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    }));
}
