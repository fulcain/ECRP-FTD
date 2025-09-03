"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { AllDataTable } from "@/components/all-data-table/all-data-table";
import { AllDataType } from "@/components/all-data-table/columns";
import { EmployeeStatsTable } from "@/components/employee-stats/employee-stats-table";

export default function Home() {
  const [allData, setAllData] = useState<AllDataType[]>([]);
  const [employeeData, setEmployeeData] = useState<AllDataType[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingEmployee, setLoadingEmployee] = useState(true);

  // Fetch all data for main table
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch("/api/all-data");
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setAllData(parsed.data as AllDataType[]);
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

        // Parse CSV
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        const data: AllDataType[] = parsed.data as AllDataType[];

        // Find the row where Names === "Ex FTOs"
        const stopIndex = data.findIndex((obj) => obj["Names"] === "Ex FTOs");

        // Slice from index 1 up to (but not including) that row
        let sliced = stopIndex > -1 ? data.slice(1, stopIndex) : data.slice(1);

        // Remove last object if it's empty
        if (
          sliced.length &&
          Object.values(sliced[sliced.length - 1]).every((v) => !v)
        ) {
          sliced = sliced.slice(0, -1);
        }

        setEmployeeData(sliced);
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
      <AllDataTable data={allData} />

      {/* Employee stats table */}
      <EmployeeStatsTable data={employeeData} />
    </div>
  );
}
