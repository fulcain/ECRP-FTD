import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginButton } from "@/app/login/LoginButton";

export const metadata: Metadata = {
  title: "FTD App | Sign in",
  description: "Sign in with Discord to access the FTD app.",
};

/**
 * /login
 *
 * Replaces the old password modal. The "Continue with Discord" button
 * navigates to /api/auth/discord/login?returnTo=<encoded original path>,
 * which 302-redirects to Discord's authorize URL.
 *
 * We can't read search params on the page directly (Suspense is required
 * for static analysis), so the interactive parts live in <LoginButton>.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Image alt="FT" src="/FT.png" height={60} width={60} priority />
          <h1 className="text-2xl font-bold text-center">
            ECRP Field Training Portal
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Restricted access — sign in with Discord to continue.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginButton />
        </Suspense>

        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          You must be a member of the ECRP Discord server.{" "}
        </p>
      </div>
    </div>
  );
}
