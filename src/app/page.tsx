import { cookies } from "next/headers";
import Image from "next/image";

import { AUTH_COOKIE_NAME } from "@/lib/cookies";
import { verifySessionToken } from "@/lib/jwt";
import { hasSessionEditAccess } from "@/lib/role-config";

import { EmployeeStatsTable } from "@/components/employee-stats/employee-stats-table";
import { AllDataTable } from "@/components/all-data-table/all-data-table";
import { MonthlySessionStatsTable } from "@/components/session-stats/monthly-session-stats-table";
import { PageContainer } from "@/components/ui/page-container";

export type TableDataType = {
  [key: string]: string | number;
};

export default async function HomePage() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  const canEditFT = payload
    ? hasSessionEditAccess(payload.roles, payload.discordId)
    : false;

  return (
    <PageContainer className="space-y-12">
      <header className="mb-2 flex flex-col items-center gap-3 text-center">
        <Image alt="FT" src="/FT.png" height={40} width={40} className="opacity-90" />
        <h1 className="text-2xl font-semibold tracking-tight">FT Session Reports</h1>
      </header>

      <AllDataTable canEditFT={canEditFT} />
      <EmployeeStatsTable />
      <MonthlySessionStatsTable />
    </PageContainer>
  );
}