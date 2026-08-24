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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
        <HeaderDesktop headerLinks={visibleLinks} />
        <HeaderMobile headerLinks={visibleLinks} />

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/FT.png"
            alt="FTD App"
            width={28}
            height={28}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}