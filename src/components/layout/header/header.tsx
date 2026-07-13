import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { HeaderMobile } from "./components/header-mobile";
import { HeaderDesktop } from "./components/header-desktop";
import { headerLinks } from "@/components/layout/header/configs/HeaderLinks";
import { UserMenu } from "@/components/layout/header/components/UserMenu";
import { AUTH_COOKIE_NAME } from "@/lib/cookies";
import { verifySessionToken } from "@/lib/jwt";
import { filterAccessibleLinks } from "@/lib/role-config";

export const dynamic = "force-dynamic";


export async function Header() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  const visibleLinks = filterAccessibleLinks(
    headerLinks,
    payload?.roles ?? null,
    payload?.discordId,
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-4">
        <HeaderDesktop headerLinks={visibleLinks} />
        <HeaderMobile headerLinks={visibleLinks} />
        <Link
          href="/"
          className="text-lg font-semibold text-white transition-colors hover:text-slate-300"
        >
          <Image
            src="https://i.ibb.co/hFgqLTmk/General.png"
            alt="logo"
            width={50}
            height={50}
          />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
