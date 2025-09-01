"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { generateColumns, SheetRow } from "@/components/columns";

export default function SheetPage() {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<SheetRow>[] = generateColumns(data, [
    "email address",
  ]);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch("/api/sheet");
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setData(parsed.data as SheetRow[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading data...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 space-x-3">
        <Image alt="FT" src="/FT.png" height={50} width={50} />
        <span>FT Session Reports</span>
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
