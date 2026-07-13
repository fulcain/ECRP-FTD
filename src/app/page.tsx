import { cookies } from "next/headers";
import Image from "next/image";

import { AUTH_COOKIE_NAME } from "@/lib/cookies";
import { verifySessionToken } from "@/lib/jwt";
import { hasSessionEditAccess } from "@/lib/role-config";

import { EmployeeStatsTable } from "@/components/employee-stats/employee-stats-table";
import { AllDataTable } from "@/components/all-data-table/all-data-table";
import { MonthlySessionStatsTable } from "@/components/session-stats/monthly-session-stats-table";

export type TableDataType = {
  [key: string]: string | number;
};

/**
 * `/` — the FT session reports landing page.
 *
 * Now a server component: pulls the JWT from the cookie once, asks
 * `hasSessionEditAccess` whether the visitor is allowed to edit FT
 * session rows, and passes that flag into <AllDataTable>. Doing this
 * on the server avoids a render flicker (the Actions column popping
 * in seconds after the table is hydrated) and reuses the same
 * role-check the `/api/update-session` route uses, so the table and
 * the API can't drift out of sync.
 *
 * The child components are still `"use client"` — they're rendered as
 * RSC children and stay interactive on the client.
 */
export default async function HomePage() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  const canEditFT = payload
    ? hasSessionEditAccess(payload.roles, payload.discordId)
    : false;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 space-x-3">
        <Image alt="FT" src="/FT.png" height={50} width={50} />
        <span>FT Session Reports</span>
      </h1>

      <AllDataTable canEditFT={canEditFT} />
      <EmployeeStatsTable />
      <MonthlySessionStatsTable />
    </div>
  );
}
