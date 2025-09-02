"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { AllDataTable } from "@/components/all-data-table/all-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { generateColumns, SheetRow } from "@/components/all-data-table/columns";
import { EmployeeStatsTable } from "@/components/employee-stats/employee-stats-table";

export default function SheetPage() {
  const [allData, setAllData] = useState<SheetRow[]>([]);
  const [employeeData, setEmployeeData] = useState<SheetRow[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingEmployee, setLoadingEmployee] = useState(true);

  const columns: ColumnDef<SheetRow>[] = generateColumns(allData, ["email address"]);

  // Fetch all data for main table
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch("/api/all-data");
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        setAllData(parsed.data as SheetRow[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAll(false);
      }
    };
    fetchAllData();
  }, []);

  // Fetch data for employee stats table
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const res = await fetch("/api/employee-stats");
        const csvText = await res.text();
				const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
				console.log(parsed)
        setEmployeeData(parsed.data as SheetRow[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEmployee(false);
      }
    };
    fetchEmployeeData();
  }, []);

  if (loadingAll || loadingEmployee)
    return <p className="text-center mt-10 text-gray-500">Loading data...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 space-x-3">
        <Image alt="FT" src="/FT.png" height={50} width={50} />
        <span>FT Session Reports</span>
      </h1>

      {/* Full data table */}
      <AllDataTable columns={columns} data={allData} />

      {/* Employee stats table */}
      <h2 className="text-2xl font-semibold mb-4">Employee Stats</h2>
      <EmployeeStatsTable data={employeeData} />
    </div>
  );
}
