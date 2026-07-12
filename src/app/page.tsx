"use client";

import Image from "next/image";
import { EmployeeStatsTable } from "@/components/employee-stats/employee-stats-table";
import { AllDataTable } from "@/components/all-data-table/all-data-table";
import { MonthlySessionStatsTable } from "@/components/session-stats/monthly-session-stats-table";

export type TableDataType = {
  [key: string]: string | number;
};

export default function Home() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 space-x-3">
        <Image alt="FT" src="/FT.png" height={50} width={50} />
        <span>FT Session Reports</span>
      </h1>

      <AllDataTable />
      <EmployeeStatsTable />
      <MonthlySessionStatsTable />
    </div>
  );
}
